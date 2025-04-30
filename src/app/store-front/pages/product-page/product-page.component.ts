import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarruselComponent } from "../../../products/components/product-carrusel/product-carrusel.component";
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarruselComponent, TitleCasePipe],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  private productService = inject(ProductsService);

  private activatedRoute = inject(ActivatedRoute);

  private slug = this.activatedRoute.snapshot.params['idSlug'];





  productResource = rxResource({
    request: () => ({ idSlug : this.slug}),
    loader: ({request} ) => {
      return this.productService.getProduct(request.idSlug);
    }
  })

}
