import React, { useState } from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Contribution } from '../types/index.ts';
import { ThankYouReceipt } from './ThankYouReceipt.tsx';
import { Heart, QrCode, CreditCard, Landmark, CheckCircle2, ShieldCheck, Sparkles, X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose }) => {
  const { submitContribution } = useJubilee();

  // Multi-step states: 1 = Amount, 2 = Donor Info, 3 = Payment Method, 4 = Success Certificate
  const [step, setStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string>('Golden Patron');
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');

  const [donorName, setDonorName] = useState<string>('');
  const [role, setRole] = useState<Contribution['role']>('Alumnus');
  const [batchYear, setBatchYear] = useState<string>('Batch of 2005');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState<boolean>(false);
  const [completedContribution, setCompletedContribution] = useState<Contribution | null>(null);

  if (!isOpen) return null;

  const tiers = [
    { name: 'Silver Supporter', amount: 1000, description: 'Commemorative digital badge & name on Jubilee Scroll' },
    { name: 'Golden Patron', amount: 5000, description: 'Golden Jubilee patron certificate & souvenir acknowledgment' },
    { name: 'Platinum Benefactor', amount: 10000, description: 'Commemorative brass plaque engraving & VIP reception pass' },
    { name: 'Diamond Visionary', amount: 25000, description: 'Auditorium seat naming privilege & permanent honor board entry' },
  ];

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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert('Please enter your full name');
      return;
    }
    setStep(3);
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    try {
      // Simulate gateway latency
      await new Promise((r) => setTimeout(r, 1500));

      const contributionData: Partial<Contribution> = {
        donorName: donorName.trim(),
        role,
        batchYear: role === 'Alumnus' ? batchYear : undefined,
        email: email.trim(),
        phone: phone.trim(),
        amount,
        tier: selectedTier as any,
        paymentMethod: paymentMethod === 'upi' ? 'UPI QR' : paymentMethod === 'card' ? 'Debit/Credit Card' : 'Net Banking',
        message: message.trim(),
        isAnonymous,
      };

      const created = await submitContribution(contributionData);
      setCompletedContribution(created);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#850B0C', '#FEF3C7', '#F59E0B'],
      });

      setStep(4);
    } catch (err) {
      alert('There was an issue processing your contribution. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setCompletedContribution(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-3xl w-full shadow-2xl border border-amber-300/80 overflow-hidden my-auto relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#5A0506] to-[#7A0A0B] text-amber-100 p-5 sm:p-6 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-black shadow">
              50
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                Golden Jubilee Contribution Fund
              </h3>
              <p className="text-xs text-amber-200/70">
                St. Mary's School, Jajpur Road • 1976 – 2026
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-amber-200/80 hover:text-amber-100 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="bg-amber-100/60 px-6 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs font-semibold text-stone-600">
            <span className={step >= 1 ? 'text-[#850B0C] font-bold' : ''}>1. Choose Amount</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#850B0C] font-bold' : ''}>2. Donor Details</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-[#850B0C] font-bold' : ''}>3. Payment</span>
            <span>→</span>
            <span>4. Golden Certificate</span>
          </div>
        )}

        {/* Step 1: Select Tier / Amount */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-md mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 1 of 3</span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Select Your Contribution Tier
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Your contribution directly funds the Golden Jubilee Student Auditorium and Science Endowment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {tiers.map((t) => {
                const isSelected = selectedTier === t.name && !customAmount;
                return (
                  <div
                    key={t.name}
                    onClick={() => handleSelectPreset(t.name, t.amount)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/80 border-[#850B0C] ring-2 ring-[#850B0C]/20 shadow-md'
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

            {/* Custom Amount Field */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Or Enter A Custom Amount (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  placeholder="e.g. 50000"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-1 focus:ring-[#850B0C] text-sm font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                Selected: <strong className="text-stone-900 text-sm">₹{amount.toLocaleString('en-IN')}</strong> ({selectedTier})
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Donor Details */}
        {step === 2 && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-4">
            <div className="text-center max-w-md mx-auto mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 2 of 3</span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Your Details for Official Certificate
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                This information will appear on your Golden Jubilee Patron Certificate and Receipt.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar Mohanty"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-1 focus:ring-[#850B0C] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Association with St. Mary's *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] focus:ring-1 focus:ring-[#850B0C] text-sm outline-none bg-white"
                >
                  <option value="Alumnus">Proud Marian Alumnus / Alumna</option>
                  <option value="Parent">Parent of Current / Past Student</option>
                  <option value="Former Teacher">Former Teacher / Faculty</option>
                  <option value="Staff">School Staff Member</option>
                  <option value="Well-Wisher">Well-Wisher & Friend of St. Mary's</option>
                </select>
              </div>

              {role === 'Alumnus' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ICSE Passing Batch / Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Batch of 1998, Class X"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (for Digital Certificate)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number / WhatsApp (for Receipt SMS)
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
                  Jubilee Message / Blessing for School (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a fond memory, tribute to teachers, or blessing for St. Mary's 50th Golden Jubilee..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#850B0C] focus:ring-[#850B0C]"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-stone-600">
                  Keep my name private on the public Wall of Honour (Listed as "A Marian Benefactor")
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Pay ₹{amount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Options & Simulation */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-md mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Step 3 of 3</span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Select Payment Mode
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Secure transaction of <strong>₹{amount.toLocaleString('en-IN')}</strong> for St. Mary's Golden Jubilee Fund
              </p>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-50 border-[#850B0C] text-[#850B0C] shadow-sm ring-1 ring-[#850B0C]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-600" />
                <span>UPI / QR Code</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-amber-50 border-[#850B0C] text-[#850B0C] shadow-sm ring-1 ring-[#850B0C]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-amber-50 border-[#850B0C] text-[#850B0C] shadow-sm ring-1 ring-[#850B0C]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Landmark className="w-5 h-5 text-amber-600" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm">
              {paymentMethod === 'upi' && (
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-white border-2 border-stone-800 rounded-xl shadow-inner mb-3">
                    {/* Simulated Clean SVG QR Code */}
                    <svg viewBox="0 0 100 100" className="w-36 h-36">
                      <rect width="100" height="100" fill="#ffffff" />
                      <rect x="10" y="10" width="25" height="25" fill="#850B0C" />
                      <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                      <rect x="18" y="18" width="9" height="9" fill="#850B0C" />

                      <rect x="65" y="10" width="25" height="25" fill="#850B0C" />
                      <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                      <rect x="73" y="18" width="9" height="9" fill="#850B0C" />

                      <rect x="10" y="65" width="25" height="25" fill="#850B0C" />
                      <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                      <rect x="18" y="73" width="9" height="9" fill="#850B0C" />

                      <rect x="42" y="15" width="15" height="8" fill="#D4AF37" />
                      <rect x="42" y="30" width="12" height="12" fill="#850B0C" />
                      <rect x="60" y="42" width="15" height="15" fill="#D4AF37" />
                      <rect x="40" y="60" width="20" height="10" fill="#850B0C" />
                      <rect x="68" y="68" width="18" height="18" fill="#850B0C" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    UPI ID: stmarys.jubilee@federalbank
                  </span>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Supports Google Pay, PhonePe, Paytm, BHIM and all banking apps
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 text-left max-w-sm mx-auto">
                  <div className="p-3 bg-gradient-to-r from-stone-800 to-stone-900 rounded-xl text-amber-200 text-xs font-mono shadow">
                    <p className="text-[10px] text-stone-400 uppercase">Commemorative Card Portal</p>
                    <p className="mt-2 tracking-widest text-sm">•••• •••• •••• 5026</p>
                    <div className="mt-2 flex justify-between text-[10px]">
                      <span>ST. MARY'S PATRON</span>
                      <span>12/26</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-stone-500">
                    Visa, Mastercard, RuPay, and Maestro cards accepted.
                  </p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="text-center py-4">
                  <Landmark className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs text-stone-700 font-semibold">
                    State Bank of India, Federal Bank, HDFC, ICICI, Axis & All Major Indian Banks
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Direct official settlement</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-xs text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Golden Jubilee Checkout</span>
              </div>
            </div>

            {/* Complete Payment Button */}
            <div className="flex items-center justify-between pt-2">
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
                onClick={handleSimulatePayment}
                disabled={processing}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Verifying Contribution...</span>
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

        {/* Step 4: Success Certificate & Note Presentation */}
        {step === 4 && completedContribution && (
          <div className="p-4 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-black text-stone-900">
                Thank You, {completedContribution.donorName}!
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Your noble contribution has been officially acknowledged by St. Mary's School, Jajpur Road.
              </p>
            </div>

            <ThankYouReceipt contribution={completedContribution} onClose={handleResetAndClose} />
          </div>
        )}

      </div>
    </div>
  );
};
