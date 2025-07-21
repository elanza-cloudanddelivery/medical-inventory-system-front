export interface MedicalProductDto {
    id: number;
    name: string;
    sku: string;
    category: string;
    categoryCode: number;
    price: number;
    stock: number;
    minimumStock: number;
    rfidCode?: string;
    expirationDate: string; // DateTime del backend viene como string
    manufacturingDate: string;
    batchNumber?: string;
    requiresAuthorization: boolean;
    isControlled: boolean;
    storageConditions?: string;
    
    // Estados calculados
    isNearExpiration: boolean;
    isExpired: boolean;
    isLowStock: boolean;
    isAvailable: boolean;
    canBeAddedToCart: boolean;

    // Campos que el componente espera pero el backend no tiene
    statusLabel: string;
    statusColor: string;
    warnings: string[];
  }
  
  export interface MedicalProductResponse {
    success: boolean;
    message: string;
    products: MedicalProductDto[];
  }
  