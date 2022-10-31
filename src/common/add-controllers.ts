import express, { NextFunction, Request, Response } from "express";
import { MetadataKey } from "src/enums";
import { extractParameters } from "src/utils/extract-parameters.util";
import { MiddlewareMap, RouterItem } from "../decorators";
import { ParamsInfoMap } from "../decorators/params.decorator";

export function addControllers(app: express.Application, controllers: any[]) {
    controllers.forEach((controllerClass) => {
        const controllerInstance: { [handleName: string]: any } = new controllerClass() as any;

        const basePath: string = Reflect.getMetadata(MetadataKey.CONTROLLER_BASE_PATH, controllerClass);
        const routers: RouterItem[] = Reflect.getMetadata(MetadataKey.ROUTER, controllerClass) ?? [];
        const middlewareMap: MiddlewareMap = Reflect.getMetadata(MetadataKey.MIDDLEWARE, controllerClass) ?? {};
        const paramMap: ParamsInfoMap = Reflect.getMetadata(MetadataKey.PARAM, controllerClass) ?? {};

        const exRouter = express.Router();

        routers.forEach(({ method, path, handlerName }) => {
            const parameters = paramMap[String(handlerName)] ?? [];

            const routerHandler = async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const args = parameters.length === 0 ? [req, res] : await extractParameters(req, res, parameters);
                    const handler = controllerInstance[String(handlerName)].apply(controllerInstance, args);

                    let result: object = {};

                    if (handler instanceof Promise) {
                        result = await handler;
                    }

                    if (!res.headersSent) {
                        if (typeof result === "object") {
                            return res.json(result);
                        } else {
                            return res.send(result);
                        }
                    }
                } catch (err) {
                    return next(err);
                }
            };

            exRouter[method](basePath + path, ...(middlewareMap[String(handlerName)] || []), routerHandler);
        });

        app.use(exRouter);
    });
}
