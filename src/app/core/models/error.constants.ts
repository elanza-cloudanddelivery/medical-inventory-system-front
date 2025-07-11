import { ErrorCodes } from '@core/models/error.enum';

export const ERROR_MESSAGES: Record<ErrorCodes, { message: string; userMessage: string }> = {
  [ErrorCodes.UNAUTHORIZED]: {
    message: 'No autorizado',
    userMessage: 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.'
  },
  [ErrorCodes.FORBIDDEN]: {
    message: 'Acceso denegado',
    userMessage: 'No tienes permisos para realizar esta acción.'
  },
  [ErrorCodes.TOKEN_EXPIRED]: {
    message: 'Token expirado',
    userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
  },
  [ErrorCodes.INVALID_CREDENTIALS]: {
    message: 'Credenciales inválidas',
    userMessage: 'Usuario o contraseña incorrectos.'
  },
  [ErrorCodes.NETWORK_ERROR]: {
    message: 'Error de red',
    userMessage: 'Sin conexión a internet. Verifica tu conexión.'
  },
  [ErrorCodes.SERVER_ERROR]: {
    message: 'Error del servidor',
    userMessage: 'Error interno del servidor. Intenta más tarde.'
  },
  [ErrorCodes.SERVICE_UNAVAILABLE]: {
    message: 'Servicio no disponible',
    userMessage: 'El servicio no está disponible temporalmente.'
  },
  [ErrorCodes.TIMEOUT]: {
    message: 'Tiempo de espera agotado',
    userMessage: 'La operación tardó demasiado tiempo. Intenta nuevamente.'
  },
  [ErrorCodes.VALIDATION_ERROR]: {
    message: 'Error de validación',
    userMessage: 'Los datos proporcionados no son válidos.'
  },
  [ErrorCodes.NOT_FOUND]: {
    message: 'Recurso no encontrado',
    userMessage: 'El recurso solicitado no existe.'
  },
  [ErrorCodes.CONFLICT]: {
    message: 'Conflicto',
    userMessage: 'Ya existe un registro con estos datos.'
  },
  [ErrorCodes.RFID_NOT_FOUND]: {
    message: 'RFID no encontrado',
    userMessage: 'La tarjeta RFID no está registrada en el sistema.'
  },
  [ErrorCodes.RFID_INVALID]: {
    message: 'RFID inválido',
    userMessage: 'La tarjeta RFID no es válida o está desactivada.'
  },
  [ErrorCodes.USER_DISABLED]: {
    message: 'Usuario deshabilitado',
    userMessage: 'Tu cuenta ha sido deshabilitada. Contacta al administrador.'
  },
  [ErrorCodes.UNKNOWN_ERROR]: {
    message: 'Error desconocido',
    userMessage: 'Ha ocurrido un error inesperado. Intenta nuevamente.'
  }
};