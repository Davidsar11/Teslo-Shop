import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { ProductComponent } from "../../components/product/product.component";
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  private activatedRoute  =inject(ActivatedRoute);

  private paginationServie = inject(PaginationService);

  currentPage = computed(this.paginationServie.currentPage);

  private gender = toSignal(
    this.activatedRoute.params.pipe(
      map( ({gender}) =>  {
        return gender;
      }),
    )
  );

  private productService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({gender: this.gender(), page: this.currentPage()-1}),
    loader: ({ request }) => {
      
      return this.productService.getProducts({
        limit: 8,
        offset: request.page * 8,
        gender: request.gender,
      });
    },
  });
 }
