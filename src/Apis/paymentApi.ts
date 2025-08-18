import { 
    TPayment, 
    PaymentCreateInput
} from "@/types/Payment";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  apiClient  from "@/lib/api/apiClient";

// Configure unified API for payments
const paymentsApi = createResourceApi<TPayment>({
    key: "payments",
    url: "/payments",
});



/* React Query hooks for UI components */
export const useGetPayments = (params?: TQueryParam[] | TObj, options?: QO<TPayment[]>) => {
    return paymentsApi.useGetAll(params, options);
};

export const useGetPayment = (id?: string, options?: QO<TPayment>) =>
    paymentsApi.useGetById(id, options);

export const useCreatePayment = (
    options?: MO<TPayment>
) => paymentsApi.useCreateMutation(options);

export const useUpdatePayment = (
    options?: MO<TPayment>
) => paymentsApi.useUpdateMutation(options);

export const useDeletePayment = (options?: MO<unknown>) =>
    paymentsApi.useDeleteMutation(options);

// Get payments for a specific user
export const useGetUserPayments = (userId?: string, options?: QO<TPayment[]>) => {
    return paymentsApi.useGetAll(
        { userId, sortBy: "createdAt", sortOrder: "desc" },
        options && {
            ...options,
            enabled: !!userId && (options?.enabled !== false),
        }
    );
};

// Process payment
export const useProcessPayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: PaymentCreateInput) => {
            const response = await apiClient.post(`/payments/process`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// Verify payment
export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { paymentId: string; transactionId: string }) => {
            const response = await apiClient.post(`/payments/${data.paymentId}/verify`, {
                transactionId: data.transactionId
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// Refund payment
export const useRefundPayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { paymentId: string; reason?: string }) => {
            const response = await apiClient.post(`/payments/${data.paymentId}/refund`, {
                reason: data.reason
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};

// Get payment statistics
export const useGetPaymentStats = (params?: { userId?: string; dateFrom?: string; dateTo?: string }) => {
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.get(`/payments/stats`, { params });
            return response.data;
        },
    });
};

// Direct API methods (for use outside React components)
export const getPayments = paymentsApi.getAll;
export const getPayment = paymentsApi.getById;
export const createPayment = paymentsApi.createOne;
export const updatePayment = paymentsApi.updateOne;
export const deletePayment = paymentsApi.deleteOne;