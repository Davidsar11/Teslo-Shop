import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Navigation, Pagination} from 'swiper/modules'
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'app-product-carrusel',
  imports: [ProductImagePipe],
  templateUrl: './product-carrusel.component.html',
  styles: `
    .swiper{
      width: 70%;
    }
  `
})
export class ProductCarruselComponent implements AfterViewInit{

  images = input.required<string[]>();

  swiperDiv = viewChild.required<ElementRef>('swiperDiv');


  ngAfterViewInit(): void {
    const elm = this.swiperDiv().nativeElement;

    const swiper = new Swiper(elm, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [
        Navigation, Pagination

      ],


      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

}
