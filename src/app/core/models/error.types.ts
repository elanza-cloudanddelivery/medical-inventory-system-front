import { AppError } from '@core/models/error.interface';
import { ErrorCodes } from '@core/models/error.enum';
import { ERROR_MESSAGES } from '@core/models/error.constants';

export class ErrorUtils {
  static getErrorMessage(errorCode: ErrorCodes): { message: string; userMessage: string } {
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ErrorCodes.UNKNOWN_ERROR];
  }

  static isNetworkError(error: AppError): boolean {
    return [
      ErrorCodes.NETWORK_ERROR,
      ErrorCodes.TIMEOUT,
      ErrorCodes.SERVICE_UNAVAILABLE
    ].includes(error.code as ErrorCodes);
  }

  static isAuthError(error: AppError): boolean {
    return [
      ErrorCodes.UNAUTHORIZED,
      ErrorCodes.FORBIDDEN,
      ErrorCodes.TOKEN_EXPIRED,
      ErrorCodes.INVALID_CREDENTIALS
    ].includes(error.code as ErrorCodes);
  }

  static shouldRetry(error: AppError): boolean {
    return [
      ErrorCodes.NETWORK_ERROR,
      ErrorCodes.TIMEOUT,
      ErrorCodes.SERVER_ERROR
    ].includes(error.code as ErrorCodes);
  }
}
