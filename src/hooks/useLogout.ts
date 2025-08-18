import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/Apis/authApi";
import { deleteToken } from "@/lib/api/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            deleteToken();

            queryClient.clear();

            toast.success("Logged out successfully");

            router.push("/auth/login");
        },
        onError: (error) => {
            // Even if logout fails on server, clear local tokens and redirect
            deleteToken();
            queryClient.clear();

            console.error("Logout error:", error);
            toast.error("Logged out locally");

            router.push("/login");
        },
    });
};
