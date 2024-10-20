import {Response} from "../../was/response";
import {Request} from "../../was/request";
import {MyView} from "../MyView";
import * as path from "path";
import {MyHandlerAdapter} from "./MyHandlerAdapter";
import {MemberFormControllerV3} from "../v3/controller/MemberFormControllerV3";
import {MemberListControllerV3} from "../v3/controller/MemberListControllerV3";
import {ControllerV3HandleAdapter} from "./adapter/ControllerV3HandleAdapter";
import {MemberSaveControllerV3} from "../v3/controller/MemberSaveControllerV3";
import {MemberFormControllerV4} from "../v4/controller/MemberFormControllerV4";
import {MemberSaveControllerV4} from "../v4/controller/MemberSaveControllerV4";
import {MemberListControllerV4} from "../v4/controller/MemberListControllerV4";
import {ControllerV4HandleAdapter} from "./adapter/ControllerV4HandleAdapter";
import {HomeController} from "../v4/controller/HomeController";
import {UserFormController} from "../v4/controller/UserFormController";
import {UserSaveController} from "../v4/controller/UserSaveController";
import {ControllerV6HandleAdapter} from "./adapter/ControllerV6HandleAdapter";
import {LoginControllerV6} from "../v6/controller/LoginControllerV6";
import {LoginFailControllerV4} from "../v4/controller/LoginFailControllerV4";
import {LoginFormController} from "../v4/controller/LoginFormController";
import {UserListControllerV4} from "../v4/controller/UserListControllerV4";
import {HomeControllerV6} from "../v6/controller/HomeControllerV6";
import {LoginFormControllerV6} from "../v6/controller/LoginFormControllerV6";
import {UserSaveAfterControllerV6} from "../v6/controller/UserSaveAfterControllerV6";
import {LogOutControllerV6} from "../v6/controller/LogOutControllerV6";
import {PostFormControllerV4} from "../v4/controller/PostFormControllerV4";
import {PostSaveControllerV6} from "../v6/controller/PostSaveControllerV6";
import {PostDetailControllerV6} from "../v6/controller/PostDetailControllerV6";
import {CommentSaveControllerV6} from "../v6/controller/CommentSaveControllerV6";
import {PostSaveRandomControllerV6} from "../v6/controller/PostSaveRandomControllerV6";
import {GetAllPostControllerV6} from "../v6/controller/GetAllPostControllerV6";
import {UserListControllerV6} from "../v6/controller/UserListControllerV6";
import {GitAuthController} from "../../domain/auth/GitAuthController";
import {GitAuthCallbackController} from "../../domain/auth/GitAuthCallbackController";
import {UploadImageController} from "../../domain/post/UploadImageController";


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
    private handlerMappingMap : Map<string,any> = new Map<string, any>; //모든타입(any)의 핸들러(컨트롤러)지원
    private handlerAdapters : MyHandlerAdapter[]= []; // 핸들러 어댑터들 저장. 핸들러 어댑터 목록

    constructor() {
        this.initMemberController();

        this.handlerMappingMap.set("/", new HomeControllerV6());
        this.handlerMappingMap.set("/index", new HomeControllerV6());
        this.handlerMappingMap.set("/index.html", new HomeControllerV6());

        this.initUserController();

        this.handlerMappingMap.set("/post", new GetAllPostControllerV6());
        this.handlerMappingMap.set("/post/form", new PostFormControllerV4());
        this.handlerMappingMap.set("/post/save", new PostSaveControllerV6());
        // this.handlerMappingMap.set("/post/save/random", new PostSaveRandomControllerV6()); //test용 라우터
        this.handlerMappingMap.set("/post/:id", new PostDetailControllerV6());

        this.handlerMappingMap.set("/comment/save", new CommentSaveControllerV6());

        this.handlerMappingMap.set("/auth/github", new GitAuthController());
        this.handlerMappingMap.set("/auth/github/callback", new GitAuthCallbackController());

        this.handlerMappingMap.set("/upload-image", new UploadImageController());

        this.initAdapters();
    }

    private initAdapters() {
        this.handlerAdapters.push(new ControllerV3HandleAdapter());
        this.handlerAdapters.push(new ControllerV4HandleAdapter());
        this.handlerAdapters.push(new ControllerV6HandleAdapter());
    }

    private initUserController() {
        this.handlerMappingMap.set("/user/form", new UserFormController());
        this.handlerMappingMap.set("/user/save", new UserSaveController());

        this.handlerMappingMap.set("/user/login/form", new LoginFormControllerV6());
        this.handlerMappingMap.set("/user/login", new LoginControllerV6());
        this.handlerMappingMap.set("/user/login-failed", new LoginFailControllerV4());
        this.handlerMappingMap.set("/user/login-ok", new UserSaveAfterControllerV6());

        this.handlerMappingMap.set("/user/list", new UserListControllerV6());
        this.handlerMappingMap.set("/user/logout", new LogOutControllerV6());
    }

    private initMemberController() {
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members/save", new MemberSaveControllerV3());
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members/new-form", new MemberFormControllerV3());
        this.handlerMappingMap.set("/front-controller/v5/v3/" + "members", new MemberListControllerV3());

        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members/save", new MemberSaveControllerV4());
        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members/new-form", new MemberFormControllerV4());
        this.handlerMappingMap.set("/front-controller/v5/v4/" + "members", new MemberListControllerV4());
    }

    public async service(req : Request, res : Response){
        /**
         * 일단 any로 가져온다. (어떤 컨트롤러가 올지모름)
         */
        const reqURI = req.path;
        const handler : any = this.findHandler(reqURI);
        if(!handler){
            const view = this.viewResolver("error404");
            view.renderEjs(new Map(),req,res);
            return;
        }

        const adapter = this.getHandlerAdapter(handler);
        const mv = await adapter.handle(req,res,handler);
        if(req.isEnd) return; //github redirect인경우, 진행안함.

        /**
         * Controller에서 redirect:index 요청시
         * res.302
         * res. Location = index.html
         */
        let viewName = mv.getViewName();
        let view = this.viewResolver(viewName); //물리이름이 들어간 MyView 객체 만들기

        /**
         * redirect 처리위한 로직
         */
        if(viewName.startsWith("redirect:")){
            const [_, temp ] = viewName.split(":");
            viewName = temp;
            view = this.viewResolver(viewName);
            // res.status(302).header("Location","http://localhost:3000/" + viewName);
            res.status(302).redirect(viewName);
            req.isEnd=true;
            return;
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
        const viewPath: string = path.join(process.cwd(), 'src','main', 'views',viewName+'.html');
        const view = new MyView(viewPath);
        return view;
    }

    /**
     * 정확히 매핑됨 -> 그 컨트롤러 호출
     * 정확한 매핑이없음 -> 패턴이 매칭되는게 있는지 탐색
     * @param reqURI
     * @private
     */
    private findHandler(reqURI: string): any {
        // 정확한 매치 먼저 확인
        if (this.handlerMappingMap.has(reqURI)) {
            return this.handlerMappingMap.get(reqURI);
        }

        // 동적 라우트 매칭
        for (const [pattern, handler] of this.handlerMappingMap.entries()) {
            if (this.isPatternMatch(pattern, reqURI)) {
                return handler;
            }
        }

        return null;
    }

    /**
     *
     * @param pattern post/:id
     * @param uri post/1
     * @private
     */
    private isPatternMatch(pattern: string, uri: string): boolean {
        const patternParts = pattern.split('/'); // [ post , :id ]
        const uriParts = uri.split('/'); // [ post, 1 ]

        if (patternParts.length !== uriParts.length) {
            return false;
        }

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                continue; // 동적 부분은 항상 매치
            }
            if (patternParts[i] !== uriParts[i]) { //post, post와 같이 정적 부분이 매칭안되는경우 -> false ( 지금 컨트롤러와 매칭 x )
                return false;
            }
        }

        // 동적부분제외, 정적부분이 모두 매칭되는경우 매칭되는 컨트롤러이다.
        return true;
    }
}