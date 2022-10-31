import { NextFunction, Request, Response } from "express";
import { MetadataKey } from "../enums";

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;
export type MiddlewareMap = Record<string | symbol, MiddlewareFunction[]>;

/**
 * Decorator factory to create a custom decorator using a middleware
 * @param middleware
 * @returns
 */
const createMiddleware = (middleware: MiddlewareFunction) => {
    return (): MethodDecorator => {
        return (target, propertyKey) => {
            const controllerClass = target.constructor;

            const middlewareMap = Reflect.getMetadata(MetadataKey.MIDDLEWARE, controllerClass) ?? {};

            if (!middlewareMap[propertyKey]) {
                middlewareMap[propertyKey] = [];
            }

            if (!middlewareMap[propertyKey].includes(middleware)) {
                middlewareMap[propertyKey].unshift(middleware);
            }

            Reflect.defineMetadata(MetadataKey.MIDDLEWARE, middlewareMap, controllerClass);
        };
    };
};

/**
 * Simple Deocrator to add a express middleware
 * @param middleware
 * @returns
 */
const AddMiddleware = (middleware: MiddlewareFunction) => createMiddleware(middleware);

export { createMiddleware, AddMiddleware };
