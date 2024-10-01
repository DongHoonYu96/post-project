import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {ControllerV2} from "./ControllerV2";
import {MemberFormControllerV2} from "./controller/MemberFormControllerV2";
import {MemberListControllerV2} from "./controller/MemberListControllerV2";


export class FrontControllerServletV2 {

    private readonly urlPatterns:string;
    private controllerMap : Map<String,ControllerV2> = new Map<String, ControllerV2>

    constructor() {
        this.urlPatterns = "/front-controller/v2/";
        this.controllerMap.set(this.urlPatterns+"members/new-form", new MemberFormControllerV2());
        this.controllerMap.set(this.urlPatterns+"members", new MemberListControllerV2());
    }

    public service(req : Request, res : Response){
        const reqURI : string = req.path;
        if(!this.controllerMap.has(reqURI)){
            res.status(404).send();
            return;
        }

        const controller : ControllerV2= this.controllerMap.get(reqURI);
        const view = controller.process(req,res);
        view.render(req,res);
    }
}