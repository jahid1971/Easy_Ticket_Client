"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

 function Navbar() {
	const [open, setOpen] = React.useState(false); // reserved for future mobile menu

	return (
		<header className="w-full bg-background/80 backdrop-blur border-b border-border">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
				{/* Left: Logo */}
				<div className="flex items-center gap-3">
					<Link href="/" aria-label="Go to homepage" className="shrink-0">
						<Logo width={150} />
					</Link>
				</div>

				{/* Center: Navigation */}
				<nav aria-label="Primary" className="hidden md:flex items-center gap-5">
					<Link href="/bus" className="text-foreground/80 hover:text-primary transition-colors">Bus</Link>
					<Link href="/ship" className="text-foreground/80 hover:text-primary transition-colors">Ship</Link>
					<Link href="/hotel" className="text-foreground/80 hover:text-primary transition-colors">Hotel</Link>
					<Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">About</Link>
					<Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</Link>
				</nav>

				{/* Right: Theme toggle and Auth actions */}
				<div className="hidden md:flex items-center gap-3">
					<ThemeToggle />
					<Button asChild variant="outline">
						<Link href="/login" aria-label="Login">Login</Link>
					</Button>
					<Button asChild>
						<Link href="/register" aria-label="Register">Register</Link>
					</Button>
				</div>

				{/* Mobile: theme toggle and menu toggle */}
				<div className="md:hidden flex items-center gap-2">
					<ThemeToggle />
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-foreground hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Toggle menu"
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						<Menu className="size-5" />
					</button>
				</div>
			</div>
		</header>
	);
}

export default Navbar;

