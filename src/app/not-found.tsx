
const Not-found = () => {
  return (
    <div>
         Not-found
    </div>
  );
};

export default Not-found;import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center gap-6 p-8 rounded-xl shadow-lg bg-card">
                <AlertTriangle className="text-destructive" size={48} />
                <h1 className="text-3xl font-bold text-destructive">404 - Page Not Found</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <Button asChild variant="default">
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;