import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductResponse,
} from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options) {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key));
    }

    return this.http
      .get<ProductResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(tap((response) => this.productsCache.set(key, response)));
  }

  getProduct(slug: string) {
    if (this.productCache.has(slug)) {
      return of(this.productCache.get(slug));
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${slug}`)
      .pipe(tap((response) => this.productCache.set(slug, response)));
  }

  getProductById(id: string) {
    if (id === 'new') return of(emptyProduct);

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id));
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((response) => this.productCache.set(id, response)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    fileList?: FileList
  ) {
    return this.uploadImages(fileList).pipe(
      map((images) => ({
        ...productLike,
        images: [...(productLike.images ?? []), ...images],
      })),
      tap(pr  => console.log(pr)),
      switchMap((product) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, product)
      ),
      tap((response) => this.updateProductCache(response, true))
    );


  }

  private updateProductCache(product: Product, array: boolean) {
    this.productCache.set(product.id, product);

    if (array) {
      this.productsCache.forEach((response) => {
        response.products = response.products.map((current) =>
          current.id === product.id ? product : current
        );
      });
    }
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }

  crearProducto(
    productLike: Partial<Product>,
    fileList?: FileList
  ): Observable<Product> {


    return this.uploadImages(fileList).pipe(
      map((images) => ({
        ...productLike,
        images: [...(productLike.images ?? []), ...images],
      })),
      tap(pr  => console.log(pr)),
      switchMap((product) =>
        this.http.post<Product>(`${baseUrl}/products`, product)
      ),
      tap((response) => this.updateProductCache(response, true))
    );

  }
}
