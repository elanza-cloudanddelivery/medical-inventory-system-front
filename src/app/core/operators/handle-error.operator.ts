import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { HttpErrorConfig } from '@core/models';

export function handleError(
  errorHandler: ErrorHandlerService, 
  context?: string,
  config?: HttpErrorConfig
) {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      catchError(error => errorHandler.handleHttpError(error, context, config))
    );
  };
}