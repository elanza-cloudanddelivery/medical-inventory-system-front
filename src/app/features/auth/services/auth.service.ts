import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { LoginRequest, RfidLoginRequest, AuthResponse } from '@features/auth/models/auth.interface';
import { UserAuthDto } from '@shared/models/user.interface';
import { handleError } from '@core/operators/handle-error.operator';
import { ErrorHandlerService } from '@core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly USER_KEY = environment.userKey;

  // Observable para saber si el usuario está logueado
  private currentUserSubject = new BehaviorSubject<UserAuthDto | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Login normal (username/password)
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔑 Intentando login con:', credentials.identifier);

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap({
          next: response => {
            console.log('📥 Respuesta de login:', response);
            if (response.success && response.token && response.user) {
              this.setSession(response.token, response.user);
            }
          }
        }),
        handleError(this.errorHandler, 'login', { logError: true })
      );
  }

  // Login RFID
  rfidLogin(rfidRequest: RfidLoginRequest): Observable<AuthResponse> {
    console.log('📱 Intentando login RFID con:', rfidRequest.rfidCode);

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login/rfid`, rfidRequest)
      .pipe(
        tap({
          next: response => {
            console.log('📥 Respuesta de login RFID:', response);
            if (response.success && response.token && response.user) {
              this.setSession(response.token, response.user);
            }
          }
        }),
        handleError(this.errorHandler, 'rfid', { logError: true })
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    console.log('👋 Usuario deslogueado');
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > currentTime;

      if (!isValid) {
        this.logout(); // Auto-logout si expiró
      }

      return isValid;
    } catch {
      this.logout(); // Auto-logout si token inválido
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): UserAuthDto | null {
    return this.currentUserSubject.value;
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Métodos privados
  private setSession(token: string, user: UserAuthDto): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    console.log('✅ Sesión guardada para:', user.fullName);
  }

  private getUserFromStorage(): UserAuthDto | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

}