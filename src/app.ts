"use strict";

import express from "express";
import * as dotenv from "dotenv";
import users from "./routes/users";
import crypto from "crypto";
import logger from "winston";


dotenv.config();
const port = process.env.URL_PORT ? process.env.URL_PORT : 8080;

const app = express();

app.use((req, res, next) =>  {
    if(!process.env.SECRET) {
        throw new Error("SECRET is missing from .env config file");
    }

    const customAuth = req.headers["custom-auth"];

    if (!customAuth || Array.isArray(customAuth)) {
        res.statusCode = 401;
        res.statusMessage = "Unauthorized";
        res.send();
        return;
    }

    const split = customAuth.split(':');
    const timestamp = split[0];
    const hash = split[1];


    const calculated = crypto.createHash('sha256').update(timestamp + process.env.SECRET).digest('hex');
    logger.debug(calculated);

    if (hash !== calculated) {
        res.statusCode = 401;
        res.send();
        return;
    }

    next();
});

app.get( "/", ( _req, _res ) => {
    _res.send( "Hello TopView!" );
});

app.use("/users", users);


// define a route handler for the default home page


// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );