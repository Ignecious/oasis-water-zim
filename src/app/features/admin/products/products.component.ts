import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  displayDialog = false;
  isEditMode = false;
  
  selectedProduct: Product = this.getEmptyProduct();
  
  categories = [
    { label: 'Water', value: 'water' },
    { label: 'Ice', value: 'ice' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Dispensers', value: 'dispensers' }
  ];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
      }
    });
  }

  openAddDialog() {
    this.isEditMode = false;
    this.selectedProduct = this.getEmptyProduct();
    this.displayDialog = true;
  }

  openEditDialog(product: Product) {
    this.isEditMode = true;
    this.selectedProduct = { ...product };
    this.displayDialog = true;
  }

  saveProduct() {
    if (!this.validateProduct()) {
      return;
    }

    if (this.isEditMode) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully'
          });
          this.loadProducts();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product'
          });
        }
      });
    } else {
      // Generate new ID
      this.selectedProduct.id = 'p' + (this.products.length + 1);
      this.productService.addProduct(this.selectedProduct).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added successfully'
          });
          this.loadProducts();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add product'
          });
        }
      });
    }
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully'
            });
            this.loadProducts();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete product'
            });
          }
        });
      }
    });
  }

  validateProduct(): boolean {
    if (!this.selectedProduct.name || !this.selectedProduct.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Product name is required'
      });
      return false;
    }
    if (!this.selectedProduct.size || !this.selectedProduct.size.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Size/Variant is required'
      });
      return false;
    }
    if (!this.selectedProduct.price || this.selectedProduct.price <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Price must be greater than 0'
      });
      return false;
    }
    if (!this.selectedProduct.category) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Category is required'
      });
      return false;
    }
    if (!this.selectedProduct.image || !this.selectedProduct.image.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Image URL is required'
      });
      return false;
    }
    return true;
  }

  getEmptyProduct(): Product {
    return {
      id: '',
      name: '',
      category: 'water',
      size: '',
      price: 0,
      image: '',
      description: '',
      stock: 0,
      featured: false
    };
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }
}
