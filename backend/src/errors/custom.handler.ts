import { NextFunction, Request, Response } from "express";
import {
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    InsufficientFundsError,
    ConflictError
} from "./custom.error";

export const customErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customErrors = [
        UnauthorizedError,
        ForbiddenError,
        BadRequestError,
        InsufficientFundsError,
        ConflictError
    ];

    for (const ErrorClass of customErrors) {
        if (err instanceof ErrorClass) {
            return res.status((err as any).statusCode).json({
                success: false,
                error: err.name,
                message: err.message
            });
        }
    }

    next(err);
};