// src/app/shared/models/role.interface.ts
export interface Permission {
    resource: string;
    actions: string[];
}

export interface Role {
    id: number;
    name: string;
    displayName: string;
    permissions: Permission[];
}

// ✅ UNA SOLA definición de roles
export enum UserRoles {
    DOCTOR = 1,                    // Médico: Acceso completo a dispensación y productos controlados
    NURSE = 2,                     // Enfermero: Acceso a dispensación de productos no controlados
    PHARMACIST = 3,                // Farmacéutico: Acceso completo incluyendo gestión de medicamentos
    TECHNICIAN = 4,                // Técnico: Acceso limitado para mantenimiento y soporte
    ADMINISTRATOR = 5,             // Administrador: Gestión completa del sistema excepto configuración crítica
    SUPER_ADMINISTRATOR = 6,       // Super Administrador: Acceso total al sistema
    VIEWER = 7                     // Solo Lectura: Puede ver reportes pero no realizar movimientos
}

