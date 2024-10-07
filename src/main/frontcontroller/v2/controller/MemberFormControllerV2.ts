import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import * as path from "path";
import {ControllerV2} from "../ControllerV2";
import {MyView} from "../../MyView";

export class MemberFormControllerV2 implements ControllerV2{

    public process(req : Request , res : Response) : MyView{
        const viewPath : string = path.join(process.cwd(), 'dist','views','new-form.html');
        return new MyView(viewPath);
    }

    version2() {
    }
}