'use client';

import { useState, useEffect } from 'react';
import { Search, X, User, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Backend Player từ database
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

interface IntegratedPlayerSearchProps {
  onPlayerSelect?: (player: BackendPlayer | null) => void;
  selectedPlayer?: BackendPlayer | null;
}

export default function IntegratedPlayerSearch({ onPlayerSelect, selectedPlayer }: IntegratedPlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<BackendPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search database
  const searchPlayers = async (query: string) => {
    if (query.length < 2) return;

    try {
      const response = await fetch(`/api/backend-players?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.data || []);
      } else {
        setPlayers([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setPlayers([]);
    }
  };

  // Search with debounce
  useEffect(() => {
    const search = async () => {
      if (searchTerm.length < 2) {
        setPlayers([]);
        setShowResults(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await searchPlayers(searchTerm);
        setShowResults(true);
      } catch (err) {
        setError('Lỗi tìm kiếm');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handlePlayerSelect = (player: BackendPlayer) => {
    if (onPlayerSelect) {
      onPlayerSelect(player);
    }
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  const clearSelection = () => {
    if (onPlayerSelect) {
      onPlayerSelect(null);
    }
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  const getPositionColor = (position: string) => {
    const pos = position?.toUpperCase();
    if (pos?.includes('GK') || pos?.includes('KEEPER')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (pos?.includes('DEF') || pos?.includes('BACK') || pos?.includes('CB') || pos?.includes('LB') || pos?.includes('RB')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (pos?.includes('MID') || pos?.includes('CM') || pos?.includes('CDM') || pos?.includes('CAM')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (pos?.includes('FOR') || pos?.includes('ST') || pos?.includes('CF') || pos?.includes('LW') || pos?.includes('RW') || pos?.includes('WING')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm cầu thủ trong database (VD: Ronaldo, Messi...)"
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
                  <p className="text-xs mt-1">Thử từ khóa khác</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {players.map((player) => (
                    <button
                      key={player.player_id || player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className="w-full p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {player.photo_url ? (
                            <img
                              src={player.photo_url}
                              alt={player.name}
                              className="w-12 h-12 object-cover rounded-full border border-slate-600 group-hover:border-green-500/50 transition-colors"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 group-hover:border-green-500/50 transition-colors">
                              <User className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.overall >= 85 ? 'bg-yellow-500' : player.overall >= 80 ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            {player.overall}
                          </div>
                        </div>

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
