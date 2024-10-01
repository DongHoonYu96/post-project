import {Request} from "../../was/request";
import {Response} from "../../was/response";

export interface ControllerV1 {

    process(req : Request , res : Response) : void
}