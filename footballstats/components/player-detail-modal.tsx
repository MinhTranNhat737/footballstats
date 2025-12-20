"use client";

import { useState, useEffect } from 'react';
import { X, Star, MapPin, Calendar, TrendingUp, Award, Users, Zap, Clock, Target, Trophy, Instagram, Twitter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Player } from '@/types/player';

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerDetailModal({ player, isOpen, onClose }: PlayerDetailModalProps) {
  const [playerDetails, setPlayerDetails] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (player && isOpen) {
      fetchPlayerDetails(player.id);
    }
  }, [player, isOpen]);

  const fetchPlayerDetails = async (playerId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/players/${playerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPlayerDetails(data);
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!player) return null;

  const formatMarketValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  const displayPlayer = playerDetails || player;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header với gradient background */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                      {displayPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <img
                        src={displayPlayer.team.area.flag}
                        alt={displayPlayer.nationality}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white mb-2">
                      {displayPlayer.name}
                    </DialogTitle>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getPositionColor(displayPlayer.position)} border-white/20`}>
                        {displayPlayer.position}
                      </Badge>
                      <span className="text-white/90">#{displayPlayer.shirtNumber}</span>
                      <span className="text-white/90">{getAge(displayPlayer.dateOfBirth)} tuổi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={displayPlayer.team.crest}
                        alt={displayPlayer.team.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-white/90">{displayPlayer.team.name}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-slate-600">Đang tải thông tin chi tiết...</span>
              </div>
            ) : (
              <>
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Thông tin cá nhân
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Tên đầy đủ:</span>
                        <span className="font-medium">{displayPlayer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Quốc tịch:</span>
                        <div className="flex items-center gap-2">
                          <img src={displayPlayer.team.area.flag} alt={displayPlayer.nationality} className="w-4 h-4 rounded" />
                          <span className="font-medium">{displayPlayer.nationality}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Ngày sinh:</span>
                        <span className="font-medium">{new Date(displayPlayer.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {displayPlayer.height && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Chiều cao:</span>
                          <span className="font-medium">{displayPlayer.height} cm</span>
                        </div>
                      )}
                      {displayPlayer.weight && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Cân nặng:</span>
                          <span className="font-medium">{displayPlayer.weight} kg</span>
                        </div>
                      )}
                      {displayPlayer.preferredFoot && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Chân thuận:</span>
                          <span className="font-medium">{displayPlayer.preferredFoot}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Giá trị & Hợp đồng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Giá trị thị trường:</span>
                        <span className="font-medium text-green-600">{formatMarketValue(displayPlayer.marketValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Hợp đồng từ:</span>
                        <span className="font-medium">{new Date(displayPlayer.contract.start).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Hợp đồng đến:</span>
                        <span className="font-medium">{new Date(displayPlayer.contract.until).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Thống kê */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Thống kê mùa giải
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{displayPlayer.stats.appearances}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Trận đấu</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{displayPlayer.stats.goals}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Bàn thắng</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{displayPlayer.stats.assists}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Kiến tạo</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(displayPlayer.stats.minutesPlayed / 60)}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Giờ chơi</div>
                    </div>
                  </div>

                  {/* Advanced Stats */}
                  {displayPlayer.calculatedStats && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {displayPlayer.calculatedStats.goalsPerGame}
                        </div>
                        <div className="text-xs text-slate-500">Bàn/Trận</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {displayPlayer.calculatedStats.assistsPerGame}
                        </div>
                        <div className="text-xs text-slate-500">Kiến tạo/Trận</div>
                      </div>
                      {displayPlayer.calculatedStats.minutesPerGoal && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {displayPlayer.calculatedStats.minutesPerGoal}
                          </div>
                          <div className="text-xs text-slate-500">Phút/Bàn</div>
                        </div>
                      )}
                      {displayPlayer.calculatedStats.minutesPerAssist && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {displayPlayer.calculatedStats.minutesPerAssist}
                          </div>
                          <div className="text-xs text-slate-500">Phút/Kiến tạo</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Matches */}
                {displayPlayer.recentMatches && displayPlayer.recentMatches.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Trận đấu gần đây
                      </h3>
                      <div className="space-y-3">
                        {displayPlayer.recentMatches.map((match, index) => (
                          <div key={match.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-slate-500">{new Date(match.date).toLocaleDateString('vi-VN')}</div>
                              <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                              <Badge variant="outline" className="text-xs">{match.score}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-green-600">⚽ {match.playerPerformance.goals}</span>
                              <span className="text-blue-600">🎯 {match.playerPerformance.assists}</span>
                              <Badge variant="secondary" className="text-xs">
                                ⭐ {match.playerPerformance.rating}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Achievements */}
                {displayPlayer.achievements && displayPlayer.achievements.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Thành tích nổi bật
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {displayPlayer.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <Award className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Social Media */}
                {displayPlayer.socialMedia && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-pink-500" />
                        Mạng xã hội
                      </h3>
                      <div className="flex items-center gap-4">
                        {displayPlayer.socialMedia.instagram && (
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                            <Instagram className="w-4 h-4 text-pink-600" />
                            <span className="text-sm font-medium">{displayPlayer.socialMedia.instagram}</span>
                          </div>
                        )}
                        {displayPlayer.socialMedia.twitter && (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Twitter className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">{displayPlayer.socialMedia.twitter}</span>
                          </div>
                        )}
                        {displayPlayer.socialMedia.followers && (
                          <Badge variant="outline" className="text-xs">
                            {displayPlayer.socialMedia.followers} followers
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}