export interface CartDto {
    id: number;
    userId: number;
    status: string;
    totalItems: number;
    totalQuantity: number;
    totalValue: number;
    isEmpty: boolean;
    canBeConfirmed: boolean;
    items: CartItemDto[];
    createdAt: string;
    lastModifiedAt: string;
}

export interface CartItemDto {
    id: number;
    productId: number;
    productName: string;
    productSKU: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemNotes?: string;
    canBeDispensed: boolean;
    addedAt: string;
}

export interface AddToCartRequest {
    productId: number;
    quantity: number;
    itemNotes?: string;
    purpose?: string;
    targetDepartment?: string;
    priority?: number;
}

export interface UpdateItemCartRequest {
    newQuantity: number;
}

export interface DispenseCartRequest {
    reason?: string;
    department?: string;
    notes?: string;
}

export interface CartResponse {
    success: boolean;
    message: string;
    cart?: CartDto;
}