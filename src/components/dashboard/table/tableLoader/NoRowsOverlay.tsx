export const noRowsOverlayComponent = () => {
    return (
        <div
            role="presentation"
            className="ag-overlay-loading-center flex items-center justify-center py-8"
            style={{ backgroundColor: "transparent" }}
        >
            <div className="text-center">
                <div className="text-muted-foreground text-sm">
                    No Data Found
                </div>
            </div>
        </div>
    );
};