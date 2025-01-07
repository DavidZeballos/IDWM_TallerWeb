import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products/product.service';
import { Product } from '../../../core/models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  sortOrder: string = '';
  page: number = 1;
  pageSize: number = 8;
  Math = Math; // Para usar en la plantilla

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.applyFilters();
      },
      error: (err: any) => console.error('Error al cargar productos:', err),
    });
  }

  applyFilters(): void {
    let results = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortOrder === 'asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      results.sort((a, b) => b.price - a.price);
    }

    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = results.slice(startIndex, endIndex);
  }

  changePageSize(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.pageSize = parseInt(value, 10);
    this.page = 1;
    this.applyFilters();
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Buscar el producto en el carrito por su ID
    const existingProductIndex = cart.findIndex((item: any) => item.productId === product.id);
  
    if (existingProductIndex > -1) {
      // Incrementar la cantidad si el producto ya existe
      cart[existingProductIndex].quantity += 1;
    } else {
      // Añadir el producto al carrito si no existe
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Producto agregado al carrito:', product);
    window.dispatchEvent(new Event('cartUpdated')); // Notificar actualización al navbar
  }
  
  
}
