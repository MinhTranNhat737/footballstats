'use client';

import { useState, useEffect } from 'react';
import { Search, X, User, MapPin, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BackendPlayer {
  id: number;
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

interface BackendPlayerSearchProps {
  onPlayerSelect: (player: BackendPlayer | null) => void;
  selectedPlayer: BackendPlayer | null;
}

export default function BackendPlayerSearch({ onPlayerSelect, selectedPlayer }: BackendPlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<BackendPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchPlayers = async () => {
      if (searchTerm.length < 2) {
        setPlayers([]);
        setShowResults(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/backend-players?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Tìm kiếm thất bại');
        }
        
        console.log('🔍 Backend player search results:', data);
        setPlayers(data.data || []);
        setShowResults(true);
      } catch (error) {
        console.error('Backend player search error:', error);
        setError(error instanceof Error ? error.message : 'Tìm kiếm thất bại');
        setPlayers([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handlePlayerSelect = (player: BackendPlayer) => {
    onPlayerSelect(player);
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  const clearSelection = () => {
    onPlayerSelect(null);
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  const getPositionColor = (position: string) => {
    const pos = position?.toUpperCase();
    if (pos?.includes('GK')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (pos?.includes('DEF') || pos?.includes('CB') || pos?.includes('LB') || pos?.includes('RB')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (pos?.includes('MID') || pos?.includes('CM') || pos?.includes('CDM') || pos?.includes('CAM')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (pos?.includes('FOR') || pos?.includes('ST') || pos?.includes('CF') || pos?.includes('LW') || pos?.includes('RW')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="relative w-full">
      {/* Selected Player Display */}
      {selectedPlayer && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {selectedPlayer.photo_url ? (
                  <img
                    src={selectedPlayer.photo_url}
                    alt={selectedPlayer.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-green-500/30 transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-player.png';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border-2 border-green-500/30">
                    <User className="w-8 h-8 text-green-400" />
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{selectedPlayer.overall}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{selectedPlayer.name}</h3>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <Badge className={`text-xs border ${getPositionColor(selectedPlayer.position)}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {selectedPlayer.position}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedPlayer.nationality}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <User className="w-3 h-3" />
                    <span>{selectedPlayer.age} tuổi</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="font-semibold">{selectedPlayer.club}</span>
                  </div>
                </div>
                {/* Player Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                  {selectedPlayer.pace !== undefined && selectedPlayer.pace > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">PAC</div>
                      <div className="text-sm font-semibold text-green-400">{selectedPlayer.pace}</div>
                    </div>
                  )}
                  {selectedPlayer.shooting !== undefined && selectedPlayer.shooting > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">SHO</div>
                      <div className="text-sm font-semibold text-red-400">{selectedPlayer.shooting}</div>
                    </div>
                  )}
                  {selectedPlayer.passing !== undefined && selectedPlayer.passing > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">PAS</div>
                      <div className="text-sm font-semibold text-blue-400">{selectedPlayer.passing}</div>
                    </div>
                  )}
                  {selectedPlayer.dribbling !== undefined && selectedPlayer.dribbling > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">DRI</div>
                      <div className="text-sm font-semibold text-yellow-400">{selectedPlayer.dribbling}</div>
                    </div>
                  )}
                  {selectedPlayer.defending !== undefined && selectedPlayer.defending > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">DEF</div>
                      <div className="text-sm font-semibold text-purple-400">{selectedPlayer.defending}</div>
                    </div>
                  )}
                  {selectedPlayer.physical !== undefined && selectedPlayer.physical > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500">PHY</div>
                      <div className="text-sm font-semibold text-orange-400">{selectedPlayer.physical}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelection}
              className="ml-2 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm cầu thủ từ database (VD: Ronaldo, Messi, Neymar...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-green-500/20"
          />
          {(searchTerm || isLoading) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchTerm('');
                setShowResults(false);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-slate-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <Card className="absolute z-[100] w-full mt-2 bg-slate-800/98 backdrop-blur-xl border-slate-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-h-[500px] overflow-y-auto animate-in slide-in-from-top-2 duration-200 ring-1 ring-green-500/20">
            <CardContent className="p-2">
              {error ? (
                <div className="p-4 text-center text-red-400">
                  <p className="text-sm">{error}</p>
                </div>
              ) : players.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Không tìm thấy cầu thủ</p>
                  <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className="w-full p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Player Photo */}
                        <div className="relative flex-shrink-0">
                          {player.photo_url ? (
                            <img
                              src={player.photo_url}
                              alt={player.name}
                              className="w-12 h-12 object-cover rounded-full border border-slate-600 group-hover:border-green-500/50 transition-colors"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-player.png';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 group-hover:border-green-500/50 transition-colors">
                              <User className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${player.overall >= 85 ? 'bg-yellow-500' : player.overall >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}>
                            {player.overall}
                          </div>
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                              {player.name}
                            </h4>
                            <Badge className={`text-xs border flex-shrink-0 ${getPositionColor(player.position)}`}>
                              {player.position}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {player.nationality}
                            </span>
                            <span>{player.age} tuổi</span>
                            <span className="font-medium text-slate-300">{player.club}</span>
                          </div>
                          
                          {/* Mini Stats */}
                          <div className="flex gap-2 mt-1">
                            {player.pace !== undefined && player.pace > 0 && (
                              <span className="text-xs text-green-400">PAC {player.pace}</span>
                            )}
                            {player.shooting !== undefined && player.shooting > 0 && (
                              <span className="text-xs text-red-400">SHO {player.shooting}</span>
                            )}
                            {player.dribbling !== undefined && player.dribbling > 0 && (
                              <span className="text-xs text-yellow-400">DRI {player.dribbling}</span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
