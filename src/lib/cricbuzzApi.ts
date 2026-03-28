
const API_KEY = 'LOCAL_SCRAPER';
const BASE_URL = import.meta.env.VITE_CHAT_WS_URL?.replace('ws://', 'http://').replace('wss://', 'https://') || 'http://localhost:8787';

export interface CricketMatch {
  id: string | number;
  title: string;
  status: 'live' | 'upcoming' | 'completed';
  start_time: number;
  team_a: string;
  team_b: string;
  team_a_img: string;
  team_b_img: string;
  series_name: string;
  last_updated?: number;
  last_score?: string;
  last_wickets?: number;
  last_over?: string;
  team_a_short?: string;
  team_b_short?: string;
}

export interface Player {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface Squad {
  team_name: string;
  players: Player[];
}

export interface ScorecardInning {
  team: string;
  score: string;
  overs: string;
  wickets: string;
  batsmen: Array<{ name: string; runs: string; balls: string; fours: string; sixes: string; sr: string }>;
  bowlers: Array<{ name: string; overs: string; maidens: string; runs: string; wickets: string; econ: string }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const cricbuzzApi = {
  async getAllMatches(): Promise<ApiResponse<{ live: CricketMatch[], upcoming: CricketMatch[], recent: CricketMatch[] }>> {
    try {
      const response = await fetch(`${BASE_URL}/api/matches`);
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.error || 'Failed to fetch matches');
      return data;
    } catch (error) {
      console.error('Scraper Error:', error);
      return { 
        success: false, 
        data: { live: [], upcoming: [], recent: [] },
        error: String(error)
      };
    }
  },

  async getLiveMatches(): Promise<ApiResponse<CricketMatch[]>> {
    try {
      const res = await this.getAllMatches();
      return { success: res.success, data: res.data.live };
    } catch (error) {
      return { success: false, data: [], error: String(error) };
    }
  },

  async getUpcomingMatches(): Promise<ApiResponse<CricketMatch[]>> {
    try {
      const res = await this.getAllMatches();
      return { success: res.success, data: res.data.upcoming };
    } catch (error) {
      return { success: false, data: [], error: String(error) };
    }
  },

  async getMatchInfo(id: string | number): Promise<ApiResponse<CricketMatch>> {
    try {
      const res = await this.getAllMatches();
      const match = [...res.data.live, ...res.data.upcoming, ...res.data.recent].find(m => String(m.id) === String(id));
      if (!match) throw new Error('Match not found');
      return { success: true, data: match };
    } catch (error) {
      return { success: false, data: {} as CricketMatch, error: String(error) };
    }
  },

  async getMatchSquads(id: string | number): Promise<ApiResponse<{ team_a: Squad, team_b: Squad }>> {
    // Squads are trickier to scrape from main page, providing basic info or empty for now
    return {
      success: true,
      data: {
        team_a: { team_name: "Team A", players: [] },
        team_b: { team_name: "Team B", players: [] }
      }
    };
  },

  async getMatchScorecard(id: string | number): Promise<ApiResponse<ScorecardInning[]>> {
    return { success: true, data: [] };
  }
};
