import "reflect-metadata";

import { MetadataKey } from "../enums";

const Controller = (basePath: string): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(MetadataKey.CONTROLLER_BASE_PATH, basePath, target);
    };
};

export { Controller };
