'use client';

import { VNDBGame } from '@/types/vndb';
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area
} from 'recharts';

export default function Statistics() {
    const [games, setGames] = useState<VNDBGame[]>([]);
    const [loading, setLoading] = useState(true);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    useEffect(() => {
        fetch(`${basePath}/my_galgame.json`)
            .then(res => res.json())
            .then(data => {
                setGames(data);
                setLoading(false);
            });
    }, [basePath]);

    // Data Processing

    // 1. Games Finished per Year
    const gamesPerYear = games.reduce((acc, game) => {
        if (game.finished) {
            const year = new Date(game.finished * 1000).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const yearData = Object.entries(gamesPerYear)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([year, count]) => ({ year, count }));

    // 2. Rating Distribution (Integer)
    const ratingDist = games.reduce((acc, game) => {
        const score = Math.floor(game.vote);
        acc[score] = (acc[score] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const ratingData = Object.entries(ratingDist)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([score, count]) => ({ score: `${score}分`, count }));

    // 3. Average Rating per Year
    const ratingPerYear = games.reduce((acc, game) => {
        if (game.finished) {
            const year = new Date(game.finished * 1000).getFullYear();
            if (!acc[year]) acc[year] = { sum: 0, count: 0 };
            acc[year].sum += game.vote;
            acc[year].count += 1;
        }
        return acc;
    }, {} as Record<number, { sum: number; count: number }>);

    const avgRatingData = Object.entries(ratingPerYear)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([year, { sum, count }]) => ({
            year,
            avg: parseFloat((sum / count).toFixed(1))
        }));


    const COLORS = ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24'];

    if (loading) {
        return (
            <main className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" style={{ backgroundImage: `url(${basePath}/background.webp)` }}>
                <div className="text-white text-2xl">加载中...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${basePath}/background.webp)` }}>
            <div className="min-h-screen bg-white/40 backdrop-blur-md py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-4xl font-bold mb-12 text-center text-black drop-shadow-sm">数据统计</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Card 1: Games Per Year */}
                        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-pink-500 pl-3">每年完成作品数</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={yearData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="year" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#EC4899" radius={[4, 4, 0, 0]} name="完成数量" animationDuration={1500} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Card 2: Rating Distribution */}
                        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-violet-500 pl-3">评分分布</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ratingData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="score" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="作品数量" animationDuration={1500}>
                                            {ratingData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Card 3: Average Rating Trend */}
                        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">年度平均评分趋势</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={avgRatingData}>
                                        <defs>
                                            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="year" />
                                        <YAxis domain={[0, 10]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="avg" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAvg)" name="平均分" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8 pb-8 text-black/60 text-sm">
                        <p>数据来源于个人记录</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
