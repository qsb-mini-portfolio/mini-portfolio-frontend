import { ApiPositionResponse } from "../portfolio/position.model";
import { SectorSlice } from "./sectorSlice";

export interface DashboardResponse {
  currentPrice: number;
  boughtPrice: number;
  yield: number;
  sectors: SectorSlice[];
  portfolio: ApiPositionResponse
}