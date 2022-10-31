import { MetadataKey } from "../enums";
import { Methods } from "../enums/methods.enum";

export interface RouterItem {
    method: Methods;
    path: string;
    handlerName: string | symbol;
}

const createMethodDecorator = (method: Methods) => {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            const controllerClass = target.constructor;

            const routers: RouterItem[] = Reflect.getMetadata(MetadataKey.ROUTER, controllerClass) ?? [];

            routers.push({
                method,
                path,
                handlerName: propertyKey,
            });

            Reflect.defineMetadata(MetadataKey.ROUTER, routers, controllerClass);
        };
    };
};

/**
 * Get Decorator for expressjs
 * @param {string} path - route path
 */
export const Get = createMethodDecorator(Methods.GET);

/**
 * Post Decorator for expressjs
 * @param {string} path - route path
 */
export const Post = createMethodDecorator(Methods.POST);

/**
 * Delete Decorator for expressjs
 * @param {string} path - route path
 */
export const Delete = createMethodDecorator(Methods.DELETE);

/**
 * Patch Decorator for expressjs
 * @param {string} path - route path
 */
export const Patch = createMethodDecorator(Methods.PATCH);

/**
 * Put Decorator for expressjs
 * @param {string} path - route path
 */
export const Put = createMethodDecorator(Methods.PUT);

/**
 * Options Decorator for expressjs
 * @param {string} path - route path
 */
export const Options = createMethodDecorator(Methods.OPTIONS);
