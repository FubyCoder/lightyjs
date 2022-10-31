import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ParamItem } from "../decorators/params.decorator";

import { ParameterType } from "../enums/parameters.enum";

export async function extractParameters(req: ExpressRequest, res: ExpressResponse, paramsConfig: ParamItem[]) {
    const args = [];

    for (const { index, fieldType, key, type } of paramsConfig) {
        switch (fieldType) {
            case ParameterType.REQUEST: {
                args[index] = getParam(req, key);
                break;
            }
            case ParameterType.RESPONSE: {
                args[index] = res;
                break;
            }
            case ParameterType.BODY: {
                args[index] = getParam(req.body, key);
                break;
            }
            case ParameterType.PARAMS: {
                args[index] = getParam(req.params, key);
                break;
            }
            case ParameterType.HEADERS: {
                args[index] = getParam(req.headers, key);
                break;
            }
            case ParameterType.QUERY: {
                args[index] = getParam(req.query, key);
                break;
            }
        }

        if (type) {
            const instance: any = plainToInstance(type, args[index]);
            const errors = await validate(instance, { whitelist: true });
            args[index] = instance;

            if (errors.length > 0) {
                if (process.env.NODE_ENV === "development") {
                    console.log(errors);
                }
                throw new Error("ValidationFailed");
            }
        }
    }

    return args;
}

function getParam(item: any, key: string | undefined) {
    if (!key) {
        return item;
    }

    return item[key];
}
