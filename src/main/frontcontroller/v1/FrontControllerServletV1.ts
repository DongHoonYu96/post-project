import {ControllerV1} from "./ControllerV1";
import {MemberFormControllerV1} from "./controller/MemberFormControllerV1";
import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {MemberListControllerV1} from "./controller/MemberListControllerV1";

export class FrontControllerServletV1 {

    private readonly urlPatterns:string;
    private controllerMap : Map<String,ControllerV1> = new Map<String, ControllerV1>

    constructor() {
        this.urlPatterns = "/front-controller/v1/";
        this.controllerMap.set(this.urlPatterns+"members/new-form", new MemberFormControllerV1());
        this.controllerMap.set(this.urlPatterns+"members", new MemberListControllerV1());
    }

    public service(req : Request, res : Response){
        const reqURI : string = req.path;
        if(!this.controllerMap.has(reqURI)){
            res.status(404).send();
            return;
        }

        const controller : ControllerV1= this.controllerMap.get(reqURI);
        controller.process(req,res);
    }

}