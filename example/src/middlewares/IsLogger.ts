import { createMiddleware } from "lightyjs";

export const IsLogger = createMiddleware((req, res, next) => {
    console.log(req.path);

    return next();
});
