import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { MedicalProductResponse } from '@shared/models/medical-product.interface';
import { handleError } from '@core/operators/handle-error.operator';
import { ErrorHandlerService } from '@core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DispensationService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private readonly baseUrl = environment.apiUrl;

  getAvailableProducts(): Observable<MedicalProductResponse> {
    console.log('🔄 Llamando a productos disponibles...');
    return this.http.get<MedicalProductResponse>(`${this.baseUrl}/product/available`).pipe(
      handleError(this.errorHandler, 'getAvailableProducts', { logError: true })
    );
  }
}
