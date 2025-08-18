"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { C_Input } from "@/components/ui/C_Input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "@/Apis";
import { tryCatch } from "@/utils/tryCatch";

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
 
        tryCatch(
            () => loginUser(data),
            "Logging in",
            "Logged in successfully",
            () => router.push("/")
        );
    }

    function handleGoogleLogin() {
        // redirect to server OAuth endpoint; include redirect back to current page if needed
        const redirect =
            typeof window !== "undefined" ? window.location.pathname : "";
        const base = "/api/v1/auth/google";
        const url = redirect
            ? `${base}?redirect=${encodeURIComponent(redirect)}`
            : base;
        window.location.href = url;
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
                                error={errors.email?.message}
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
                                error={errors.password?.message}
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

                    <div className="mt-4">
                        <Button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full inline-flex items-center justify-center gap-2"
                            variant="outline"
                        >
                            <FcGoogle className="w-5 h-5" />
                            Continue with Google
                        </Button>
                    </div>

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
