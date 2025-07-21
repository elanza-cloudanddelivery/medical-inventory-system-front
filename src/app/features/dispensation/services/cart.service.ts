import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { handleError } from '@core/operators/handle-error.operator';
import { ErrorHandlerService } from '@core/services/error-handler.service';

import { AuthService } from '@features/auth/services/auth.service';
import { 
  CartDto, 
  AddToCartRequest, 
  CartResponse, 
  UpdateItemCartRequest, 
  DispenseCartRequest 
} from '@features/dispensation/models/cart.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  private readonly baseUrl = environment.apiUrl;

  // ✅ OBTENER CARRITO ACTIVO
  getCart(): Observable<CartDto> {
    console.log('🛒 Obteniendo carrito activo...');
    return this.http.get<CartDto>(`${this.baseUrl}/cart`).pipe(
      handleError(this.errorHandler, 'getCart', { logError: true })
    );
  }

  // ✅ AGREGAR PRODUCTO AL CARRITO
  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    console.log('🛒 Agregando producto al carrito:', request);
    return this.http.post<CartResponse>(`${this.baseUrl}/cart/add`, request).pipe(
      handleError(this.errorHandler, 'addToCart', { logError: true })
    );
  }

  // ✅ ACTUALIZAR CANTIDAD DE ITEM
  updateCartItem(itemId: number, newQuantity: number): Observable<CartResponse> {
    const request: UpdateItemCartRequest = { newQuantity };
    console.log(`🔄 Actualizando item ${itemId} a cantidad ${newQuantity}`);
    return this.http.put<CartResponse>(`${this.baseUrl}/cart/item/${itemId}/quantity`, request).pipe(
      handleError(this.errorHandler, 'updateCartItem', { logError: true })
    );
  }

  // ✅ ELIMINAR ITEM DEL CARRITO
  removeCartItem(itemId: number): Observable<CartResponse> {
    const request: UpdateItemCartRequest = { newQuantity: 0 };
    console.log(`🔄 Eliminando item ${itemId} del carrito`);
    return this.http.put<CartResponse>(`${this.baseUrl}/cart/item/${itemId}/quantity`, request).pipe(
      handleError(this.errorHandler, 'removeCartItem', { logError: true })
    );
  }

  // ✅ LIMPIAR CARRITO COMPLETO
  clearCart(): Observable<CartResponse> {
    console.log('🗑️ Limpiando carrito completo');
    return this.http.delete<CartResponse>(`${this.baseUrl}/cart/clear`).pipe(
      handleError(this.errorHandler, 'clearCart', { logError: true })
    );
  }

  // ✅ DISPENSAR CARRITO
  dispenseCart(request: DispenseCartRequest): Observable<CartResponse> {
    console.log('💊 Dispensando carrito:', request);
    return this.http.post<CartResponse>(`${this.baseUrl}/cart/dispense`, request).pipe(
      handleError(this.errorHandler, 'dispenseCart', { logError: true })
    );
  }

  // ✅ CHEQUEAR SI SE PUEDE DISPENSAR EL CARRITO
  canDispenseCart(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/cart/can-dispense`).pipe(
      handleError(this.errorHandler, 'canDispenseCart', { logError: true })
    );
  }
}
