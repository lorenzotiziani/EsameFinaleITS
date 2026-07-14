import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            }) as { body?: unknown };

            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }

            next();
        } catch (error) {
            next(error);
        }
    };