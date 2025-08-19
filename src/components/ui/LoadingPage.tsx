import React from "react";
import Spinner from "./Spinner";

const LoadingPage = ({ label = "Loading..." }: { label?: string }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10">
            <div className="p-6 rounded-lg shadow-md bg-card">
                <Spinner size={48} label={label} />
            </div>
        </div>
    );
};

export default LoadingPage;
