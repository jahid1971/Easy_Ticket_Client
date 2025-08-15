"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { C_Input } from "@/components/ui/C_Input";
import { Button } from "@/components/ui/button";
import authService from "@/Apis/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
    const router = useRouter();

    async function onSubmit(data: FormValues) {
        try {
            await authService.loginUser(data);
            alert("Logged in");
            router.push("/");
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-stretch bg-white">
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="/loginBus.jpg"
                    alt="Bus on road"
                    fill
                    className="object-cover rounded-r-[200px]"
                    priority
                />
                
                <div className="absolute  bottom-10 left-10 text-white ">
                    <h2 className="text-3xl font-bold">
                        Think Tickets, Think EasyTicket
                    </h2>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-md bg-white">
                    <h1 className="text-2xl font-bold mb-2">Login</h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Sign in to continue to EasyTicket
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <C_Input
                                id="email"
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                control={control}
                                required
                            />
                        </div>

                        <div>
                            <C_Input
                                id="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                                control={control}
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-green-600 underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
