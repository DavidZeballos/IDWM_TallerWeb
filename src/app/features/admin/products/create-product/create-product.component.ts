import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/products/product.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-product.component.html',
})
export class CreateProductComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      inStock: [0, [Validators.required, Validators.min(0)]],
      imageURL: ['', Validators.required],
      productTypeName: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.error('Por favor, complete correctamente todos los campos.');
      return;
    }

    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.toastr.success('Producto creado con éxito.');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => this.toastr.error('Error al crear producto: ' + err.message),
    });
  }
}
