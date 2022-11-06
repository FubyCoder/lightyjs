# lightyjs

A decorator based expressjs utility library

This library provide a simple interface to class-transformer and class-validator with a decorator based system like nestjs

This also adds support for async routes and the responses from the routers can be provided with a simple return statement

# How to install

```
yarn add reflect-metadata class-transformer class-validator lightyjs
```

# How to use

## Configuration

This library uses the experimental decorator feature provided by typescript add the following, to your typescript configuration

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

## Create a controller

```typescript
// example.ts
import { Controller, Post } from "lightyjs";

@Controller("/example")
class ExampleController {
    @Post("/hello")
    async HelloWorld() {
        // this will call res.json() under the hood
        return { message: "Hello World" };
    }
}
```

```
POST /example/hello => { message: "Hello World" }
```

# Add the controllers to your app

```typescript
// index.ts
import express from "express";
import { addController } from "lightyjs";
import ExampleController from "./example";

const app = express();
addControllers(app, [ExampleController]);
```

# Middlewares

Its possible to create custom middlewares in decorator form

It uses the same syntax as a classic expressjs middleware

```typescript
import { Request, Response, NextFunction } from "express";
import { createMiddleware } from "lightyjs";

const CustomDecorator = createMiddleware((req: Request, res: Response, next: NextFunction) => {
    // Your middleware function

    return next(); // This must be called when the middleware passes
});

const CustomAsyncDecorator = createMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Your middleware function

    return next(); // This must be called when the middleware passes
});
```

## How to use custom decorators/middlewares

The order of execution of the middleware is based on the order of the declaration (pretty standard)

```typescript
// example2.ts
@Controller("/example/v2")
class Example2Controller {
    @Get("/test")
    @CustomDecorator() // This will be called first
    @CustomAsyncDecorator() // This will be called second
    async Test() {}
}
```

# Parameters decorators

This library provides a simple way to get possible parameters and values from the request using decorators

This is the list of possible decorators :

-   @Body - **Equivalent to req.body**
-   @Params - **Equivalent to req.params**
-   @Query - **Equivalent to req.query**
-   @Headers - **Equivalent to req.headers**
-   @Request - **Equivalent to req**
-   @Response - **Equivalent to res**

```typescript
// example2.ts
@Controller("/example/v3")
class Example2Controller {
    @Post("/test")
    async Test(@Body() body: any) {}
}
```

It's possible to create DataTransferObjects (DTOs) in combination with this parameter decorators to perform validation and cleanup of the data

# Create a DTO

Using the library `class-validator` is possible to create a dto using a simple class

Check the repo [class-validator](https://github.com/typestack/class-validator) for the usage of this package

```typescript
// test.dto.ts
const {IsString , IsNotEmpty} from "class-validator"

export class TestDTO{
    @IsString()
    @IsNotEmpty()
    text : string

}
```

# Using Dto with parameters decorator

Getting back to the previous example is possible to integrate a dto simply by importing the class **not the type** and passing it as a typescript type

```typescript
// example2.ts

import TestDTO from "./test.dto";

@Controller("/example/v3")
class Example2Controller {
    @Post("/test")
    async Test(@Body() body: TestDTO) {}
}
```

This will use hunder the hood `class-transformer` library and will perform the validation of the data

In this first release is **not possible** to customize the error handling process of the validation, the error thrown is a ValidationFailed that can be handled with an express global error handler
