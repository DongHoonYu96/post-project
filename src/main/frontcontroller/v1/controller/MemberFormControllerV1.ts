import {ControllerV1} from "../ControllerV1";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import * as path from "path";

export class MemberFormControllerV1 implements ControllerV1{

    public async process(req : Request , res : Response) : Promise<void>{
        const viewPath : string = path.join(process.cwd(), 'dist','views','new-form.html');
        await res.forward(req,res,viewPath);
    }

}