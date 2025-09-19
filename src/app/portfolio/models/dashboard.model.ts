export interface ApiDashboardResponse {
  currentPrice: number;
  boughtPrice: number;
  yield: number;
  sectors: SectorSlice[];
}


export interface SectorSlice {
  sector: string;
  currentPrice: number;
  volume: number;
}
