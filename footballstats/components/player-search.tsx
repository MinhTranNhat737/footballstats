"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Users, Star, MapPin, Calendar, Zap, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Player, PlayerSearchResponse } from '@/types/player';

interface PlayerSearchProps {
  onPlayerSelect: (player: Player) => void;
  selectedPlayer: Player | null;
}

export default function PlayerSearch({ onPlayerSelect, selectedPlayer }: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPlayers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setPlayers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}&limit=8`);
      const data: PlayerSearchResponse = await response.json();
      
      if (response.ok) {
        setPlayers(data.players);
        setShowResults(true);
      } else {
        setPlayers([]);
      }
    } catch (error) {
      console.error('Player search error:', error);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlayers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchPlayers]);

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player);
    setSearchTerm('');
    setShowResults(false);
    setPlayers([]);
  };

  const clearSelection = () => {
    onPlayerSelect(null);
  };

  const formatMarketValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('forward') || pos.includes('striker')) return 'bg-red-500/10 text-red-600 border-red-200';
    if (pos.includes('winger') || pos.includes('wing')) return 'bg-orange-500/10 text-orange-600 border-orange-200';
    if (pos.includes('midfield')) return 'bg-blue-500/10 text-blue-600 border-blue-200';
    if (pos.includes('defender') || pos.includes('back')) return 'bg-green-500/10 text-green-600 border-green-200';
    if (pos.includes('keeper') || pos.includes('goalkeeper')) return 'bg-purple-500/10 text-purple-600 border-purple-200';
    return 'bg-gray-500/10 text-gray-600 border-gray-200';
  };

  return (
    <div className="relative">
      {/* Selected Player Display */}
      {selectedPlayer && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-blue-200 dark:border-slate-600 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {selectedPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md">
                <img
                  src={selectedPlayer.team.area.flag}
                  alt={selectedPlayer.nationality}
                  className="w-4 h-4 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedPlayer.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge className={`text-xs font-medium ${getPositionColor(selectedPlayer.position)}`}>
                  {selectedPlayer.position}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedPlayer.nationality}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{formatMarketValue(selectedPlayer.marketValue)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={selectedPlayer.team.crest}
                  alt={selectedPlayer.team.name}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{selectedPlayer.team.name}</span>
                <Badge variant="outline" className="text-xs">
                  #{selectedPlayer.shirtNumber}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-8 w-8 p-0 transition-all duration-300 hover:scale-110 hover:bg-red-500/20 hover:text-red-400 group"
            >
              <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            </Button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-blue-500" />
        <Input
          type="text"
          placeholder="Tìm kiếm cầu thủ (Messi, Ronaldo, Haaland...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500"
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 300)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-in zoom-in duration-300">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && players.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white dark:bg-slate-800/98 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl ring-1 ring-blue-500/20">
          <div className="p-1">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-600 cursor-pointer rounded-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md">
                    <img
                      src={player.team.area.flag}
                      alt={player.nationality}
                      className="w-3 h-3 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{player.name}</h4>
                    <Badge className={`text-xs ${getPositionColor(player.position)}`}>
                      {player.position.split(' ')[0]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <img
                        src={player.team.crest}
                        alt={player.team.name}
                        className="w-4 h-4 object-contain"
                      />
                      <span className="truncate">{player.team.name}</span>
                    </div>
                    <span>#{player.shirtNumber}</span>
                    <span>{formatMarketValue(player.marketValue)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>⚽ {player.stats.goals}G</span>
                    <span>🎯 {player.stats.assists}A</span>
                    <span>🏃 {player.stats.appearances} Apps</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchTerm.length >= 2 && players.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white dark:bg-slate-800/98 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Không tìm thấy cầu thủ</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Thử tìm kiếm với từ khóa khác cho "{searchTerm}"</p>
          </div>
        </div>
      )}
    </div>
  );
}