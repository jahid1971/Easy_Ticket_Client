import { apiClient } from "@/lib/api";

export type RegisterPayload = {
    firstName: string;
    lastName?: string;
    email: string;
    mobile: string;
    gender?: 'male' | 'female' | string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export async function registerUser(payload: RegisterPayload) {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
}

export async function loginUser(payload: LoginPayload) {
    const res = await apiClient.post('/auth/login', payload, { withCredentials: true });
    return res.data;
}

const exported = { registerUser, loginUser };
export default exported;
