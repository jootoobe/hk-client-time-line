import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number, name?: string): string {

    if(value && !name) {
      return value.length < limit  ? value : value.slice(0, limit) + '...';
    }
    else if(value && name === 'chip') {
      return value.length < limit  ? value : value.slice(0, limit);
    }
    return value
  }
}
