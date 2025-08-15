class AppError extends Error {
    public status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = this.constructor.name; // Sets the error name to the class name
        this.status = status; // Sets the custom status
    }
}

export default AppError;
