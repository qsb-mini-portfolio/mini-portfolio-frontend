import { Pagination } from "../models/pagination";

export class Utils {
  static getErrorOrDefault(error: any, defaultMessage: string): string {
    try {
      return JSON.parse(error.error).message;
    } catch {
      return defaultMessage;
    }
  }

  static formatDateToIsoShort(date: string | number | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // mois 0-11
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  static intervalToMs(interval: string): number {
    const value = parseInt(interval, 10);
    if (interval.endsWith('m')) return value * 60 * 1000;
    if (interval.endsWith('h')) return value * 60 * 60 * 1000;
    if (interval.endsWith('d')) return value * 24 * 60 * 60 * 1000;
    throw new Error('Invalid interval: ' + interval);
  }

  static emptyPagination<T>(): Pagination<T> {
    return {
      items: [],
      page: 0,
      totalElements: 0
    };
  }
}

