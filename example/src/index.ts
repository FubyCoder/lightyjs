import express from "express";
import { addControllers } from "lightyjs";
import ExampleController from "./app/test/test.controller";

const app = express();
app.use(express.json());
addControllers(app, [ExampleController]);

app.listen(4000, () => console.log("express app started at : http://localhost:4000/"));
