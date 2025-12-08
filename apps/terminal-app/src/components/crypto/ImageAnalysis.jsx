import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import PropTypes from 'prop-types';

function ImageAnalysis({ onAnalysisComplete, type }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);

    try {
      const { file_url } = await api.integrations.UploadFile({ file });

      const prompt = type === "chart"
        ? "נתח את התרשים הטכני הזה ותן ניתוח מקצועי של המצב הטכני, כולל רמות תמיכה והתנגדות, אינדיקטורים, וכיוון צפוי"
        : "נתח את מצב הנפח (Volume Profile) בתמונה הזו ותן ניתוח מקצועי";

      const analysis = await api.functions.invokeLLM({
        messages: [
          {
            role: 'user', content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: file_url } }
            ]
          }
        ]
      });

      onAnalysisComplete(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-6">
        <div className="text-center">
          {!selectedImage ? (
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 hover:border-emerald-500 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                <p className="text-slate-400 mb-2">העלה תמונה לניתוח</p>
                <p className="text-sm text-slate-500">
                  {type === "chart" ? "תרשים טכני" : "Volume Profile"}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div>
              <img src={selectedImage} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-4" />
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>מנתח...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

ImageAnalysis.propTypes = {
  onAnalysisComplete: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default ImageAnalysis;