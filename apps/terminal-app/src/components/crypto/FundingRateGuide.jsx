import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function FundingRateGuide() {
  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-400" />
          מדריך Funding Rate
        </h3>
        
        <div className="space-y-4 text-gray-300">
          <p className="text-sm">
            Funding Rate הוא תשלום תקופתי בין טריידרים בחוזים תמידיים (Perpetual Futures).
          </p>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-400">Funding Rate חיובי</span>
            </div>
            <p className="text-sm">
              Long משלמים ל-Short. פירוש: השוק בולישי, יותר Long מ-Short.
              ככל שה-Rate יותר גבוה, כך יותר לחץ קנייה ויש סיכון לתיקון מחיר.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="font-bold text-red-400">Funding Rate שלילי</span>
            </div>
            <p className="text-sm">
              Short משלמים ל-Long. פירוש: השוק בירי, יותר Short מ-Long.
              ככל שה-Rate יותר שלילי, כך יותר לחץ מכירה.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-400 mb-2">
              💡 טיפ למסחר:
            </p>
            <p className="text-sm">
              Funding Rate קיצוני (חיובי או שלילי מאוד) יכול להצביע על רגעים טובים לכניסה נגדית (Contrarian).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}