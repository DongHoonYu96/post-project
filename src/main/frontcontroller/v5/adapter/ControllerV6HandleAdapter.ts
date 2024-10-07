import {MyHandlerAdapter} from "../MyHandlerAdapter";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {ModelView} from "../../ModelView";
import {objectToMap} from "../../../utils/utils";
import {ControllerV6} from "../../v6/ControllerV6";

export class ControllerV6HandleAdapter implements MyHandlerAdapter {
    /**
     * interface에는 instanceof 사용 불가능
     * -> 세부비교 필요
     * @param handler
     */
    supports(handler : any): boolean {
        return (
            handler !== null &&
            "process" in handler &&
            "version6" in handler &&
            typeof (handler as ControllerV6).process === "function" &&
            (handler as ControllerV6).process.length === 4
        );
    }

    handle(req: Request, res: Response , handler : any): ModelView {
        const controller  = handler as ControllerV6;

        //컨트롤러가 req를 몰라도 되도록 Map에 req 정보를 담아서 넘김
        const paramMap : Map<string, string> = objectToMap(req.body);
        const model : Map<string, object> = new Map<string, object>();
        const viewName = controller.process(req, res, paramMap, model);

        const mv = new ModelView(viewName);
        mv.setModel(model); //set도 해줘야함!

        return mv;
    }
}