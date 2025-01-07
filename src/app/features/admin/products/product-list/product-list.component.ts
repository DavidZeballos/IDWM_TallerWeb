import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/products/product.service';
import { Product } from '../../../../core/models/product.model';
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
      },
      error: (err) => console.error('Error al cargar productos:', err),
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

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Producto eliminado con éxito');
        this.fetchProducts();
      },
      error: (err) => console.error('Error al eliminar producto:', err),
    });
  }
}
