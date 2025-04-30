import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'app-product-table',
  imports: [RouterLink, CurrencyPipe, ProductImagePipe],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {

  products = input.required<Product[]>();

}
