import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/products/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id; // Asignar solo si no es null
      this.initializeForm();
      this.loadProductDetails();
    } else {
      console.error('No se encontró el ID del producto en la ruta.');
      this.router.navigate(['/products']); // Redirigir si no hay ID
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      inStock: [0, [Validators.required, Validators.min(0)]],
      imageURL: ['', Validators.required],
      productTypeName: ['', Validators.required],
    });
  }

  loadProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => this.productForm.patchValue(product),
      error: (err) => console.error('Error al cargar el producto:', err),
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
      next: () => {
        console.log('Producto actualizado con éxito');
        this.router.navigate(['/products']);
      },
      error: (err) => console.error('Error al actualizar producto:', err),
    });
  }
}