'use client';

import { useState, useEffect } from 'react';
import { Search, X, Users, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Team } from '@/types/team';

interface TeamSearchProps {
  onTeamSelect: (team: Team | null) => void;
  selectedTeam: Team | null;
}

export default function TeamSearch({ onTeamSelect, selectedTeam }: TeamSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTeams = async () => {
      if (searchTerm.length < 2) {
        setTeams([]);
        setShowResults(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/teams/search?q=${encodeURIComponent(searchTerm)}&limit=8`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Search failed');
        }
        
        console.log('🔍 Team search results:', data);
        setTeams(data.teams || []);
        setShowResults(true);
      } catch (error) {
        console.error('Team search error:', error);
        setError(error instanceof Error ? error.message : 'Search failed');
        setTeams([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTeams, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleTeamSelect = (team: Team) => {
    onTeamSelect(team);
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  const clearSelection = () => {
    onTeamSelect(null);
    setSearchTerm('');
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="relative w-full">
      {/* Selected Team Display */}
      {selectedTeam && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={selectedTeam.crest}
                  alt={selectedTeam.name}
                  className="w-12 h-12 object-contain transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png';
                  }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{selectedTeam.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedTeam.area?.name || 'Unknown'}</span>
                  </div>
                  {selectedTeam.founded && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Thành lập {selectedTeam.founded}</span>
                    </div>
                  )}
                </div>
                {/* Running Competitions */}
                {selectedTeam.runningCompetitions && selectedTeam.runningCompetitions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTeam.runningCompetitions.slice(0, 3).map((comp, index) => (
                      <Badge key={comp.id} variant="secondary" className="text-xs bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
                        {comp.name}
                      </Badge>
                    ))}
                    {selectedTeam.runningCompetitions.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-slate-700/50">
                        +{selectedTeam.runningCompetitions.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform duration-300 group-focus-within:scale-110" />
        <Input
          type="text"
          placeholder="Tìm kiếm đội bóng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg group"
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
      {showResults && teams.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[9999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-300 backdrop-blur-md">
          <div className="p-1">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-600 cursor-pointer rounded-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleTeamSelect(team)}
              >
                <div className="relative">
                  <img
                    src={team.crest}
                    alt={team.name}
                    className="w-10 h-10 object-contain flex-shrink-0 transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-team.png';
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{team.name}</h4>
                    <Badge variant="outline" className="text-xs font-mono bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border-blue-200 dark:border-slate-500">
                      {team.tla}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <img
                        src={team.area.flag}
                        alt={team.area.name}
                        className="w-4 h-3 object-cover rounded shadow-sm"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{team.area.name}</span>
                    </div>
                    {team.venue && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{team.venue}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchTerm.length >= 2 && teams.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[9999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-300">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Không tìm thấy đội bóng</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Thử tìm kiếm với từ khóa khác cho "{searchTerm}"</p>
          </div>
        </div>
      )}
    </div>
  );
}