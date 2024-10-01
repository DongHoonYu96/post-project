import {Request} from "../was/request";
import {Response} from "../was/response";
import {randomUUID} from "node:crypto";


export const error404 = (err:Error, req : Request, res: Response, next) => {
    res.status(404);
    res.send("Not Found");
}

