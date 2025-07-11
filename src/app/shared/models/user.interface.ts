export interface UserAuthDto {
    id: number;
    username: string;
    fullName: string;
    roleCode: number;
    roleName: string;
    department: string;
    
    // Permisos calculados para la UI
    canDispenseNormalProducts: boolean;
    canDispenseControlledProducts: boolean;
    isMedicalStaff: boolean;
  }
