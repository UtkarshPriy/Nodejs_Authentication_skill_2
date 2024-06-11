import express from "express";
import { urlencoded } from "express";





const app = express();
app.set('view engine','ejs');

app.use(urlencoded({extended:true}));

export default app;