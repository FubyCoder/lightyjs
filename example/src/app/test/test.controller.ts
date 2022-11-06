import { Controller, Get, Params } from "lightyjs";
import { IsLogger } from "../../middlewares/IsLogger";

@Controller("/test")
export default class ExampleController {
    @Get("/hello")
    @IsLogger()
    async HelloWorld() {
        // this will call res.json() under the hood
        return { message: "Hello World" };
    }
}
