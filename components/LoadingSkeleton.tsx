'use client';

export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12 animate-pulse">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header skeleton */}
                <div className="mb-12">
                    <div className="h-16 bg-gray-800/50 rounded-lg w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-800/30 rounded-lg w-1/4"></div>
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-green-500/20">
                            <div className="h-12 bg-gray-800/50 rounded-lg mb-4"></div>
                            <div className="h-8 bg-gray-800/30 rounded-lg w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-800/20 rounded-lg w-1/2"></div>
                        </div>
                    ))}
                </div>

                {/* Table skeleton */}
                <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl p-8">
                    <div className="h-8 bg-gray-800/50 rounded-lg w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-800/30 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

