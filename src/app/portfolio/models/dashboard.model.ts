import {ApiPositionResponse} from './position.model';

export interface ApiDashboardResponse {
  currentPrice: number;
  boughtPrice: number;
  yield: number;
  sectors: SectorSlice[];
  portfolio: ApiPositionResponse
}


export interface SectorSlice {
  sector: string;
  currentPrice: number;
  volume: number;
}
