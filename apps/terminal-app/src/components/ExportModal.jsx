import React, { useState, useEffect } from 'react';
import { X, Download, Archive, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExportModal({ onClose, trades, user }) {
  const [theme, setTheme] = useState('dark');
  const [exportType, setExportType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  const handleExportCSV = () => {
    setExportType('csv');
    setIsExporting(true);

    setTimeout(() => {
      if (!trades || trades.length === 0) {
        alert('No trades to export');
        setIsExporting(false);
        return;
      }

      const closedTrades = trades.filter(t => t.status === 'closed');
      if (closedTrades.length === 0) {
        alert('No closed trades to export');
        setIsExporting(false);
        return;
      }

      const headers = ['Date', 'Symbol', 'Direction', 'Entry Price', 'Exit Price', 'Quantity', 'Leverage', 'PnL', 'PnL %', 'Status', 'Strategy', 'Notes'];
      const csvData = closedTrades.map(trade => [
        new Date(trade.exit_time || trade.entry_time).toLocaleDateString(),
        trade.symbol,
        trade.direction,
        trade.entry_price,
        trade.exit_price || '',
        trade.quantity,
        trade.leverage,
        trade.pnl || '',
        trade.pnl_percentage || '',
        trade.status,
        trade.strategy || '',
        trade.notes ? `"${trade.notes.replace(/"/g, '""')}"` : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invsio-trades-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      setIsExporting(false);
      setExportComplete(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  const handleBackupJournal = () => {
    setExportType('backup');
    setIsExporting(true);

    setTimeout(() => {
      if (!trades || trades.length === 0) {
        alert('No trades to backup');
        setIsExporting(false);
        return;
      }

      const backup = {
        exported_at: new Date().toISOString(),
        user_email: user?.email,
        user_name: user?.full_name,
        total_trades: trades.length,
        trades: trades
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invsio-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      setIsExporting(false);
      setExportComplete(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
            } overflow-hidden`}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Export & Backup
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {exportComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Export Complete!
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Your file has been downloaded successfully.
                </p>
              </motion.div>
            ) : isExporting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Preparing Export...
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {exportType === 'csv' ? 'Generating CSV file' : 'Creating backup file'}
                </p>
              </motion.div>
            ) : (
              <>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Choose how you'd like to export your trading data:
                </p>

                {/* Export CSV Option */}
                <button
                  onClick={handleExportCSV}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${isDark
                      ? 'border-slate-700 hover:border-emerald-600 hover:bg-slate-800/50'
                      : 'border-gray-200 hover:border-emerald-600 hover:bg-emerald-50'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                      }`}>
                      <Download className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Export Trades (CSV)
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Download all closed trades in CSV format for analysis in Excel or Google Sheets
                      </p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        Includes: Date, Symbol, P&L, Strategy, Notes
                      </p>
                    </div>
                  </div>
                </button>

                {/* Backup Journal Option */}
                <button
                  onClick={handleBackupJournal}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${isDark
                      ? 'border-slate-700 hover:border-teal-600 hover:bg-slate-800/50'
                      : 'border-gray-200 hover:border-teal-600 hover:bg-teal-50'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'
                      }`}>
                      <Archive className="w-6 h-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Full Journal Backup (JSON)
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Complete backup of all trades (open & closed) with full details
                      </p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        Includes: All trade data, metadata, timestamps
                      </p>
                    </div>
                  </div>
                </button>

                <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'
                  }`}>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    💡 <strong>Tip:</strong> Regular backups help protect your trading history. We recommend backing up your journal monthly.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}