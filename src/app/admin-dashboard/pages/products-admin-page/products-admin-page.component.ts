import { Component, computed, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  private productService = inject(ProductsService);

  private paginationServie = inject(PaginationService);

  currentPage = computed(this.paginationServie.currentPage);

  productsPerPage = signal(10);


  productResource = rxResource({
    request: () => ({page: this.currentPage()-1, prodPerPage: this.productsPerPage()}),
    loader: ({ request }) => {
      return this.productService.getProducts({
        limit: request.prodPerPage,
        offset: request.page * request.prodPerPage,
      });
    },
  });



}
