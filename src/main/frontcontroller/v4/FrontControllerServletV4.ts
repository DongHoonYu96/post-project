import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {ModelView} from "../ModelView";
import {MyView} from "../MyView";
import * as path from "path";
import {objectToMap} from "../../utils/utils";
import {ControllerV4} from "./ControllerV4";
import {MemberSaveControllerV4} from "./controller/MemberSaveControllerV4";
import {MemberFormControllerV4} from "./controller/MemberFormControllerV4";
import {MemberListControllerV4} from "./controller/MemberListControllerV4";


export class FrontControllerServletV4 {

    private readonly urlPatterns:string;
    private controllerMap : Map<String,ControllerV4> = new Map<String, ControllerV4>

    constructor() {
        this.urlPatterns = "/front-controller/v4/";
        this.controllerMap.set(this.urlPatterns+"members/save", new MemberSaveControllerV4());
        this.controllerMap.set(this.urlPatterns+"members/new-form", new MemberFormControllerV4());
        this.controllerMap.set(this.urlPatterns+"members", new MemberListControllerV4());
    }

    public service(req : Request, res : Response){
        const reqURI : string = req.path;
        if(!this.controllerMap.has(reqURI)){
            res.status(404).send();
            return;
        }

        const controller : ControllerV4= this.controllerMap.get(reqURI);

        //컨트롤러가 req를 몰라도 되도록 Map에 req 정보를 담아서 넘김
        const paramMap : Map<string, string> = objectToMap(req.body); //여기에 body같은것들 다 넘겨야함!
        const model : Map<string, object> = new Map<string, object>();

        const viewName = controller.process(paramMap, model);
        const view: MyView = this.viewResolver(viewName); //물리이름이 들어간 MyView 객체 만들기

        view.renderEjs(model,req,res);
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