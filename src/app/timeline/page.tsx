'use client';

import { VNDBGame } from '@/types/vndb';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Timeline() {
    const [games, setGames] = useState<VNDBGame[]>([]);
    const [loading, setLoading] = useState(true);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    useEffect(() => {
        fetch(`${basePath}/my_galgame.json`)
            .then(res => res.json())
            .then(data => {
                // Sort by finished date (ascending)
                const sorted = (data as VNDBGame[])
                    .filter(g => g.finished) // Ensure finished date exists
                    .sort((a, b) => a.finished - b.finished);
                setGames(sorted);
                setLoading(false);
            });
    }, [basePath]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" style={{ backgroundImage: `url(${basePath}/background.webp)` }}>
                <div className="text-white text-2xl">加载中...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${basePath}/background.webp)` }}>
            <div className="min-h-screen bg-white/30 backdrop-blur-sm py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-12 text-center text-black drop-shadow-sm">Galgame 之路</h1>

                    <div className="relative">
                        {/* Central Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-400/50 transform md:-translate-x-1/2"></div>

                        {games.map((game, index) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <div key={game.id} className={`mb-12 flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Spacer/Content side */}
                                    <div className="hidden md:block w-1/2 px-8"></div>

                                    {/* Dot on the line */}
                                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-pink-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 z-10"></div>

                                    {/* Card Content */}
                                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                                        <div className={`bg-white/90 backdrop-blur rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isLeft ? 'origin-right' : 'origin-left'}`}>
                                            <div className="flex gap-4">
                                                <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={game.image}
                                                        alt={game.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-pink-600 font-bold mb-1">
                                                        {formatDate(game.finished)}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2" title={game.title}>
                                                        {game.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs">
                                                            {game.vote.toFixed(1)}分
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            VNDB: {game.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12 pb-8 text-white/80 text-sm">
                        共完成了 {games.length} 部作品
                    </div>
                </div>
            </div>
        </main>
    );
}
