import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {ControllerV3} from "./ControllerV3";
import {MemberFormControllerV3} from "./controller/MemberFormControllerV3";
import {MemberListControllerV3} from "./controller/MemberListControllerV3";
import {ModelView} from "../ModelView";
import {MyView} from "../MyView";
import * as path from "path";


export class FrontControllerServletV3 {

    private readonly urlPatterns:string;
    private controllerMap : Map<String,ControllerV3> = new Map<String, ControllerV3>

    constructor() {
        this.urlPatterns = "/front-controller/v3/";
        this.controllerMap.set(this.urlPatterns+"members/new-form", new MemberFormControllerV3());
        this.controllerMap.set(this.urlPatterns+"members", new MemberListControllerV3());
    }

    public service(req : Request, res : Response){
        const reqURI : string = req.path;
        if(!this.controllerMap.has(reqURI)){
            res.status(404).send();
            return;
        }

        const controller : ControllerV3= this.controllerMap.get(reqURI);

        //컨트롤러가 req를 몰라도 되도록 Map에 req 정보를 담아서 넘김
        const paramMap : Map<String, String> = req.headers;
        const mv: ModelView = controller.process(paramMap);

        const viewName:string = mv.getViewName(); //논리이름 ex: members
        const view: MyView = this.viewResolver(viewName); //물리이름이 들어간 MyView 객체 만들기

        view.renderEjs(mv.getModel(),req,res);
    }

    /**
     * 논리이름을 (members)
     * 물리이름으로 변환 (~~~/dist/views/members.html)
     * @param viewName
     * @private
     */
    private viewResolver(viewName: string):MyView {
        const viewPath: string = path.join(process.cwd(), 'dist', 'views',viewName+'.html');
        const view = new MyView(viewPath);
        return view;
    }
}