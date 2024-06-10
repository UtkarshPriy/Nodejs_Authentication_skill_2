import express from "express";
import { urlencoded } from "express";





const app = express();

app.use(urlencoded({extended:true}));

export default app;