import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '../../utils';

export default function EmptyState({ icon: Icon, title, description, ctaText, ctaLink, isDark }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
        <Icon className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 max-w-md ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
        {description}
      </p>
      {ctaText && ctaLink && (
        <Link to={createPageUrl(ctaLink)}>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
            {ctaText}
          </Button>
        </Link>
      )}
    </div>
  );
}