import { Component, ChangeDetectorRef, OnInit, OnDestroy, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '@features/dispensation/services/cart.service';
import { CartDto, AddToCartRequest, CartResponse, UpdateItemCartRequest, DispenseCartRequest } from '@features/dispensation/models/cart.interface';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { AppError } from '@core/models/error.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})

export class Cart implements OnInit, OnDestroy {

  cart: CartDto | null = null;
  loading = false;
  dispensing = false;
  errorMessage = signal('');

  dispenseForm = {
    reason: '',
    department: '',
    notes: ''
  };

  @Output() onDispenseComplete = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef, 
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage.set('');
    this.cdr.detectChanges();

    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('🛒 Carrito cargado:', cart);
        },
        error: (error: AppError) => {
          console.error('💥 Error cargando carrito:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addToCart(request: AddToCartRequest): void {
    console.log('🛒 Agregando producto al carrito:', request);

    this.cartService.addToCart(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.cart) {
            this.cart = response.cart;
            this.errorMessage.set('');
            console.log('✅ Producto agregado exitosamente');
          } else {
            this.errorMessage.set(response.message);
            console.error('❌ Error agregando producto:', response.message);
          }
          this.cdr.detectChanges();
        },
        error: (error: AppError) => {
          console.error('💥 Error HTTP agregando producto:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.cdr.detectChanges();
        }
      });
  }

  updateItemQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }

    console.log(`🔄 Actualizando cantidad - Item: ${itemId}, Nueva cantidad: ${newQuantity}`);

    this.cartService.updateCartItem(itemId, newQuantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.cart) {
            this.cart = response.cart;
            this.errorMessage.set('');
            console.log('✅ Cantidad actualizada');
          } else {
            this.errorMessage.set(response.message);
          }
          this.cdr.detectChanges();
        },
        error: (error: AppError) => {
          console.error('💥 Error actualizando cantidad:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.cdr.detectChanges();
        }
      });
  }

  removeItem(itemId: number): void {
    console.log(`🗑️ Eliminando item: ${itemId}`);

    this.cartService.removeCartItem(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.cart) {
            this.cart = response.cart;
            this.errorMessage.set('');
            console.log('✅ Item eliminado');
          } else {
            this.errorMessage.set(response.message);
          }
          this.cdr.detectChanges();
        },
        error: (error: AppError) => {
          console.error('💥 Error eliminando item:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.cdr.detectChanges();
        }
      });
  }

  clearCart(): void {
    if (!confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
      return;
    }

    console.log('🗑️ Limpiando carrito completo');

    this.cartService.clearCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.cart = null;
            this.errorMessage.set('');
            console.log('✅ Carrito limpiado');
          } else {
            this.errorMessage.set(response.message);
          }
          this.cdr.detectChanges();
        },
        error: (error: AppError) => {
          console.error('💥 Error limpiando carrito:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.cdr.detectChanges();
        }
      });
  }

  dispenseCart(): void {
    if (!this.cart || this.cart.isEmpty) {
      this.errorMessage.set('El carrito está vacío');
      return;
    }

    if (!this.cart.canBeConfirmed) {
      this.errorMessage.set('El carrito no puede ser dispensado en este momento');
      return;
    }

    if (!confirm(`¿Dispensar ${this.cart.totalItems} productos del carrito?`)) {
      return;
    }

    console.log('💊 Dispensando carrito:', this.dispenseForm);

    this.dispensing = true;
    this.errorMessage.set('');
    this.cdr.detectChanges();

    const request: DispenseCartRequest = {
      reason: this.dispenseForm.reason || 'Dispensación manual',
      department: this.dispenseForm.department || 'Farmacia',
      notes: this.dispenseForm.notes
    };

    this.cartService.dispenseCart(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('✅ Carrito dispensado exitosamente');
            this.cart = null;
            this.errorMessage.set('');
            this.resetDispenseForm();
            alert('¡Carrito dispensado exitosamente!');
            this.onDispenseComplete.emit();
          } else {
            this.errorMessage.set(response.message);
            console.error('❌ Error dispensando:', response.message);
          }
          this.dispensing = false;
          this.cdr.detectChanges();
        },
        error: (error: AppError ) => {
          console.error('💥 Error HTTP dispensando:', error);
          this.errorMessage.set(this.errorHandler.getUserMessage(error));
          this.dispensing = false;
          this.cdr.detectChanges();
        }
      });
  }

  private resetDispenseForm(): void {
    this.dispenseForm = {
      reason: '',
      department: '',
      notes: ''
    };
  }

  onClearError(): void {
    this.errorMessage.set('');
  }


  get hasItems(): boolean {
    return this.cart && !this.cart.isEmpty || false;
  }

  get totalItems(): number {
    return this.cart?.totalItems || 0;
  }

  get totalValue(): number {
    return this.cart?.totalValue || 0;
  }

  get canDispense(): boolean {
    return this.cart?.canBeConfirmed || false;
  }

  public addProduct(productId: number, quantity: number, notes?: string): void {
    const request: AddToCartRequest = {
      productId,
      quantity,
      itemNotes: notes
    };
    this.addToCart(request);
  }

  trackByItemId(index: number, item: any): number {
    return item.id;
  }
  
}