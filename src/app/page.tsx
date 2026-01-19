'use client';

import { VNDBGame } from '@/types/vndb';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [games, setGames] = useState<VNDBGame[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  // Partition by vote
  const groupedGames = games.reduce((acc, game) => {
    const score = Math.floor(game.vote);
    if (!acc[score]) {
      acc[score] = [];
    }
    acc[score].push(game);
    return acc;
  }, {} as Record<number, VNDBGame[]>);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  const scrollToScore = (score: number) => {
    const element = document.getElementById(`score-${score}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-black drop-shadow-lg">我的 Galgame</h1>

        {/* 导航按钮 */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {Object.keys(groupedGames)
            .sort((a, b) => Number(b) - Number(a))
            .map((score) => (
              <button
                key={score}
                onClick={() => scrollToScore(Number(score))}
                className="px-4 py-2 bg-white/80 hover:bg-white/90 rounded-lg shadow-md transition-all duration-300 text-black font-medium"
              >
                {score}分 ({groupedGames[Number(score)].length}部)
              </button>
            ))}
        </div>

        {Object.entries(groupedGames)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([score, games]) => (
            <div key={score} id={`score-${score}`} className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-black drop-shadow-lg">
                {score} 分作品 ({games.length}部)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games
                  .sort((a, b) => b.finished - a.finished) // 按完成日期降序排序
                  .map((game) => (
                    <div key={game.id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div
                        className="relative h-64 cursor-pointer"
                        onClick={() => setSelectedImage(game.image)}
                      >
                        <Image
                          src={game.image}
                          alt={game.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-black">
                          <a href={game.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                            {game.title}
                          </a>
                        </h2>
                        <div className="text-gray-700">
                          <p>发售日期: {game.released}</p>
                          <p>完成日期: {formatDate(game.finished)}</p>
                          <p>个人评分: {game.vote.toFixed(1)}</p>
                          <p>VNDB评分: {game.rating.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* 图片缩放模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={selectedImage}
              alt="放大图片"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </main>
  );
}
