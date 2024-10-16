import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {MyView} from "../MyView";

export interface ControllerV6 {
    process(req : Request , res : Response, paramMap : Map<string, string> , model : Map<string, object>);

    version6(): void;
}