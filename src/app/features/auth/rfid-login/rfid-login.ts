// src/app/auth/rfid-login/rfid-login.component.ts

import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@features/auth/services/auth.service';
import { RfidLoginRequest } from '@features/auth/models/auth.interface';
import { AppError } from '@app/core/models/error.interface';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';

@Component({
  selector: 'app-rfid-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './rfid-login.html',
  styleUrl: './rfid-login.css'
})

export class RfidLogin {
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);

  rfidCode = '';
  isLoading = false;
  errorMessage = signal('');

  onSubmit(): void {
    if (!this.rfidCode.trim()) {
      this.errorMessage.set('Ingrese un código RFID');
      return;
    }

    this.isLoading = true;
    this.errorMessage.set('');

    const rfidData: RfidLoginRequest = {
      rfidCode: this.rfidCode.trim()
    };

    this.authService.rfidLogin(rfidData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          alert(`✅ Login exitoso!\nBienvenido: ${response.user?.fullName}`);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Error en el login');
        }
      },
      error: (error: AppError) => {
        this.isLoading = false;
        this.errorMessage.set(this.errorHandler.getUserMessage(error));
        
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}