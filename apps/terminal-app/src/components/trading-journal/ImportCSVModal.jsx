import React, { useState } from "react";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";

export default function ImportCSVModal({ onClose }) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const createTradesMutation = useMutation({
    mutationFn: (trades) => api.entities.Trade.bulkCreate(trades),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      setResult({
        success: true,
        count: data.length,
        message: language === 'he'
          ? `✅ ${data.length} עסקאות יובאו בהצלחה!`
          : `✅ ${data.length} trades imported successfully!`
      });
    },
    onError: (error) => {
      setResult({
        success: false,
        message: language === 'he'
          ? `❌ שגיאה בייבוא: ${error.message}`
          : `❌ Import error: ${error.message}`
      });
    }
  });

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    const trades = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');

      if (values.length < headers.length) continue;

      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });

      // Extract symbol and direction from the "futures" field
      // Format: "BTCUSDT Long·CROSS" or "ETHUSDT Short·CROSS"
      const futuresField = row['futures'] || '';
      const symbolMatch = futuresField.match(/^([A-Z]+)/);
      const directionMatch = futuresField.match(/(Long|Short)/i);

      if (!symbolMatch || !directionMatch) continue;

      const symbol = symbolMatch[1];
      const direction = directionMatch[1].toLowerCase();

      // Extract quantity (remove " BTC" or other currency suffixes)
      const quantityMatch = (row['closed amount'] || '').match(/[\d.]+/);
      const quantity = quantityMatch ? parseFloat(quantityMatch[0]) : 0;

      // Parse PnL
      const realizedPnl = parseFloat(row['realized pnl']) || 0;

      // Calculate PnL percentage
      const closedValue = parseFloat(row['closed value']) || 1;
      const pnlPercentage = (realizedPnl / closedValue) * 100;

      const trade = {
        symbol: symbol,
        direction: direction,
        entry_price: parseFloat(row['average entry price']) || 0,
        exit_price: parseFloat(row['average closing price']) || 0,
        quantity: quantity,
        pnl: realizedPnl,
        pnl_percentage: pnlPercentage,
        position_size_usd: closedValue,
        entry_time: row['opening time'],
        exit_time: row['closed time'],
        status: 'closed',
        notes: `Imported from Bybit CSV - Funding Fees: ${row['funding fees']}, Position Fee: ${row['position fee']}`
      };

      trades.push(trade);
    }

    return trades;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const trades = parseCSV(text);

      if (trades.length === 0) {
        setResult({
          success: false,
          message: language === 'he'
            ? '❌ לא נמצאו עסקאות בקובץ'
            : '❌ No trades found in file'
        });
        setIsProcessing(false);
        return;
      }

      await createTradesMutation.mutateAsync(trades);
    } catch (error) {
      setResult({
        success: false,
        message: language === 'he'
          ? `❌ שגיאה בקריאת הקובץ: ${error.message}`
          : `❌ Error reading file: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              {language === 'he' ? 'ייבוא עסקאות מ-CSV' : 'Import Trades from CSV'}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Instructions */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                💡 {language === 'he' ? 'הוראות' : 'Instructions'}
              </h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>
                  {language === 'he'
                    ? '1. ייצא את היסטוריית העסקאות שלך מביטוניקס (Bybit) כקובץ CSV'
                    : '1. Export your trade history from Bybit as a CSV file'}
                </li>
                <li>
                  {language === 'he'
                    ? '2. העלה את הקובץ כאן'
                    : '2. Upload the file here'}
                </li>
                <li>
                  {language === 'he'
                    ? '3. המערכת תייבא את כל העסקאות באופן אוטומטי'
                    : '3. The system will import all trades automatically'}
                </li>
              </ul>
            </div>

            {/* File Upload */}
            {!file ? (
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 hover:border-emerald-500 transition-all duration-300 hover:bg-slate-800/50 text-center">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                  <p className="text-white text-lg mb-2 font-semibold">
                    {language === 'he' ? 'העלה קובץ CSV' : 'Upload CSV File'}
                  </p>
                  <p className="text-slate-400">
                    {language === 'he'
                      ? 'גרור קובץ או לחץ לבחירה'
                      : 'Drag file or click to select'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="space-y-4">
                {/* Selected File */}
                <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    <div>
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-slate-400 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  {!isProcessing && !result && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Result Message */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-4 flex items-start gap-3 ${result.success
                      ? 'bg-green-900/20 border border-green-500/30'
                      : 'bg-red-900/20 border border-red-500/30'
                      }`}
                  >
                    {result.success ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={result.success ? 'text-green-300' : 'text-red-300'}>
                      {result.message}
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {result?.success ? (
                    <Button
                      type="button"
                      onClick={onClose}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {language === 'he' ? 'סיום' : 'Done'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={() => setFile(null)}
                        variant="outline"
                        className="flex-1 h-12"
                        disabled={isProcessing}
                      >
                        {language === 'he' ? 'ביטול' : 'Cancel'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleImport}
                        className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                            {language === 'he' ? 'מייבא...' : 'Importing...'}
                          </>
                        ) : (
                          language === 'he' ? 'ייבא עסקאות' : 'Import Trades'
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}