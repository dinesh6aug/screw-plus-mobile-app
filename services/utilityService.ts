import Address from "@/types/types";

type AddressFields = Pick<Address, "address" | "city" | "state" | "pincode">;

export const formatAddress = (addr: AddressFields) => {
    return `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
};
