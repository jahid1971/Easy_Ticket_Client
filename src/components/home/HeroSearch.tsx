"use client";
import { useState } from "react";
import Image from "next/image";
import { Ship, Hotel, Bus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { C_Input } from "@/components/ui/C_Input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type Mode = "bus" | "ship" | "hotel";

const trending = [
    "Dhaka",
    "Rajshahi",
    "Chattogram",
    "Cox's Bazar",
    "Rangamati",
    "Sylhet",
];

export function HeroSearch() {
    const [mode, setMode] = useState<Mode>("bus");

    return (
        <section className="relative isolate overflow-hidden py-8 sm:py-12 lg:py-20">
            {/* Normal image for small/medium screens */}
            <Image
                src="/Hero_background_image.png"
                alt="cover"
                width={1920}
                height={1080}
                className="object-cover filter block lg:hidden w-full"
            />

            {/* Background image + overlays for large screens */}
            <div className="absolute inset-0 -z-10 hidden lg:block">
                <Image
                    src="/Hero_background_image.png"
                    alt="cover"
                    fill
                    className="object-cover filter brightness-95 saturate-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/25"></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.06)_0%,_rgba(0,0,0,0.35)_100%)]"></div>
            </div>

            <div className="mx-auto max-w-6xl px-4 ">
                <div className="flex justify-center mb-4">
                    <Tabs
                        defaultValue="bus"
                        onValueChange={(v) => setMode(v as Mode)}
                    >
                        <div className="flex justify-center">
                            <TabsList className="absolute left-1/2 -translate-1/2 lg:static lg:left-0 lg:-translate-0  w-fit bg-transparent lg:bg-white/60   rounded-b-none px-2 py-1  ">
                                <TabsTrigger value="bus" className="px-4 bg-background lg:bg-transparent ">
                                    <span className="inline-flex items-center gap-2">
                                        <Bus className="size-4" />
                                        Bus
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger value="ship" className="px-4 bg-background lg:bg-transparent mx-2">
                                    <span className="inline-flex items-center gap-2">
                                        <Ship className="size-4" />
                                        Ship
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger value="hotel" className="px-4  bg-background lg:bg-transparent">
                                    <span className="inline-flex items-center gap-2">
                                        <Hotel className="size-4" />
                                        Hotel
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Card container */}
                        <div className="mt-10 lg:mt-0 mx-auto w-full max-w-5xl rounded-xl border lg:border-0 border-gray-200/40 bg-white/60 p-4 sm:p-6 shadow-lg ">
                            <TabsContent value="bus" className="mt-4 ">
                                <SearchForm mode={mode} />
                            </TabsContent>
                            <TabsContent value="ship" className="mt-4">
                                <SearchForm mode={mode} disabled />
                            </TabsContent>
                            <TabsContent value="hotel" className="mt-4">
                                <SearchForm mode={mode} disabled />
                            </TabsContent>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground/80">
                                    Trending Searches:
                                </span>
                                {trending.map((t) => (
                                    <button
                                        key={t}
                                        className="rounded-full border px-3 py-1 hover:bg-muted bg-white/50"
                                        type="button"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    form="hero-search-form"
                                    className="h-12 text-base block mx-auto w-full sm:w-1/2 md:w-1/3 lg:w-1/6 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                                >
                                    <span>
                                        Search{" "}
                                        {mode.charAt(0).toUpperCase() +
                                            mode.slice(1)}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

type SearchFormValues = {
    from: string;
    to: string;
    journeyDate: string;
    returnDate?: string;
};

function SearchForm({ mode, disabled }: { mode: Mode; disabled?: boolean }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>();
    const onSubmit = (data: SearchFormValues) => {
        // TODO: hook into router/search
    };

    return (
        <form id="hero-search-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <C_Input
                    id="from"
                    label="Going From"
                    placeholder="City or terminal"
                    control={control}
                    error={errors.from?.message}
                    disabled={disabled}
                    required
                />
                <C_Input
                    id="to"
                    label="Going To"
                    placeholder="City or terminal"
                    control={control}
                    error={errors.to?.message}
                    disabled={disabled}
                    required
                />
                <C_Input
                    id="journeyDate"
                    label="Journey Date"
                    type="date"
                    control={control}
                    error={errors.journeyDate?.message}
                    disabled={disabled}
                    required
                />
                {/* <C_Input
                    id="returnDate"
                    label="Return Date"
                    type="date"
                    control={control}
                    error={errors.returnDate?.message}
                    disabled={disabled}
                /> */}
            </div>
        </form>
    );
}
