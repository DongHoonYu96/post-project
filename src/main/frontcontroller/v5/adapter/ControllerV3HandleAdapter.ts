import {MyHandlerAdapter} from "../MyHandlerAdapter";
import {ModelView} from "../../ModelView";
import {ControllerV3} from "../../v3/ControllerV3";
import {objectToMap} from "../../../utils/utils";
import {Response} from "../../../was/response";
import {Request} from "../../../was/request";

export class ControllerV3HandleAdapter implements MyHandlerAdapter {
    /**
     * interface에는 instanceof 사용 불가능
     * -> 세부비교 필요
     * @param handler
     */
    supports(handler : any): boolean {;
        const a = handler !== null
        const b = "process" in handler;
        const c = typeof (handler as ControllerV3).process === "function";
        return (
             handler !== null &&
            "process" in handler &&
            typeof (handler as ControllerV3).process === "function"
        );
    }

    handle(req: Request, res: Response , handler : any): ModelView {
        const controller  = handler as ControllerV3;

        //컨트롤러가 req를 몰라도 되도록 Map에 req 정보를 담아서 넘김
        const paramMap : Map<string, string> = objectToMap(req.body);
        const mv = controller.process(paramMap);

        return mv;
    }
}