// This file should set up the express server as shown in the lecture code

import express from "express";
import session from "express-session";
import configMiddleWares from "./middleware.js";
const app = express();
import configRoutes from "./routes/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1800000 },
  })
);
configMiddleWares(app);
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
