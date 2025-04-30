import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarruselComponent } from '@products/components/product-carrusel/product-carrusel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';
import { Product } from '@products/interfaces/product.interface';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@products/services/products.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductCarruselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  private router = inject(Router);

  private productService = inject(ProductsService);

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  tempImages = signal<string[]>([]);
  imageFileList = signal<FileList | undefined>(undefined);

  wasSaved = signal(false);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required]],
  });

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };
    //obtengo los  datos de el formulario ya formateados

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.crearProducto(productLike, this.imageFileList() )
      ); // si es new creo el producto y navego a la dirección del producto creado
      this.router.navigate(['/admin/products', product.id]);
    } else
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike, this.imageFileList())
      ); // si no es  nuevo sólo lo actualizo

    this.wasSaved.set(true); // activar mensaje de guardado

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 2000); // desactivar mensaje de guardadod a los dos segundos
  }

  private setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    // inicializa el form con los datos obtenidos
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
    // inicializa los tags que tineen formato diferente
  }

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      // si ya esta seleccionado lo quita
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      // si no está seleccionado lo quita
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onFilesChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    // cojo los archivos
    this.imageFileList.set(fileList ?? undefined);


    this.tempImages.set( Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    ));
    // creo URLs para cada archivo para mostrar la previsualización

    // añado las imagenes al producto para que salga en el swiper
    this.product().images = [... this.product().images, ... this.tempImages()];
  }
}
