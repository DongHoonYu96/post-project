import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {ModelView} from "../ModelView";
import {MyView} from "../MyView";
import * as path from "path";
import {objectToMap} from "../../utils/utils";
import {MyHandlerAdapter} from "./MyHandlerAdapter";
import {MemberFormControllerV3} from "../v3/controller/MemberFormControllerV3";
import {MemberListControllerV3} from "../v3/controller/MemberListControllerV3";
import {ControllerV3HandleAdapter} from "./adapter/ControllerV3HandleAdapter";
import {MemberSaveControllerV3} from "../v3/controller/MemberSaveControllerV3";
import {MemberFormControllerV4} from "../v4/controller/MemberFormControllerV4";
import {MemberSaveControllerV4} from "../v4/controller/MemberSaveControllerV4";
import {MemberListControllerV4} from "../v4/controller/MemberListControllerV4";
import {ControllerV4HandleAdapter} from "./adapter/ControllerV4HandleAdapter";
import {ControllerV4} from "../v4/ControllerV4";
import {HomeController} from "../v4/controller/HomeController";
import {UserFormController} from "../v4/controller/UserFormController";
import {UserSaveController} from "../v4/controller/UserSaveController";
import {ControllerV6HandleAdapter} from "./adapter/ControllerV6HandleAdapter";
import {LoginControllerV6} from "../v6/controller/LoginControllerV6";


/**
 * # 회원등록폼 호출 가정 flow
 * request의 url에 맞는 MemberFormControllerV3 반환
 * 어댑터 목록을 완탐 -> 찾음 (V3HandlerAdapter) 반환
 * V3HandlerAdapter.handle 호출, (매개변수로 어댑터 넘김)
 * any type의 MemberFormControllerV3 를 강제형변환
 * MemberFormControllerV3 . process 호출
 * render (new-form)
 */
export class FrontControllerServletV5 {

    private readonly urlPatterns:string;
    private handlerMappingMap : Map<String,any> = new Map<String, any>; //모든타입(any)의 핸들러(컨트롤러)지원
    private handlerAdapters : MyHandlerAdapter[]= []; // 핸들러 어댑터들 저장. 핸들러 어댑터 목록

    constructor() {
        this.initMemberController();

        this.handlerMappingMap.set("/", new HomeController());
        this.handlerMappingMap.set("/index", new HomeController());
        this.handlerMappingMap.set("/index.html", new HomeController());

        this.handlerMappingMap.set("/user/form", new UserFormController());
        this.handlerMappingMap.set("/user/save", new UserSaveController());
        this.handlerMappingMap.set("/login", new LoginControllerV6());


        this.handlerAdapters.push(new ControllerV3HandleAdapter());
        this.handlerAdapters.push(new ControllerV4HandleAdapter());
        this.handlerAdapters.push(new ControllerV6HandleAdapter());
    }

    private initMemberController() {
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members/save", new MemberSaveControllerV3());
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members/new-form", new MemberFormControllerV3());
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members", new MemberListControllerV3());

        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members/save", new MemberSaveControllerV4());
        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members/new-form", new MemberFormControllerV4());
        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members", new MemberListControllerV4());
    }

    public service(req : Request, res : Response){
        /**
         * 일단 any로 가져온다. (어떤 컨트롤러가 올지모름)
         */
        const reqURI : string = req.path;
        const handler : any = this.handlerMappingMap.get(reqURI);
        if(!handler){
            res.status(404).send();
            return;
        }

        const adapter = this.getHandlerAdapter(handler);
        const mv = adapter.handle(req,res,handler);

        /**
         * Controller에서 redirect:index 요청시
         * res.302
         * res.location = index.html
         */
        let viewName = mv.getViewName();
        let view: MyView = this.viewResolver(viewName); //물리이름이 들어간 MyView 객체 만들기

        /**
         * redirect 처리위한 로직
         */
        if(viewName.startsWith("redirect:")){
            const [_, temp ] = viewName.split(":");
            viewName = temp;
            view = this.viewResolver(viewName);
            res.status(302).header("Location","http://localhost:3000/" + viewName);
        }

        view.renderEjs(mv.getModel(),req,res);
    }

    /**
     * 핸들러 어댑터 목록을 완탐하면서
     * 지금 들어온 핸들러가 지원 목록에 있는지 확인 && 구현체인지 확인,
     * 그것 리턴.
     * @param handler
     * @private
     */
    private getHandlerAdapter(handler: any) : MyHandlerAdapter {
        for (const adapter of this.handlerAdapters) {{
            if (adapter.supports(handler)) {
                return adapter;
            }
        }}
        throw new Error("handler adapter를 찾을수 없습니다. handler =" + handler);
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