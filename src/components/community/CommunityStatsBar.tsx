import React, { useState, useEffect } from 'react';
import { Users, LayoutGrid, FileText, CalendarCheck, Activity } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export interface CommunityStatsData {
  official_boards: number;
  registered_members: number;
  published_posts: number;
  posts_today: number;
  members_online: number;
}

export function CommunityStatsBar() {
  const [stats, setStats] = useState<CommunityStatsData>({
    official_boards: 9,
    registered_members: 0,
    published_posts: 0,
    posts_today: 0,
    members_online: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/community/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.stats) {
          setStats(data.stats);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { label: 'Official Boards', value: stats.official_boards, icon: LayoutGrid, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Registered Members', value: stats.registered_members, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Published Posts', value: stats.published_posts, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
    { label: 'Posts Today', value: stats.posts_today, icon: CalendarCheck, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Members Online', value: stats.members_online, icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', isLive: true },
  ];

  return (
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm overflow-hidden my-6">
      <CardContent className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center shrink-0`}>
                <IconComp className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {loading ? '...' : item.value.toLocaleString()}
                  </span>
                  {item.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 truncate block mt-1">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
