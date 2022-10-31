import { MetadataKey } from "../enums";
import { ParameterType } from "../enums/parameters.enum";

export type ParamItem = { fieldType: ParameterType; type: any; index: number; key?: string };
export type ParamsInfoMap = Record<string | symbol, ParamItem[]>;

const createParamterDecorator = <T extends ParameterType>(fieldType: T) => {
    return (item?: T extends ParameterType.RESPONSE ? never : string) => {
        return (target: any, methodKey: string, parameterIndex: number) => {
            const controllerClass = target.constructor;

            const paramsInfoMap: ParamsInfoMap = Reflect.hasMetadata(MetadataKey.PARAM, controllerClass)
                ? Reflect.getMetadata(MetadataKey.PARAM, controllerClass)
                : {};

            if (!paramsInfoMap[methodKey]) {
                paramsInfoMap[methodKey] = [];
            }

            const types = Reflect.getMetadata("design:paramtypes", target, methodKey);
            let classType = types[parameterIndex];

            // In this way we can check if the value is not a specified class
            if (!isClass(classType)) {
                classType = undefined;
            }

            paramsInfoMap[methodKey].push({
                index: parameterIndex,
                fieldType: fieldType,
                type: classType,
                key: item,
            });

            Reflect.defineMetadata(MetadataKey.PARAM, paramsInfoMap, controllerClass);
        };
    };
};

export const Body = createParamterDecorator(ParameterType.BODY);
export const Params = createParamterDecorator(ParameterType.PARAMS);
export const Headers = createParamterDecorator(ParameterType.HEADERS);
export const Query = createParamterDecorator(ParameterType.QUERY);
export const Request = createParamterDecorator(ParameterType.REQUEST);
export const Response = createParamterDecorator(ParameterType.RESPONSE);
