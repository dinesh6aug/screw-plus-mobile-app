import { Address } from "@/types/types";

type AddressFields = Pick<Address, "address" | "city" | "state" | "pincode">;

export const formatAddress = (addr: AddressFields) => {
    return `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
};

export function getDiscountPercentage(mrp: number, salePrice: number): number {
    if (!mrp || mrp <= 0) return 0; // avoid divide by zero
    const discount = ((mrp - salePrice) / mrp) * 100;
    return discount ? Math.round(discount) : 0; // round to nearest %
}

// export const getProductVariant = (product: any, size?: string, color?: string): Product => {
//     // Find exact match
//     const variant = product.variants?.find(
//         (v: any) => v.size === size && v.color === color
//     );

//     if (variant) {
//         product.price = variant.price;
//         product.originalPrice = variant.originalPrice;
//     }

//     // If no exact match, find the lowest price variant
//     if (product.variants && product.variants.length > 0) {
//         const lowestVariant = product.variants.reduce((min: any, v: any) =>
//             v.price < min.price ? v : min
//         );
//         product.price = lowestVariant.price;
//         product.originalPrice = lowestVariant.originalPrice;
//     }

//     // Fallback to product price
//     return product;
// };




export const getProductVariant = (product: any, size?: string, color?: string) => {
    if (size && color) {
        // Find exact match
        const variant = product.variants?.find(
            (v: any) => v.size === size && v.color === color
        );
        return variant;
    } else if (product.variants && product.variants.length > 0) {
        const lowestVariant = product.variants.reduce((min: any, v: any) =>
            v.price < min.price ? v : min
        );
        return lowestVariant;
    } else {
        return {
            price: product.price,
            originalPrice: product.price
        }
    }
};
