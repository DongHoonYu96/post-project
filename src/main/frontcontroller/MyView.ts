import {Response} from "../was/response";
import {Request} from "../was/request";

export class MyView {
    private readonly viewPath : string;

    constructor(viewPath : string) {
        this.viewPath = viewPath;
    }

    public async render(req : Request, res : Response) : Promise<void> {
        await res.forward(req,res,this.viewPath);
    }
}