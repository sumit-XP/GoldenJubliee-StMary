import React, { useState } from 'react';
import { useJubilee } from '../../context/JubileeContext.tsx';
import { Contribution } from '../../types/index.ts';
import { ThankYouReceipt } from '../../components/ThankYouReceipt.tsx';
import { Download, Search, Eye, Filter, FileSpreadsheet, ShieldCheck, X } from 'lucide-react';

export const AdminContributions: React.FC = () => {
  const { contributions } = useJubilee();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [viewingReceipt, setViewingReceipt] = useState<Contribution | null>(null);

  const totalRaised = contributions.reduce((acc, c) => acc + (c.amount || 0), 0);
  const totalDonors = contributions.length;

  const filteredContributions = contributions.filter((c) => {
    const matchesSearch =
      c.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.batchYear && c.batchYear.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'All' || c.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const exportToCsv = () => {
    if (contributions.length === 0) return;

    const headers = ['Receipt Number', 'Donor Name', 'Role', 'Batch Year', 'Email', 'Phone', 'Amount (INR)', 'Tier', 'Payment Method', 'Payment Ref', 'Date', 'Message'];
    const rows = contributions.map((c) => [
      c.receiptNumber,
      `"${c.donorName.replace(/"/g, '""')}"`,
      c.role,
      c.batchYear || '',
      c.email || '',
      c.phone || '',
      c.amount,
      c.tier,
      c.paymentMethod || '',
      c.paymentRef || '',
      c.createdAt,
      `"${(c.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StMarys_GoldenJubilee_Contributions_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Total Jubilee Collections</span>
          <p className="font-serif text-3xl font-black text-[#850B0C] mt-1">
            ₹{totalRaised.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-stone-400">Auditorium & Endowment Fund</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Registered Contributors</span>
          <p className="font-serif text-3xl font-black text-stone-900 mt-1">
            {totalDonors}
          </p>
          <span className="text-[11px] text-stone-400">Alumni, Parents & Well-Wishers</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Audited Ledger Export</span>
            <p className="text-xs text-stone-500 mt-1">Download complete records formatted for accounting & audit.</p>
          </div>
          <button
            onClick={exportToCsv}
            className="mt-3 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 shadow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, receipt no, batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none bg-white font-medium"
          >
            <option value="All">All Donor Categories</option>
            <option value="Alumnus">Alumni</option>
            <option value="Parent">Parents</option>
            <option value="Former Teacher">Former Teachers</option>
            <option value="Staff">Staff</option>
            <option value="Well-Wisher">Well-Wishers</option>
          </select>
        </div>
      </div>

      {/* Contributions Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Donor Name & Association</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredContributions.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-900">
                    {c.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{c.donorName}</div>
                    <div className="text-[11px] text-stone-400">
                      {c.role} {c.batchYear ? `• ${c.batchYear}` : ''}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black font-sans text-stone-900 text-sm">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                    {c.paymentRef || 'TXN-ONLINE'}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(c.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setViewingReceipt(c)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#5A0506] hover:text-amber-200 text-stone-800 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ThankYouReceipt contribution={viewingReceipt} onClose={() => setViewingReceipt(null)} />
          </div>
        </div>
      )}

    </div>
  );
};
