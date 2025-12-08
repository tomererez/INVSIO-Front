import React, { useState, useEffect } from 'react';
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const TIER_FEATURES = {
  free: [
    'basic_calculator',
    'basic_journal',
    'basic_dashboard',
    'limited_technical_analysis',
    'faq_access'
  ],
  pro: [
    'basic_calculator',
    'basic_journal',
    'basic_dashboard',
    'limited_technical_analysis',
    'faq_access',
    'full_calculator',
    'full_journal',
    'full_dashboard',
    'ai_trade_coach_standard',
    'smart_money_ta',
    'csv_import',
    'unlimited_trades',
    'advanced_metrics'
  ],
  elite: [
    'basic_calculator',
    'basic_journal',
    'basic_dashboard',
    'limited_technical_analysis',
    'faq_access',
    'full_calculator',
    'full_journal',
    'full_dashboard',
    'ai_trade_coach_standard',
    'smart_money_ta',
    'csv_import',
    'unlimited_trades',
    'advanced_metrics',
    'ai_trade_coach_advanced',
    'advanced_journal_analytics',
    'smart_money_terminal',
    'alerts',
    'ai_insights',
    'unlimited_analysis'
  ]
};

const TIER_NAMES = {
  free: 'Free',
  pro: 'Pro',
  elite: 'Elite'
};

export function FeatureGate({ feature, children }) {
  const [theme, setTheme] = useState('dark');

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

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
        Loading...
      </div>
    );
  }

  const userTier = user?.subscription_tier || 'free';
  const tierFeatures = TIER_FEATURES[userTier] || TIER_FEATURES.free;
  const hasAccess = tierFeatures.includes(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  const requiredTier = Object.keys(TIER_FEATURES).find(tier => {
    const features = TIER_FEATURES[tier];
    return features && features.includes(feature);
  }) || 'pro';

  return (
    <Card className={`${isDark ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'}`}>
      <CardContent className="p-12 text-center">
        <div className={`w-20 h-20 ${isDark ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-br from-amber-100 to-orange-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Lock className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {requiredTier === 'elite' ? 'Elite' : 'Pro'} Feature
        </h3>
        <p className={`text-lg mb-6 max-w-md mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          This feature is available for {TIER_NAMES[requiredTier] || 'Pro'} users and above. Upgrade your plan to unlock this powerful tool.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to={createPageUrl("Pricing")}>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg">
              {requiredTier === 'elite' ? <Crown className="w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
              Upgrade to {TIER_NAMES[requiredTier] || 'Pro'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function useHasFeature(feature) {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  const userTier = user?.subscription_tier || 'free';
  const tierFeatures = TIER_FEATURES[userTier] || TIER_FEATURES.free;
  return tierFeatures.includes(feature);
}