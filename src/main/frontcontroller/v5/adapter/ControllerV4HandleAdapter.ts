import {MyHandlerAdapter} from "../MyHandlerAdapter";
import {Response} from "../../../was/response";
import {Request} from "../../../was/request";
import {ControllerV3} from "../../v3/ControllerV3";
import {ModelView} from "../../ModelView";
import {objectToMap} from "../../../utils/utils";
import {ControllerV4} from "../../v4/ControllerV4";
import {MyView} from "../../MyView";

export class ControllerV4HandleAdapter implements MyHandlerAdapter {

    /**
     * Controller V4의 구현체인지 확인v
     * @param handler
     */
    supports(handler : any): boolean {
        return (
            handler !== null &&
            "process" in handler &&
            typeof (handler as ControllerV4).process === "function" &&
            (handler as ControllerV4).process.length === 2
        );
    }

    handle(req: Request, res: Response , handler : any): ModelView {
        const controller  = handler as ControllerV4;

        //컨트롤러가 req를 몰라도 되도록 Map에 req 정보를 담아서 넘김
        const paramMap : Map<string, string> = objectToMap(req.body);
        const model : Map<string, object> = new Map<string, object>();

        const viewName = controller.process(paramMap, model);

        const mv = new ModelView(viewName);
        mv.setModel(model); //set도 해줘야함!

        return mv;
    }

}