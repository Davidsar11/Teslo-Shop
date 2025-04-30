import { ProductsService } from '@products/services/products.service';
import { ProductComponent } from '@store-front/components/product/product.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Component, computed, inject } from '@angular/core';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private productService = inject(ProductsService);

  private paginationServie = inject(PaginationService);

  currentPage = computed(this.paginationServie.currentPage);

  productResource = rxResource({
    request: () => ({page: this.currentPage()-1}),
    loader: ({ request }) => {
      return this.productService.getProducts({
        limit: 8,
        offset: request.page * 8,
      });
    },
  });
}
