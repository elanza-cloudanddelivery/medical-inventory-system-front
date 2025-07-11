import { UserAuthDto } from "@shared/models/user.interface";

export interface LoginRequest {
    identifier: string;
    password: string;
  }
  
  export interface RfidLoginRequest {
    rfidCode: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: UserAuthDto; 
    token?: string;
    expiresAt?: string;
  }