import React from 'react';

// Skeleton placeholder for Hero alerts - EXACT match to real alert dimensions
// Each real alert: p-4 (16px padding), borders, content = ~96px height
// 3 alerts + 12px gaps (space-y-3) + faded card = ~340px total
export const AlertsSkeleton = () => {
    return (
        <div className="space-y-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md"
                    style={{ minHeight: '96px' }} // Match exact alert height
                >
                    {/* Header row - icon + title + badge */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-slate-700/50 rounded" />
                            <div className="h-3 w-28 bg-slate-700/50 rounded" />
                        </div>
                        <div className="h-4 w-16 bg-slate-700/30 rounded" />
                    </div>
                    {/* Subtext - 2 lines */}
                    <div className="space-y-1 mb-3">
                        <div className="h-2.5 w-full bg-slate-800/50 rounded" />
                        <div className="h-2.5 w-3/4 bg-slate-800/50 rounded" />
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 w-full bg-white/5 rounded-full" />
                </div>
            ))}
            {/* Faded partial card - EXACTLY matches real one */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md opacity-30">
                <div className="h-3 w-24 bg-slate-700 rounded-full mb-2" />
                <div className="h-2 w-full bg-slate-800 rounded-full" />
            </div>
        </div>
    );
};

export default AlertsSkeleton;
