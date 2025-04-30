import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';




@Component({
  selector: 'app-product',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product.component.html',
})
export class ProductComponent {



   product = input.required<Product>();

}
