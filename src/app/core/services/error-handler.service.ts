import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { 
  AppError, 
  HttpErrorConfig, 
  ErrorCodes, 
  ErrorUtils 
} from '@core/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleHttpError(
    error: HttpErrorResponse, 
    context?: string,
    config: HttpErrorConfig = {}
  ): Observable<never> {
    const appError = this.transformHttpErrorToAppError(error, context);
    
    if (config.logError !== false) {
      this.logError(appError, error);
    }
    
    return throwError(() => appError);
  }

  private transformHttpErrorToAppError(
    error: HttpErrorResponse, 
    context?: string
  ): AppError {
    let errorCode = this.mapStatusToErrorCode(error.status, error, context);
    let details = error.error;

    const errorMessages = ErrorUtils.getErrorMessage(errorCode);

    return {
      code: errorCode,
      message: errorMessages.message,
      userMessage: errorMessages.userMessage,
      details,
      timestamp: new Date()
    };
  }

  private mapStatusToErrorCode(
    status: number, 
    error: HttpErrorResponse, 
    context?: string
  ): ErrorCodes {
    switch (status) {
      case 0:
        return ErrorCodes.NETWORK_ERROR;
      case 401:
        return this.determineAuthError(error);
      case 403:
        return ErrorCodes.FORBIDDEN;
      case 404:
        return this.determineNotFoundError(error, context);
      case 409:
        return ErrorCodes.CONFLICT;
      case 422:
        return ErrorCodes.VALIDATION_ERROR;
      case 500:
        return ErrorCodes.SERVER_ERROR;
      case 503:
        return ErrorCodes.SERVICE_UNAVAILABLE;
      default:
        return ErrorCodes.UNKNOWN_ERROR;
    }
  }

  private determineAuthError(error: HttpErrorResponse): ErrorCodes {
    if (error.error?.code === 'TOKEN_EXPIRED') {
      return ErrorCodes.TOKEN_EXPIRED;
    }
    if (error.error?.code === 'INVALID_CREDENTIALS') {
      return ErrorCodes.INVALID_CREDENTIALS;
    }
    return ErrorCodes.UNAUTHORIZED;
  }

  private determineNotFoundError(error: HttpErrorResponse, context?: string): ErrorCodes {
    if (context === 'rfid') {
      return ErrorCodes.RFID_NOT_FOUND;
    }
    return ErrorCodes.NOT_FOUND;
  }

  private logError(appError: AppError, originalError: HttpErrorResponse): void {
    // SIEMPRE log en desarrollo
    if (!environment.production) {
      console.group(`🚨 Error: ${appError.code}`);
      console.error('App Error:', appError);
      console.error('HTTP Error:', originalError);
      console.groupEnd();
    }
    
    // En producción, solo errores críticos
    if (environment.production && this.isCriticalError(appError)) {
      // Aquí enviarías al backend o Sentry
      console.error('Critical error in production:', appError.code);
    }
  }
  
  private isCriticalError(error: AppError): boolean {
    return [
      ErrorCodes.SERVER_ERROR,
      ErrorCodes.UNKNOWN_ERROR
    ].includes(error.code as ErrorCodes);
  }

  // Métodos de utilidad
  getUserMessage(error: AppError): string {
    return error.userMessage;
  }

  isErrorType(error: AppError, errorCode: ErrorCodes): boolean {
    return error.code === errorCode;
  }

  isNetworkError(error: AppError): boolean {
    return ErrorUtils.isNetworkError(error);
  }

  isAuthError(error: AppError): boolean {
    return ErrorUtils.isAuthError(error);
  }

  shouldRetry(error: AppError): boolean {
    return ErrorUtils.shouldRetry(error);
  }
}