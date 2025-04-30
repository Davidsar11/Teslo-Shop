import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})


export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): any {
    if( typeof value === 'string' ){
      if(value.startsWith('blob')) return value;
      return `${baseUrl}/files/product/${value}`
    }



    if(value.length > 0) return  `${baseUrl}/files/product/${value[0]}`

    return './assets/images/place.webp'
  }
}
