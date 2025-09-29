import { ApiPositionResponse } from "../../portfolio/models"
import { SectorSlice } from "./SectorSlice";

export interface DashboardResponse {
  currentPrice: number;
  boughtPrice: number;
  yield: number;
  sectors: SectorSlice[];
  portfolio: ApiPositionResponse
}