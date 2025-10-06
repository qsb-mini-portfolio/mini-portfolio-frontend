import { Pipe, PipeTransform } from "@angular/core";
import { Utils } from "../utils";

@Pipe({
  name: 'dateOrNone'
})
export class DateOrNonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '-';
    }

    return Utils.formatDateToIsoShort(date);
  }
}