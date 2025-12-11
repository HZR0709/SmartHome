import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Loader2, Zap } from 'lucide-react';

interface SmartAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardState: any;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ isOpen, onClose, dashboardState }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!process.env.API_KEY) {
        setError("API Key not found. Please set REACT_APP_GEMINI_API_KEY.");
        return;
    }
    
    setLoading(true);
    setAnalysis("");
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are an intelligent home assistant named "Jarvis".
        Analyze the following Smart Home JSON state and provide 3 brief, actionable insights 
        regarding energy efficiency, security, or comfort. Use emojis.
        Keep the tone professional yet friendly.

        Home State:
        ${JSON.stringify(dashboardState)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text || "Unable to generate analysis.");
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when opened if empty
  React.useEffect(() => {
    if (isOpen && !analysis && !loading) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Smart Analysis</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <p>Analyzing home metrics...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <p>{error}</p>
              <button 
                onClick={runAnalysis}
                className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm">
              <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900 border-t border-slate-800 flex justify-between items-center">
            <div className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</div>
            <button 
                onClick={runAnalysis}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
                <Zap className="w-3 h-3" />
                Refresh Analysis
            </button>
        </div>
      </div>
    </div>
  );
};