"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { C_Input } from "@/components/ui/C_Input";
import { Button } from "@/components/ui/button";
import authService from "@/Apis/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { baseUrl } from "@/constants/common";

type FormValues = {
    firstName: string;
    lastName?: string;
    email: string;
    mobile: string;
    gender: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const {
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ mode: "onBlur" });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function onSubmit(data: FormValues) {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await authService.registerUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.mobile,
                gender: data.gender,
                password: data.password,
            });

            alert("Registered successfully");
            router.push("/login");
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message || "Registration failed");
        }
    }

    function handleGoogleRegister() {
        //   const redirectPath = searchParams.redirect;
        const redirect =
            typeof window !== "undefined" ? window.location.pathname : "";
        const url = redirect
            ? `${baseUrl}/auth/google?redirect=${encodeURIComponent(redirect)}`
            : `${baseUrl}/auth/google`;
        window.location.href = url;
    }

    const genderValue = watch("gender");

    return (
        <div className="min-h-screen flex items-stretch bg-white ">
            <div className="hidden lg:block lg:w-1/2 relative ">
                <Image
                    src="/loginBus.jpg"
                    alt="Bus on road"
                    fill
                    className="object-cover rounded-r-[200px]"
                    priority
                />
                {/* <div className="absolute inset-0 bg-black/30 rounded-tr-3xl rounded-br-3xl" /> */}
                <div className="absolute left-10 bottom-20 text-white ">
                    <h2 className="text-3xl font-bold">
                        Think Tickets, Think EasyTicket
                    </h2>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-md bg-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Create your account once and enjoy a seamless journey
                        across all EasyTicket services.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div>
                            <C_Input
                                id="firstName"
                                label="First Name"
                                placeholder="Enter first name"
                                control={control}
                                required
                                className="border"
                            />
                        </div>

                        <div>
                            <C_Input
                                id="lastName"
                                label="Last Name"
                                placeholder="Enter last name"
                                control={control}
                                className="border"
                            />
                        </div>

                        <div>
                            <C_Input
                                id="mobile"
                                label="Mobile Number"
                                placeholder="Enter your mobile number"
                                control={control}
                                required
                                className="border"
                            />
                        </div>

                        <div>
                            <C_Input
                                id="email"
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                control={control}
                                required
                                className="border"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2">
                                Gender *
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setValue("gender", "Male")}
                                    className={`px-4 py-2 border rounded-md ${
                                        genderValue === "Male"
                                            ? "bg-green-50 border-green-400"
                                            : "bg-white"
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("gender", "Female")}
                                    className={`px-4 py-2 border rounded-md ${
                                        genderValue === "Female"
                                            ? "bg-green-50 border-green-400"
                                            : "bg-white"
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                            {errors.gender && (
                                <p className="text-sm text-red-600 mt-1">
                                    {(errors.gender as any)?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <C_Input
                                    id="password"
                                    label="Password"
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    control={control}
                                    required
                                    rules={{
                                        minLength: {
                                            value: 6,
                                            message: "Min 6 characters",
                                        },
                                    }}
                                    className="border"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-8 text-sm cursor-pointer"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <C_Input
                                id="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm password"
                                type="password"
                                control={control}
                                required
                                rules={{
                                    validate: (v: string) =>
                                        v === getValues("password") ||
                                        "Passwords do not match",
                                }}
                                className="border"
                            />
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Sign up
                            </Button>
                        </div>
                    </form>

                    <div className="mt-4 md:col-span-2">
                        <Button
                            type="button"
                            onClick={handleGoogleRegister}
                            className="w-full inline-flex items-center justify-center gap-2"
                            variant="outline"
                        >
                            <FcGoogle className="w-5 h-5" />
                            Continue with Google
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-green-600 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
