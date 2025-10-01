export class Utils {
    static getErrorOrDefault(error: any, defaultMessage: string): string {
        try {
          return JSON.parse(error.error).message;
        } catch {
          return defaultMessage;
        }
    }

    static formatDateToIsoShort(date: string | Date): string {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // mois 0-11
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

