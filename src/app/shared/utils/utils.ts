export class Utils {
    static getErrorOrDefault(error: any, defaultMessage: string): string {
        try {
          return JSON.parse(error.error).message;
        } catch {
          return defaultMessage;
        }
    }
}