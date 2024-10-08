import {ModelView} from "../ModelView";
import {Response} from "../../was/response";
import {Request} from "../../was/request";

export abstract class MyHandlerAdapter {
    abstract supports(handler : any): boolean;

    abstract handle(req : Request, res : Response, handler : any)
}