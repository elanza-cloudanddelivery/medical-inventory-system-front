// features/dispensation/pages/dispensation-page/dispensation-page.component.ts
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductList } from '@shared/components/product-list/product-list';
import { DispensationService } from '@features/dispensation/services/dispensation.service';
import { MedicalProductDto } from '@shared/models/medical-product.interface';
import { Cart } from '@features/dispensation/cart/cart';

@Component({
  selector: 'app-dispensation-page',
  standalone: true,
  imports: [CommonModule, ProductList, Cart],
  templateUrl: './dispensation.html',
  styleUrls: ['./dispensation.css']
})


export class Dispensation implements OnInit {

  products: MedicalProductDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dispensationService: DispensationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  @ViewChild('cartComponent') cartComponent!: Cart;

  onDispenseComplete(): void {
    this.loadProducts();
  }

  // 🔹 CUANDO PRODUCTLIST EMITE EL EVENTO
  onAddToCart(event: {productId: number, quantity: number, notes?: string}): void {
    console.log('Agregando al carrito:', event);
    
    // 🔹 LLAMAR AL MÉTODO DEL CARRITO
    this.cartComponent.addProduct(event.productId, event.quantity, event.notes);
  }

  // ✅ Productos adaptados - SOLO LO ESENCIAL para dispensación
  get adaptedProducts(): any[] {
    return this.products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.stock,
      expirationDate: product.expirationDate,
      canBeAddedToCart: product.canBeAddedToCart,
      // Campos mínimos requeridos por el componente
      statusLabel: product.canBeAddedToCart ? 'Disponible' : 'No disponible',
      statusColor: product.canBeAddedToCart ? 'green' : 'red',
      warnings: []
    }));
  }

  onSearch(searchTerm: string): void {
    console.log('🔍 Buscar:', searchTerm);
    // TODO: Implementar búsqueda
  }

  onRetry(): void {
    this.loadProducts();
  }

  onClearError(): void {
    this.error = null;
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.dispensationService.getAvailableProducts().subscribe({
      next: (response) => {
        this.products = response.success ? response.products : [];
        this.error = response.success ? null : response.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error de conexión';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}