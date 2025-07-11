import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { RoleService } from '@shared/services/role.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  // ✅ Solo estos computed - mucho más simple
  currentUser = toSignal(this.authService.currentUser$); // ← ESTO es clave
  isLoggedIn = computed(() => !!this.currentUser());
  
  // ✅ Una sola fuente de verdad para menús
  availableMenus = computed(() => {
    const user = this.currentUser();
    console.log(user);
    console.log(this.roleService.getAvailableMenus(user || null));
    return this.roleService.getAvailableMenus(user || null);
  });

  // Info del rol para mostrar
  roleDisplayName = computed(() => {
    const user = this.currentUser();
    return this.roleService.getRoleDisplayName(user?.roleCode || 0);
  });

  roleBadgeColor = computed(() => {
    const user = this.currentUser();
    return this.roleService.getRoleBadgeColor(user?.roleCode || 0);
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Helper para obtener iniciales del usuario
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.fullName) return 'U';
    
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0] || 'U';
  }

  // Helper para trackBy en ngFor
  trackByRoute(index: number, item: any): string {
    return item.route;
  }

  // Helper para iconos
  getMenuIcon(iconName: string): string {
    const icons: Record<string, string> = {
      dashboard: '📊',
      pills: '💊', 
      inventory: '📦',
      reports: '📈',
      users: '👥',
      maintenance: '🔧',
      settings: '⚙️'
    };
    
    return icons[iconName] || '📄';
  }

}
