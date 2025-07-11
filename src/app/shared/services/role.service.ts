import { Injectable } from '@angular/core';
import { UserRoles } from '@shared/models/role.interface';
import { UserAuthDto } from '@shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  // Verificar si tiene un rol específico
  hasRole(user: UserAuthDto | null, role: UserRoles | UserRoles[]): boolean {
    if (!user) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(Number(user.roleName) as UserRoles);
  }

  // Verificar si tiene alguno de estos roles
  hasAnyRole(user: UserAuthDto | null, roles: UserRoles[]): boolean {
    if (!user) return false;

    return roles.some(role => Number(user.roleName) === role);
  }

  // Verificar permisos específicos de farmacia
  canDispenseControlledMedications(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.DOCTOR, UserRoles.PHARMACIST, UserRoles.SUPER_ADMINISTRATOR]);
  }

  canDispenseNonControlledMedications(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [
      UserRoles.DOCTOR,
      UserRoles.NURSE,
      UserRoles.PHARMACIST,
      UserRoles.ADMINISTRATOR,
      UserRoles.SUPER_ADMINISTRATOR
    ]);
  }

  canManageMedications(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.PHARMACIST, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR]);
  }

  canAccessMaintenance(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.TECHNICIAN, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR]);
  }

  canViewReports(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [
      UserRoles.DOCTOR,
      UserRoles.PHARMACIST,
      UserRoles.ADMINISTRATOR,
      UserRoles.SUPER_ADMINISTRATOR,
      UserRoles.VIEWER
    ]);
  }

  canManageUsers(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR]);
  }

  canAccessSystemSettings(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.SUPER_ADMINISTRATOR);
  }

  // Verificadores específicos por rol
  isDoctor(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.DOCTOR);
  }

  isNurse(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.NURSE);
  }

  isPharmacist(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.PHARMACIST);
  }

  isTechnician(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.TECHNICIAN);
  }

  isAdministrator(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.ADMINISTRATOR);
  }

  isSuperAdministrator(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.SUPER_ADMINISTRATOR);
  }

  isViewer(user: UserAuthDto | null): boolean {
    return this.hasRole(user, UserRoles.VIEWER);
  }

  isAdminLevel(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR]);
  }

  isMedicalStaff(user: UserAuthDto | null): boolean {
    return this.hasAnyRole(user, [UserRoles.DOCTOR, UserRoles.NURSE, UserRoles.PHARMACIST]);
  }

  // ✅ Helper para nombres de display
  getRoleDisplayName = (roleCode: number): string => {
    switch (roleCode) {
      case UserRoles.DOCTOR: return 'Médico';
      case UserRoles.NURSE: return 'Enfermero/a';
      case UserRoles.PHARMACIST: return 'Farmacéutico/a';
      case UserRoles.TECHNICIAN: return 'Técnico';
      case UserRoles.ADMINISTRATOR: return 'Administrador';
      case UserRoles.SUPER_ADMINISTRATOR: return 'Super Administrador';
      case UserRoles.VIEWER: return 'Solo Lectura';
      default: return 'Rol Desconocido';
    }
  };

  // ✅ Helper para colores de badges
  getRoleBadgeColor = (roleCode: number): string => {
    switch (roleCode) {
      case UserRoles.DOCTOR: return 'bg-blue-100 text-blue-800';
      case UserRoles.NURSE: return 'bg-green-100 text-green-800';
      case UserRoles.PHARMACIST: return 'bg-purple-100 text-purple-800';
      case UserRoles.TECHNICIAN: return 'bg-orange-100 text-orange-800';
      case UserRoles.ADMINISTRATOR: return 'bg-red-100 text-red-800';
      case UserRoles.SUPER_ADMINISTRATOR: return 'bg-red-200 text-red-900';
      case UserRoles.VIEWER: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener menús disponibles según rol
  getAvailableMenus(user: UserAuthDto | null): NavItem[] {

    if (!user) return [];

    const allMenus: NavItem[] = [
      {
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'dashboard',
        roles: [UserRoles.DOCTOR, UserRoles.NURSE, UserRoles.PHARMACIST, UserRoles.TECHNICIAN, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR, UserRoles.VIEWER]
      },
      {
        label: 'Dispensación',
        route: '/dispensing',
        icon: 'pills',
        roles: [UserRoles.DOCTOR, UserRoles.NURSE, UserRoles.PHARMACIST, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR],
        badge: this.canDispenseControlledMedications(user) ? 'CONTROLADOS' : undefined
      },
      {
        label: 'Inventario',
        route: '/inventory',
        icon: 'inventory',
        roles: [UserRoles.PHARMACIST, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR, UserRoles.VIEWER]
      },
      {
        label: 'Reportes',
        route: '/reports',
        icon: 'reports',
        roles: [UserRoles.DOCTOR, UserRoles.PHARMACIST, UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR, UserRoles.VIEWER]
      },
      {
        label: 'Usuarios',
        route: '/users',
        icon: 'users',
        roles: [UserRoles.ADMINISTRATOR, UserRoles.SUPER_ADMINISTRATOR]
      },
    ];

    const userRole = user.roleCode as UserRoles;
    return allMenus.filter(menu => menu.roles.includes(userRole));
  }
}

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles: UserRoles[];
  badge?: string;
  children?: NavItem[];
}