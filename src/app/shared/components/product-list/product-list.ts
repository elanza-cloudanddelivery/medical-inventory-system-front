import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalProductDto } from '@shared/models/medical-product.interface';

export type ProductListMode = 'dispensation' | 'inventory' | 'readonly';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList {
  @Input() products: MedicalProductDto[] = [];
  @Input() loading = false;
  @Input() mode: ProductListMode = 'readonly';
  @Input() showActions = true;
  @Input() showStock = true;
  @Input() showPrices = false;
  @Input() showExpiration = true;
  @Input() showCategory = true;
  @Input() showBadges = true;
  @Input() gridColumns = 3;

  // Eventos diferentes según el modo
  @Output() onAddToCart = new EventEmitter<{productId: number, quantity: number, notes?: string}>();
  @Output() onEditProduct = new EventEmitter<MedicalProductDto>();
  @Output() onDeleteProduct = new EventEmitter<number>();
  @Output() onViewDetails = new EventEmitter<MedicalProductDto>();
  @Output() onAddStock = new EventEmitter<MedicalProductDto>();

  // Getters para facilitar el uso en template
  get isDispensationMode(): boolean { 
    return this.mode === 'dispensation';     
  }
  
  get isInventoryMode(): boolean { 
    return this.mode === 'inventory'; 
  }
  
  get isReadOnlyMode(): boolean { 
    return this.mode === 'readonly'; 
  }

  get gridClass(): string {
    switch(this.gridColumns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  }

  // Método para determinar clases de Tailwind según estado
  getStockTextClass(product: MedicalProductDto): string {
    if (product.stock === 0) return 'text-red-600 font-semibold';
    if (product.isLowStock) return 'text-orange-600 font-semibold';
    return 'text-green-600 font-semibold';
  }

  getExpirationTextClass(product: MedicalProductDto): string {
    if (product.isExpired) return 'text-red-600 font-semibold';
    if (product.isNearExpiration) return 'text-orange-600 font-semibold';
    return 'text-gray-700';
  }

  // TrackBy function para performance
  trackByProductId(index: number, product: MedicalProductDto): number {
    return product.id;
  }

  // Método para agregar al carrito con validación
  addToCart(product: MedicalProductDto, quantityInput: HTMLInputElement, notesInput?: HTMLInputElement): void {
    const quantity = parseInt(quantityInput.value) || 1;
    const notes = notesInput?.value || '';

    if (quantity < 1) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (quantity > product.stock) {
      alert(`No hay suficiente stock. Disponible: ${product.stock}`);
      return;
    }

    if (!product.canBeAddedToCart) {
      alert('No tiene permisos para agregar este producto al carrito');
      return;
    }

    this.onAddToCart.emit({
      productId: product.id,
      quantity: quantity,
      notes: notes
    });

    // Resetear campos
    quantityInput.value = '1';
    if (notesInput) {
      notesInput.value = '';
    }
  }
}