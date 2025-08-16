export default interface Address {
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