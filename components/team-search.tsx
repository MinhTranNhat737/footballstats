'use client';

import { useState, useEffect } from 'react';
import { Search, X, Users } from 'lucide-react';
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

  useEffect(() => {
    const searchTeams = async () => {
      if (searchTerm.length < 2) {
        setTeams([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/teams/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        console.log('🔍 Team search results:', data);
        setTeams(data.teams || []);
        setShowResults(true);
      } catch (error) {
        console.error('Team search error:', error);
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
  };

  const clearSelection = () => {
    onTeamSelect(null);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Selected Team Display */}
      {selectedTeam && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedTeam.crest}
                alt={selectedTeam.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-team.png';
                }}
              />
              <div>
                <p className="font-medium text-sm">{selectedTeam.name}</p>
                <p className="text-xs text-gray-500">{selectedTeam.area.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm đội bóng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 300)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Debug info */}
      {searchTerm.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 bg-yellow-100 p-2 rounded">
          Debug: term="{searchTerm}" | teams={teams.length} | show={showResults.toString()} | loading={isLoading.toString()}
        </div>
      )}

      {/* Always show dropdown if there are teams (for debugging) */}
      {teams.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-0">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0"
                onClick={() => handleTeamSelect(team)}
              >
                <img
                  src={team.crest}
                  alt={team.name}
                  className="w-10 h-10 object-contain flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-team.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{team.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {team.tla}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={team.area.flag}
                      alt={team.area.name}
                      className="w-4 h-3 object-cover rounded"
                    />
                    <p className="text-xs text-gray-500">{team.area.name}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">{team.venue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results debug */}
      {searchTerm.length >= 2 && teams.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[9999] bg-red-100 border border-red-200 rounded-lg shadow-xl">
          <div className="p-4 text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Không tìm thấy đội bóng nào cho "{searchTerm}"</p>
          </div>
        </div>
      )}
    </div>
  );
}