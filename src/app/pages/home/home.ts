import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private router = inject(Router);

  goToManualLogin(): void {
    this.router.navigate(['/login/manual']);
  }

  goToRfidLogin(): void {
    this.router.navigate(['/login/rfid']);
  }

}
