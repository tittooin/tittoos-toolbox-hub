
const API_KEY = 'ceecf60c-3651-44fc-bd27-bfcce55c531b.463baa776a11ddecdd41507a58eeff813cbff50cfdb1c2d08559e736d26b0';
const BASE_URL = 'https://cricbuzz-api-v2.moremagical4.workers.dev';

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
      const response = await fetch(`${BASE_URL}/api/v1/matches`, {
        headers: { 'x-api-key': API_KEY }
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error('API Key Invalid');
      return data;
    } catch (error) {
      console.error('API Error, using mock fallback:', error);
      return { 
        success: true, 
        data: { 
          live: [
            { id: 101, title: "MI vs KKR", status: "live", start_time: Date.now(), team_a: "MI", team_b: "KKR", team_a_img: "/placeholder.svg", team_b_img: "/placeholder.svg", series_name: "IPL 2026", last_score: "182/4", last_over: "18.2" }
          ], 
          upcoming: [
            { id: 102, title: "CSK vs RCB", status: "upcoming", start_time: Date.now() + 86400000, team_a: "CSK", team_b: "RCB", team_a_img: "/placeholder.svg", team_b_img: "/placeholder.svg", series_name: "IPL 2026" }
          ], 
          recent: [] 
        } 
      } as any;
    }
  },

  async getLiveMatches(): Promise<ApiResponse<CricketMatch[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/live`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return { success: false, data: [], error: String(error) };
    }
  },

  async getUpcomingMatches(): Promise<ApiResponse<CricketMatch[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/upcoming`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return { success: false, data: [], error: String(error) };
    }
  },

  async getMatchInfo(id: string | number): Promise<ApiResponse<CricketMatch>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/get-info?id=${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching match info for ${id}:`, error);
      return { success: false, data: {} as CricketMatch, error: String(error) };
    }
  },

  async getMatchSquads(id: string | number): Promise<ApiResponse<{ team_a: Squad, team_b: Squad }>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/get-squads?id=${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error('Failed to fetch squads');
      return data;
    } catch (error) {
      console.error(`Error fetching squads for ${id}:`, error);
      // Fallback with some players for demo if match is MI vs KKR (101)
      return {
        success: true,
        data: {
          team_a: { team_name: "MI", players: [{ id: "1", name: "Rohit Sharma", role: "Batsman" }, { id: "2", name: "Hardik Pandya", role: "All-rounder" }] },
          team_b: { team_name: "KKR", players: [{ id: "3", name: "Sunil Narine", role: "All-rounder" }, { id: "4", name: "Andre Russell", role: "All-rounder" }] }
        }
      } as any;
    }
  },

  async getMatchScorecard(id: string | number): Promise<ApiResponse<ScorecardInning[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/get-scorecard?id=${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching scorecard for ${id}:`, error);
      return { success: false, data: [], error: String(error) };
    }
  }
};
