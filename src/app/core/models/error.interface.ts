export interface AppError {
    code: string;
    message: string;
    userMessage: string;
    details?: any;
    timestamp: Date;
  }
  
export interface HttpErrorConfig {
  showUserMessage?: boolean;
  logError?: boolean;
  redirectOnUnauthorized?: boolean;
}