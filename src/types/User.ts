import type { TBooking } from './Booking';
import type { TPayment } from './Payment';

export type UserRole = "USER" | "ADMIN" | "OPERATOR" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type TUser = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    bookings?: TBooking[];
    payments?: TPayment[];
};

export interface UserCreateInput {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface UserUpdateInput {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface UserFormData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

export interface UserRegisterInput {
    name: string;
    email: string;
    phone?: string;
    password: string;
}