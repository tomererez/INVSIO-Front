import React from 'react';

// Skeleton placeholder for Hero alerts - matches dimensions of real alerts
export const AlertsSkeleton = () => {
    return (
        <div className="space-y-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md animate-pulse"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-slate-700 rounded" />
                            <div className="h-3 w-24 bg-slate-700 rounded-full" />
                        </div>
                        <div className="h-4 w-16 bg-slate-700 rounded" />
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full mb-3" />
                    <div className="h-2 w-3/4 bg-slate-800 rounded-full mb-3" />
                    <div className="h-1 w-full bg-white/5 rounded-full" />
                </div>
            ))}
            {/* Faded partial card at bottom */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md opacity-30">
                <div className="h-3 w-24 bg-slate-700 rounded-full mb-2" />
                <div className="h-2 w-full bg-slate-800 rounded-full" />
            </div>
        </div>
    );
};

export default AlertsSkeleton;
