
const API_KEY = 'ceecf60c-3651-44fc-bd27-bfcce55c531b.463baa776a11ddecdd41507a58eeff813cbff50cfdb1c2d08559e736d26b0';
const BASE_URL = 'https://cricbuzz-api-v2.moremagical4.workers.dev';

export interface CricketMatch {
  id: number;
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
      if (!response.ok || (await response.clone().json()).success === false) throw new Error('API Key Invalid');
      return await response.json();
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

  async getMatchInfo(id: number): Promise<ApiResponse<CricketMatch>> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/matches/get-info?id=${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching match info for ${id}:`, error);
      return { success: false, data: {} as CricketMatch, error: String(error) };
    }
  }
};
