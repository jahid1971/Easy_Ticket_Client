\"use client\";

import React from \"react\";
import { useAsync } from \"@/hooks\";
import { Button } from \"@/components/ui/button\";

/**
 * Example component demonstrating how to use the refactored tryCatch with Context API
 * 
 * This replaces the previous Redux-based implementation
 */
export function ExampleAsyncComponent() {
    const { tryCatch, errorMsg, clearError } = useAsync();

    // Example API call function
    const exampleApiCall = async () => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                const success = Math.random() > 0.5;
                if (success) {
                    resolve({ success: true, data: \"Operation completed successfully\" });
                } else {
                    reject(new Error(\"Something went wrong with the API call\"));
                }
            }, 2000);
        });
    };

    const handleAsyncOperation = async () => {
        await tryCatch(
            exampleApiCall,
            \"Processing your request\", // Loading message
            \"Operation completed successfully!\", // Success message
            () => {
                // Success callback
                console.log(\"Success callback executed\");
            }
        );
    };

    return (
        <div className=\"p-6 space-y-4\">
            <h2 className=\"text-2xl font-bold\">TryCatch with Context API Example</h2>
            
            <div className=\"space-y-2\">
                <Button onClick={handleAsyncOperation}>
                    Test Async Operation
                </Button>
                
                {errorMsg && (
                    <div className=\"p-4 border border-red-300 rounded-md bg-red-50\">
                        <div className=\"flex justify-between items-center\">
                            <p className=\"text-red-800\">Error: {errorMsg}</p>
                            <Button 
                                variant=\"outline\" 
                                size=\"sm\" 
                                onClick={clearError}
                                className=\"text-red-600 border-red-300\"
                            >
                                Clear Error
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className=\"text-sm text-gray-600\">
                <p>This example shows:</p>
                <ul className=\"list-disc list-inside space-y-1\">
                    <li>Using the new <code>useAsync</code> hook</li>
                    <li>Context API for global error state management</li>
                    <li>Automatic toast notifications</li>
                    <li>Error state display and clearing</li>
                </ul>
            </div>
        </div>
    );
}