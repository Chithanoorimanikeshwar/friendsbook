import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateObject'
})
export class DateObjectPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): Date {
    return new Date(value);
  }

}
