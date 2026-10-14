import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Heart,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Mail,
  User,
  History,
  FileCheck,
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Hash,
} from 'lucide-react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Contribution } from '../types/index.ts';
import { ThankYouReceipt } from './ThankYouReceipt.tsx';

export const UPI_CONFIG = {
  upiId: '7855939099-3@ybl',
  receiverName: 'Akshya Kumar Senapati',
  schoolName: "St. Mary's School, Jajpur Road",
  defaultNote: 'St Marys Golden Jubilee Fund',
};

interface UpiPaymentFlowProps {
  onSuccess?: (contribution: Contribution) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const UpiPaymentFlow: React.FC<UpiPaymentFlowProps> = ({
  onCancel,
  isModal = false,
}) => {
  const { submitContribution, checkEmailUsage } = useJubilee();

  // Step state: 1 = Email & Session, 2 = Amount & Details, 3 = UPI QR & App, 4 = Screenshot & UTR, 5 = Certificate
  const [step, setStep] = useState<number>(1);

  // Email & Session states
  const [email, setEmail] = useState<string>('');
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<{
    checked: boolean;
    used: boolean;
    count: number;
    lastContribution: Contribution | null;
  }>({
    checked: false,
    used: false,
    count: 0,
    lastContribution: null,
  });

  // Amount & Donor states
  const [selectedTier, setSelectedTier] = useState<string>('Golden Patron');
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [role, setRole] = useState<Contribution['role']>('Alumnus');
  const [batchYear, setBatchYear] = useState<string>('Batch of 2005');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // QR Code & Payment states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Proof & Verification states (Choice between Screenshot OR Transaction ID)
  const [proofMode, setProofMode] = useState<'screenshot' | 'utr'>('screenshot');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [completedContribution, setCompletedContribution] = useState<Contribution | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load any existing session from localStorage on initial render
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('marian_donor_last_email');
      if (savedEmail) {
        setEmail(savedEmail);
        handleLookupEmail(savedEmail);
      }
    } catch {
      // ignore
    }
  }, []);

  // Standard predefined donation tiers
  const tiers = [
    { name: 'Silver Supporter', amount: 1000, description: 'Commemorative digital badge & name on Jubilee Scroll' },
    { name: 'Golden Patron', amount: 5000, description: 'Golden Jubilee patron certificate & souvenir acknowledgment' },
    { name: 'Platinum Benefactor', amount: 10000, description: 'Commemorative brass plaque engraving & VIP reception pass' },
    { name: 'Diamond Visionary', amount: 25000, description: 'Auditorium seat naming privilege & permanent honor board entry' },
  ];

  // Lookup email memory
  const handleLookupEmail = async (emailToTest: string) => {
    const clean = emailToTest.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      return;
    }
    setCheckingEmail(true);
    try {
      const result = await checkEmailUsage(clean);
      setEmailStatus({
        checked: true,
        used: result.used,
        count: result.count,
        lastContribution: result.lastContribution,
      });

      // Pre-fill fields if previous contribution exists
      if (result.lastContribution) {
        if (!donorName) setDonorName(result.lastContribution.donorName || '');
        if (!phone) setPhone(result.lastContribution.phone || '');
        if (result.lastContribution.role) setRole(result.lastContribution.role);
        if (result.lastContribution.batchYear) setBatchYear(result.lastContribution.batchYear);
      }
    } catch (err) {
      console.error('Error looking up email:', err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    try {
      localStorage.setItem('marian_donor_last_email', email.trim());
    } catch {
      // ignore
    }
    setStep(2);
  };

  const handleSelectPreset = (tierName: string, tierAmount: number) => {
    setSelectedTier(tierName);
    setAmount(tierAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
      setSelectedTier('Custom Donor');
    }
  };

  // Generate UPI deep link & dynamic QR code
  const generateUpiUri = () => {
    const params = new URLSearchParams({
      pa: UPI_CONFIG.upiId,
      pn: UPI_CONFIG.receiverName,
      am: amount.toString(),
      cu: 'INR',
      tn: `${UPI_CONFIG.defaultNote} - ${donorName.trim() || 'Contributor'}`,
    });
    return `upi://pay?${params.toString()}`;
  };

  const upiUri = generateUpiUri();

  // Regenerate dynamic QR code whenever amount or donorName changes
  useEffect(() => {
    if (step >= 2) {
      QRCode.toDataURL(upiUri, {
        width: 340,
        margin: 2,
        color: {
          dark: '#5A0506',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [upiUri, step]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Handle Screenshot file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit payment & generate official receipt
  const handleSubmitFinal = async () => {
    if (proofMode === 'screenshot' && !screenshotData) {
      alert('Please select and upload your payment confirmation screenshot.');
      return;
    }

    if (proofMode === 'utr' && !utrNumber.trim()) {
      alert('Please enter your 12-digit UPI Transaction Reference ID (UTR).');
      return;
    }

    setSubmitting(true);
    try {
      const contributionData: Partial<Contribution> = {
        donorName: donorName.trim() || 'Generous Contributor',
        role,
        batchYear: role === 'Alumnus' ? batchYear : undefined,
        email: email.trim(),
        phone: phone.trim(),
        amount,
        tier: selectedTier as any,
        paymentMethod: 'UPI Payment',
        paymentRef: proofMode === 'utr' && utrNumber.trim() ? `UTR-${utrNumber.trim()}` : `UPI-${Date.now().toString().slice(-8)}`,
        message: message.trim(),
        isAnonymous,
        screenshotUrl: proofMode === 'screenshot' ? (screenshotData || undefined) : undefined,
        utrNumber: proofMode === 'utr' ? (utrNumber.trim() || undefined) : undefined,
        upiId: UPI_CONFIG.upiId,
        receiverName: UPI_CONFIG.receiverName,
        status: 'completed',
      };

      const created = await submitContribution(contributionData);
      setCompletedContribution(created);

      // Save to localStorage session
      try {
        const sessionKey = `marian_session_${email.trim().toLowerCase()}`;
        localStorage.setItem(sessionKey, JSON.stringify(created));
        localStorage.setItem('marian_donor_last_email', email.trim());
      } catch {
        // ignore
      }

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#850B0C', '#FEF3C7', '#F59E0B'],
      });

      setStep(5);
    } catch (err) {
      console.error('Submission error:', err);
      alert('There was an issue submitting your payment details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setScreenshotData(null);
    setScreenshotName('');
    setUtrNumber('');
    setCompletedContribution(null);
  };

  return (
    <div className={`w-full ${isModal ? 'max-w-3xl' : 'max-w-4xl'} mx-auto bg-[#FAF7F2] rounded-3xl shadow-2xl border border-amber-300/80 overflow-hidden relative text-stone-900`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#480304] via-[#5A0506] to-[#7A0A0B] text-amber-100 p-5 sm:p-6 border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md shrink-0 border border-amber-300">
            <img
              src="/school-logo.png"
              alt="St. Mary's School Emblem"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-amber-200 tracking-wide">
              Golden Jubilee Contribution & UPI Portal
            </h2>
            <p className="text-xs text-amber-200/80">
              St. Mary's School, Jajpur Road • Official 50th Golden Jubilee Endowment (1976–2026)
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-amber-200/80 hover:text-amber-100 hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Instructional Multi-Step Flow Indicator */}
      {step < 5 && (
        <div className="bg-amber-100/70 border-b border-amber-200 px-4 sm:px-8 py-3">
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] sm:text-xs font-semibold">
            <div className={`flex items-center justify-center gap-1.5 pb-1 ${step >= 1 ? 'text-[#850B0C] border-b-2 border-[#850B0C] font-bold' : 'text-stone-400'}`}>
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1. Email & Memory</span>
              <span className="sm:hidden">1. Email</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 pb-1 ${step >= 2 ? 'text-[#850B0C] border-b-2 border-[#850B0C] font-bold' : 'text-stone-400'}`}>
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2. Amount & Info</span>
              <span className="sm:hidden">2. Amount</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 pb-1 ${step >= 3 ? 'text-[#850B0C] border-b-2 border-[#850B0C] font-bold' : 'text-stone-400'}`}>
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3. Scan QR / App</span>
              <span className="sm:hidden">3. UPI Pay</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 pb-1 ${step >= 4 ? 'text-[#850B0C] border-b-2 border-[#850B0C] font-bold' : 'text-stone-400'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">4. Verification Proof</span>
              <span className="sm:hidden">4. Proof</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Explanation & Email / Session Memory Check */}
      {step === 1 && (
        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Clear Instruction Banner Explaining What to Do */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                💡
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  How Direct UPI Contribution Works
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  Enter your email address to begin. We maintain your session memory so you can easily track past contributions, download your official certificate, or contribute anew without repeating your information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A0506] text-amber-200 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Select contribution amount</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A0506] text-amber-200 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Scan dynamic QR or open app</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A0506] text-amber-200 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Upload screenshot & get receipt</span>
              </div>
            </div>
          </div>

          {/* Email Input Form */}
          <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailStatus.checked) {
                      setEmailStatus((prev) => ({ ...prev, checked: false }));
                    }
                  }}
                  onBlur={() => handleLookupEmail(email)}
                  className="w-full pl-10 pr-24 py-3 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-2 focus:ring-[#850B0C]/20 text-sm font-medium outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleLookupEmail(email)}
                  disabled={checkingEmail || !email.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {checkingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Check Memory</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                Your digital Golden Jubilee Patron Certificate and tax acknowledgment will be linked to this email.
              </p>
            </div>

            {/* Session Memory Status Card */}
            {emailStatus.checked && emailStatus.used && emailStatus.lastContribution && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <History className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">
                      Existing Contributor Record Found!
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Welcome back, <strong>{emailStatus.lastContribution.donorName}</strong>! You previously contributed{' '}
                      <strong>₹{emailStatus.lastContribution.amount.toLocaleString('en-IN')}</strong> on{' '}
                      {new Date(emailStatus.lastContribution.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      (Receipt: <span className="font-mono">{emailStatus.lastContribution.receiptNumber}</span>).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCompletedContribution(emailStatus.lastContribution);
                      setStep(5);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View / Download Previous Certificate</span>
                  </button>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 font-semibold text-xs transition-colors"
                  >
                    Make Another Contribution
                  </button>
                </div>
              </div>
            )}

            {emailStatus.checked && !emailStatus.used && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>New contributor email recognized! Let's proceed to choose your contribution amount.</span>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:gap-3"
              >
                <span>Continue to Amount Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Step 2: Amount Selection & Donor Details */}
      {step === 2 && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 2 of 4</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Select Your Contribution Tier
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Supporting email: <strong className="text-stone-800">{email}</strong>
            </p>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {tiers.map((t) => {
              const isSelected = selectedTier === t.name && !customAmount;
              return (
                <div
                  key={t.name}
                  onClick={() => handleSelectPreset(t.name, t.amount)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/90 border-[#850B0C] ring-2 ring-[#850B0C]/20 shadow-md'
                      : 'bg-white border-stone-200 hover:border-amber-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-stone-900 text-sm">{t.name}</span>
                      <span className="font-sans font-black text-[#850B0C] text-lg">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-snug">{t.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Amount */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Or Enter A Custom Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
              <input
                type="number"
                min="100"
                placeholder="e.g. 15000"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-1 focus:ring-[#850B0C] text-sm font-semibold outline-none"
              />
            </div>
          </div>

          {/* Donor Information */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
              Contributor Details (Appears on Certificate)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aksgya Kumar Senapati"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Association with School *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none bg-white font-medium"
                >
                  <option value="Alumnus">Proud Marian Alumnus / Alumna</option>
                  <option value="Parent">Parent of Current / Former Student</option>
                  <option value="Former Teacher">Former Teacher / Faculty</option>
                  <option value="Staff">School Staff Member</option>
                  <option value="Well-Wisher">Well-Wisher & Friend of St. Mary's</option>
                </select>
              </div>

              {role === 'Alumnus' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ICSE Batch Year / Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Batch of 2005"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp / Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Jubilee Blessing / Tribute (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Share a short greeting for the 50th Golden Jubilee..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#850B0C] focus:ring-[#850B0C]"
                />
                <label htmlFor="anonCheck" className="text-xs text-stone-600">
                  Keep my name anonymous on the public Wall of Honour
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!donorName.trim()) {
                  alert('Please enter your full name');
                  return;
                }
                setStep(3);
              }}
              className="px-7 py-3 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <span>Generate UPI QR for ₹{amount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Dynamic QR Code & Direct Mobile App Intent */}
      {step === 3 && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 3 of 4</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Pay ₹{amount.toLocaleString('en-IN')} via UPI
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Scan using any UPI app or tap below to open Google Pay, PhonePe, or Paytm directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Dynamic QR Code Card */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 text-center shadow-md flex flex-col items-center">
              
              {/* Donor Name Banner on QR Card */}
              <div className="w-full bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border border-amber-300/80 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-sm">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block">
                    Donor Name
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-tight">
                    {donorName || 'Generous Contributor'}
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    {role} {batchYear ? `• ${batchYear}` : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-stone-500 block">Tier</span>
                  <span className="text-xs font-bold text-[#850B0C] px-2 py-0.5 rounded-full bg-white border border-amber-200">
                    {selectedTier}
                  </span>
                </div>
              </div>

              <div className="relative p-3 bg-white border border-stone-200 rounded-2xl shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="St Marys UPI QR Code"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#850B0C]" />
                  </div>
                )}
                {/* Center Badge in QR */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-stone-950 font-black text-xs px-2 py-0.5 rounded-full border border-stone-900 shadow">
                  ₹{amount}
                </div>
              </div>

              <span className="text-[11px] text-stone-500 font-semibold mt-3">
                Scan with GPay, PhonePe, Paytm, BHIM, CRED or Any UPI App
              </span>

              {/* Amount Tag */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#850B0C] font-black text-sm">
                <span>Amount: ₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Direct App Launch & UPI ID Box */}
            <div className="space-y-4">
              
              {/* Payment & Receiver Info Box (with Donor Name) */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                
                {/* Prominent Donor Identity Header on Card */}
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 bg-amber-50/50 -mx-2 -mt-2 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5A0506] text-amber-200 font-serif font-black text-xs flex items-center justify-center shadow-sm">
                      {donorName ? donorName.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">
                        Donor Name
                      </span>
                      <span className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-none">
                        {donorName || 'Generous Contributor'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#850B0C] border border-amber-300 shadow-xs">
                    {selectedTier}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500">Official Receiver:</span>
                  <span className="font-bold text-stone-900">{UPI_CONFIG.receiverName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">School Fund:</span>
                  <span className="font-semibold text-stone-800">{UPI_CONFIG.schoolName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500">UPI ID:</span>
                  <span className="font-mono font-bold text-[#850B0C]">{UPI_CONFIG.upiId}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500">Amount to Transfer:</span>
                  <span className="font-sans font-black text-sm text-[#850B0C]">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Copy UPI Button */}
              <button
                type="button"
                onClick={handleCopyUpiId}
                className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">UPI ID Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>Copy UPI ID ({UPI_CONFIG.upiId})</span>
                  </>
                )}
              </button>

              {/* Mobile Deep Link: Open App */}
              <div className="bg-gradient-to-br from-[#480304] to-[#7A0A0B] p-5 rounded-2xl text-amber-100 text-center shadow-lg space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-300" />
                  <span className="font-serif font-bold text-sm text-amber-200">
                    On a Mobile Phone?
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-snug">
                  Contributing as <strong className="text-amber-200 underline">{donorName || 'Donor'}</strong>. Tap below to launch your phone's payment app with the exact ₹{amount} amount pre-filled!
                </p>

                <a
                  href={upiUri}
                  className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm shadow-md transition-all transform hover:scale-[1.02]"
                >
                  ⚡ Pay via UPI App (GPay / PhonePe / Paytm)
                </a>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NPCI UPI Certified Direct Transfer</span>
              </div>

            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-7 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Paid → Verify Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Upload Payment Screenshot & Enter UTR Reference */}
      {step === 4 && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 4 of 4</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Verify Your Payment
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Choose <strong>either</strong> method below to verify your contribution — you only need to provide one.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            {/* Mutually Exclusive Selector: Option A vs Option B */}
            <div className="bg-stone-100 p-1.5 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProofMode('screenshot')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  proofMode === 'screenshot'
                    ? 'bg-[#5A0506] text-amber-200 shadow-md ring-2 ring-amber-400/40'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Option 1: Upload Screenshot</span>
              </button>

              <button
                type="button"
                onClick={() => setProofMode('utr')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  proofMode === 'utr'
                    ? 'bg-[#5A0506] text-amber-200 shadow-md ring-2 ring-amber-400/40'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>Option 2: Enter Transaction ID</span>
              </button>
            </div>

            {/* OPTION 1: Upload Screenshot UI */}
            {proofMode === 'screenshot' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Payment Confirmation Screenshot *
                  </label>
                  <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    No transaction ID needed
                  </span>
                </div>

                {screenshotData ? (
                  <div className="relative border-2 border-emerald-300 rounded-2xl p-4 bg-emerald-50/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={screenshotData}
                        alt="Uploaded Screenshot"
                        className="w-16 h-16 object-cover rounded-xl border border-stone-200 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="truncate max-w-[200px]">{screenshotName || 'Payment_Screenshot.png'}</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-0.5">Screenshot ready for certificate generation</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotData(null);
                        setScreenshotName('');
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 rounded-full hover:bg-white transition-colors"
                      title="Remove Screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-300 hover:border-[#850B0C] rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-amber-50/30 hover:bg-amber-50/60 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-[#850B0C] flex items-center justify-center shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-stone-800">
                        Click to upload or drag & drop payment screenshot
                      </span>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        PNG, JPG, or WEBP from GPay, PhonePe, Paytm, etc. (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* OPTION 2: Enter UPI Transaction ID / UTR UI */}
            {proofMode === 'utr' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    12-Digit UPI Transaction ID / UTR Number *
                  </label>
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    No screenshot needed
                  </span>
                </div>

                <div className="relative">
                  <Hash className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 425189340211"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-2 focus:ring-[#850B0C]/20 text-sm font-mono font-semibold outline-none transition-all"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-200 text-[#850B0C] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    i
                  </div>
                  <div>
                    <strong className="text-stone-800">Where to find your 12-digit UTR:</strong>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Open your Google Pay, PhonePe, or Paytm app → tap on the payment details for <strong>Akshya Kumar Senapati</strong> → copy the 12-digit <em>UPI Transaction ID / Ref No / UTR</em>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary preview */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Donor Name:</span>
                <strong className="text-stone-900">{donorName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Contribution Tier:</span>
                <strong className="text-stone-900">{selectedTier}</strong>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <strong className="text-[#850B0C] font-bold text-sm">₹{amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span>{UPI_CONFIG.receiverName} ({UPI_CONFIG.upiId})</span>
              </div>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to QR</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitFinal}
              disabled={submitting || (proofMode === 'screenshot' ? !screenshotData : !utrNumber.trim())}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Recording Contribution...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Confirm & Generate Official Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success Certificate & Download */}
      {step === 5 && completedContribution && (
        <div className="p-4 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-900">
              Thank You, {completedContribution.donorName}!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-lg mx-auto">
              Your contribution of <strong>₹{completedContribution.amount.toLocaleString('en-IN')}</strong> has been successfully recorded in the St. Mary's Golden Jubilee Ledger.
            </p>
          </div>

          {/* Downloadable Certificate */}
          <ThankYouReceipt
            contribution={completedContribution}
            onClose={handleReset}
          />
        </div>
      )}

    </div>
  );
};
