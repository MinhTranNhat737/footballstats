"use client";

import { useState } from 'react';
import Header from '@/components/header';
import IntegratedPlayerSearch from '@/components/integrated-player-search';
import { UserSearch, Star, TrendingUp, Users, Trophy, Zap } from 'lucide-react';

// Backend Player type
interface BackendPlayer {
  id?: number;
  player_id?: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  club: string;
  overall: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
  photo_url?: string;
}

export default function PlayersPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<BackendPlayer | null>(null);

  const handlePlayerSelect = (player: BackendPlayer | null) => {
    setSelectedPlayer(player);
  };

  const featuredPlayers = [
    {
      name: "Lionel Messi",
      position: "Right Winger",
      team: "Inter Miami CF",
      nationality: "Argentina",
      goals: 28,
      assists: 16,
      marketValue: "€35M",
      image: "LM"
    },
    {
      name: "Cristiano Ronaldo", 
      position: "Centre-Forward",
      team: "Al Nassr FC",
      nationality: "Portugal",
      goals: 44,
      assists: 13,
      marketValue: "€15M",
      image: "CR"
    },
    {
      name: "Erling Haaland",
      position: "Centre-Forward", 
      team: "Manchester City FC",
      nationality: "Norway",
      goals: 52,
      assists: 9,
      marketValue: "€180M",
      image: "EH"
    },
    {
      name: "Kylian Mbappé",
      position: "Left Winger",
      team: "Real Madrid CF",
      nationality: "France", 
      goals: 18,
      assists: 2,
      marketValue: "€180M",
      image: "KM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in slide-in-from-top-1 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
            <UserSearch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Tìm kiếm Cầu thủ
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Khám phá thông tin chi tiết về các cầu thủ hàng đầu thế giới, thống kê, thành tích và nhiều hơn nữa
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-1 duration-700 delay-200 relative z-[110]">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Tìm kiếm cầu thủ yêu thích</h2>
            <IntegratedPlayerSearch 
              onPlayerSelect={handlePlayerSelect}
              selectedPlayer={selectedPlayer}
            />
            {selectedPlayer && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  {selectedPlayer.photo_url ? (
                    <img src={selectedPlayer.photo_url} alt={selectedPlayer.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {selectedPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{selectedPlayer.name}</h3>
                    <p className="text-slate-300">{selectedPlayer.position} • {selectedPlayer.club}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-sm px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Overall: {selectedPlayer.overall}</span>
                      <span className="text-sm px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{selectedPlayer.age} tuổi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Players */}
        <div className="mb-12 relative z-[10]">
          <h2 className="text-3xl font-bold text-white mb-8 text-center animate-in slide-in-from-left-1 duration-700 delay-300">
            Cầu thủ nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlayers.map((player, index) => (
              <div
                key={player.name}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer animate-in fade-in-50 duration-700 relative z-0"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg">
                    {player.image}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{player.name}</h3>
                  <p className="text-blue-300 text-sm mb-2">{player.position}</p>
                  <p className="text-slate-300 text-sm mb-4">{player.team}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Goals:</span>
                      <span className="text-green-400 font-semibold">{player.goals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Assists:</span>
                      <span className="text-blue-400 font-semibold">{player.assists}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Value:</span>
                      <span className="text-yellow-400 font-semibold">{player.marketValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-[10]">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 animate-in slide-in-from-left-1 duration-700 delay-600">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold text-white">1000+</h3>
                <p className="text-blue-300">Cầu thủ trong database</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30 animate-in slide-in-from-bottom-1 duration-700 delay-700">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold text-white">50+</h3>
                <p className="text-green-300">Giải đấu được theo dõi</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 animate-in slide-in-from-right-1 duration-700 delay-800">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">24/7</h3>
                <p className="text-purple-300">Cập nhật real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 animate-in slide-in-from-bottom-1 duration-700 delay-900 relative z-[10]">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Cách sử dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tìm kiếm</h3>
              <p className="text-slate-300 text-sm">Nhập tên cầu thủ, đội bóng hoặc quốc tịch để tìm kiếm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Chọn cầu thủ</h3>
              <p className="text-slate-300 text-sm">Chọn cầu thủ từ danh sách kết quả tìm kiếm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Xem thông tin</h3>
              <p className="text-slate-300 text-sm">Xem thông tin cơ bản và chỉ số của cầu thủ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}