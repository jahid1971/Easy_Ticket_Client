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
    return res
}

export async function loginUser(payload: LoginPayload) {
    const res = await apiClient.post('/auth/login', payload, { withCredentials: true });
    return res
}

export async function logoutUser() {
    const res = await apiClient.post('/auth/logout', {}, { withCredentials: true });
    return res
}

const exported = { registerUser, loginUser, logoutUser };
export default exported;
