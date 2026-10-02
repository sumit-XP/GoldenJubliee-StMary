import React, { useRef } from 'react';
import { Contribution } from '../types/index.ts';
import { Printer, Download, Share2, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ThankYouReceiptProps {
  contribution: Contribution;
  onClose?: () => void;
}

export const ThankYouReceipt: React.FC<ThankYouReceiptProps> = ({ contribution, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDF9',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`StMarys_GoldenJubilee_Certificate_${contribution.receiptNumber}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    }
  };

  const handleShare = () => {
    const text = `I proudly contributed towards the 50th Golden Jubilee (1976-2026) of St. Mary's School, Jajpur Road! Receipt No: ${contribution.receiptNumber}. Service Through Excellence!`;
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: "St. Mary's Golden Jubilee Contribution", text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Certificate details copied to clipboard!');
    }
  };

  const formattedDate = new Date(contribution.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      
      {/* Top Action Ribbon (Hidden when printing) */}
      <div className="no-print w-full flex items-center justify-between bg-stone-900 text-amber-200 px-6 py-3 rounded-t-2xl mb-2 shadow">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">Payment Verified & Recorded in Jubilee Ledger</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-amber-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-amber-200 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Printable & Downloadable Certificate / Note Container */}
      <div
        id="jubilee-certificate"
        ref={certificateRef}
        className="w-full bg-[#FFFDF9] border-[10px] border-[#850B0C] p-8 sm:p-12 relative shadow-2xl overflow-hidden text-stone-800"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #FFFDF7 100%)',
          outline: '3px solid #D4AF37',
          outlineOffset: '-6px',
        }}
      >
        {/* Ornate Corner Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />

        {/* Subtle Watermark Seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-[450px] h-[450px] rounded-full border-[20px] border-stone-900 flex items-center justify-center font-serif text-6xl font-black">
            ST. MARY'S 1976
          </div>
        </div>

        {/* Certificate Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-800 font-sans">
              Archdiocese of Cuttack-Bhubaneswar • Managed by CRCDC
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#5A0506] tracking-tight uppercase">
            St. Mary's School, Jajpur Road
          </h2>
          <p className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-amber-700 mt-0.5">
            Affiliated to CISCE, New Delhi • Established 1976
          </p>

          <div className="my-4 flex items-center justify-center gap-4">
            <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#D4AF37] text-xs font-bold text-amber-900 uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Golden Jubilee Patron Certificate (1976–2026)
            </div>
            <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>

          <p className="font-serif italic text-xs sm:text-sm text-stone-500">
            "Service Through Excellence"
          </p>
        </div>

        {/* Main Certificate Body */}
        <div className="mt-8 text-center relative z-10 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-stone-600 font-serif uppercase tracking-widest">
            This token of gratitude and golden commemoration is proudly presented to
          </p>

          {/* Donor Name Calligraphy */}
          <div className="my-4 py-2 border-b-2 border-dashed border-amber-300">
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#850B0C] tracking-wide">
              {contribution.donorName}
            </h1>
            <p className="text-xs sm:text-sm text-amber-800 font-medium mt-1">
              {contribution.role} {contribution.batchYear ? `• ${contribution.batchYear}` : ''}
            </p>
          </div>

          {/* Acknowledgement Text */}
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
            In heartfelt appreciation and high esteem for your magnanimous contribution of{' '}
            <strong className="text-stone-900 font-bold font-sans text-base">
              ₹{contribution.amount.toLocaleString('en-IN')}
            </strong>{' '}
            ({contribution.tier}) towards the{' '}
            <strong>50th Golden Jubilee Infrastructure, Memorial Auditorium & Student Welfare Fund</strong>.
          </p>

          {contribution.message && (
            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs italic text-stone-700 font-serif max-w-lg mx-auto">
              "{contribution.message}"
            </div>
          )}
        </div>

        {/* Signatures & Seal Footer */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Metadata / Receipt details */}
          <div className="text-left text-[11px] text-stone-500 font-mono space-y-1 order-3 sm:order-1">
            <p><strong className="text-stone-700">Receipt No:</strong> {contribution.receiptNumber}</p>
            <p><strong className="text-stone-700">Date:</strong> {formattedDate}</p>
            <p><strong className="text-stone-700">Ref ID:</strong> {contribution.paymentRef || 'TXN-ONLINE'}</p>
            <div className="flex items-center gap-1 text-emerald-700 pt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Digitally Authenticated Marian Record</span>
            </div>
          </div>

          {/* Embossed Golden Seal */}
          <div className="order-1 sm:order-2 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37] bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-1 shadow-lg flex items-center justify-center text-center">
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#850B0C] flex flex-col items-center justify-center text-[#5A0506]">
                <span className="text-[8px] font-black uppercase tracking-tighter">ST. MARY'S</span>
                <span className="font-serif font-black text-sm text-[#850B0C] leading-none">50</span>
                <span className="text-[7px] font-bold tracking-tighter uppercase">1976-2026</span>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-amber-800 font-bold mt-1">Official Seal</span>
          </div>

          {/* Principal's Signature */}
          <div className="text-center order-2 sm:order-3">
            <div className="font-serif italic font-bold text-lg text-stone-900 border-b border-stone-400 pb-1 px-4">
              Sr. Mary Lina DungDung
            </div>
            <p className="text-[11px] font-bold text-stone-800 font-serif mt-1">Principal</p>
            <p className="text-[10px] text-stone-500">St. Mary's School, Jajpur Road</p>
          </div>

        </div>

      </div>

      {/* Close button if presented in a modal */}
      {onClose && (
        <div className="no-print mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            Close Certificate
          </button>
        </div>
      )}

    </div>
  );
};
