"use strict";

import express from "express";
import * as dotenv from "dotenv";
import users from "./routes/usersRoute";
import crypto from "crypto";


dotenv.config();
const port = process.env.URL_PORT ? process.env.URL_PORT : 8080;

const app = express();

app.use((req, res, next) =>  {
    if(req.headers.accept !== "application/json") {
        res.statusCode = 406;
        res.send();
        return;
    }

    const customAuth = req.headers["custom-auth"];

    if (!customAuth || Array.isArray(customAuth)) {
        res.statusCode = 401;
        res.send();
        return;
    }

    const split = customAuth.split(':');
    const timestamp = Number.parseInt(split[0], 10);
    const hash = split[1];

    const serverTimestamp = Date.now();

    if ((serverTimestamp - timestamp)/1000 > 5) {
        res.statusCode = 401;
        res.send();
        return;
    }

    const calculated = crypto.createHash('sha256').update(timestamp + process.env.SECRET).digest('hex');

    if (hash !== calculated) {
        res.statusCode = 401;
        res.send();
        return;
    }

    next();
});

// define a route handler for the default home page
app.get( "/", ( _req, _res ) => {
    _res.send({ msg: "Hello TopView!" });
});

// add route handler for /users routes
app.use("/users", users);

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

export default app;