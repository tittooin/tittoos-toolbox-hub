
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
      return await response.json();
    } catch (error) {
      console.error('Error fetching all matches:', error);
      return { success: false, data: { live: [], upcoming: [], recent: [] }, error: String(error) };
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
