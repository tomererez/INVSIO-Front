import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, AlertTriangle, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { api } from "@/api/client";
import ReactMarkdown from 'react-markdown';

export default function TradingCoachChat({ marketData, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! 👋 I'm your Trading Coach. I can help you understand market data and analyze situations from an educational perspective.

Ask me anything about:
• CVD, Open Interest & Funding Rate analysis
• Understanding what the data might indicate
• Risk management and possible scenarios

**Note:** All information is for educational purposes only and does not constitute financial advice.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await api.functions.tradingCoachChat({
        message: userMessage,
        marketData: marketData,
        conversationHistory: conversationHistory
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an issue. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-4 group"
      >
        {/* Pulsing bubble */}
        <div className="relative">
          <div className="absolute inset-0 w-16 h-16 bg-cyan-400 rounded-full animate-ping opacity-40" />
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-60" />
          <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl shadow-cyan-500/50 flex items-center justify-center hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Text label */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wide">
            AI Trading Coach
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} group-hover:text-cyan-400 transition-colors`}>
            Tap to start chatting
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 left-8 z-50 w-[420px]">
      <Card className={`${isDark ? 'bg-slate-900 border-cyan-500/30' : 'bg-white border-cyan-300'} shadow-2xl shadow-cyan-500/20 overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Trading Coach</h3>
              <p className="text-xs text-white/80">Educational Assistant • Powered by GPT-4o</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-5 h-5 text-white" /> : <Minimize2 className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Disclaimer */}
            <div className={`px-4 py-2 flex items-center gap-2 ${isDark ? 'bg-amber-500/10 border-b border-slate-700' : 'bg-amber-50 border-b border-gray-200'}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                Educational only - Not financial advice
              </p>
            </div>

            {/* Messages */}
            <div className={`h-96 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    ) : (
                      <ReactMarkdown className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about the market..."
                  disabled={isLoading}
                  className={`flex-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200'}`}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}