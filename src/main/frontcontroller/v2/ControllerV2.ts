import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {MyView} from "../MyView";

export interface ControllerV2 {

    process(req : Request , res : Response) : MyView
}