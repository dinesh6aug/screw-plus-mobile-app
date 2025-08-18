import { CartItem } from "./product";

interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
}

interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: Date;
    deliveryAddress: string;
    paymentMethod: string;
}

export {
    Address,
    Order
};
