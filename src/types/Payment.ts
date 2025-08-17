import  { TUser } from './User';
import type { TBooking } from './Booking';

export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "card" | "mobile_banking" | "bank_transfer" | "cash";

export type TPayment = {
    id: string;
    userId: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
    user: TUser;
    bookings?: TBooking[];
};

export interface PaymentCreateInput {
    userId: string;
    amount: number;
    status?: PaymentStatus;
    method: PaymentMethod;
    transactionId: string;
}

export interface PaymentUpdateInput {
    status?: PaymentStatus;
    transactionId?: string;
}

export interface PaymentFormData {
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
}