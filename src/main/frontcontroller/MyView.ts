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

    /**
     * jsp는 req에 속성들 set해줘야 그걸 참조해서 html을 동적으로만듬
     * ejs는 ejs.render에 객체를 넘겨주는것만으로 작동하는걸로 추측.
     */
    public async renderEjs(model: Map<string, Object>, req : Request, res : Response) : Promise<void> {
        const pageData = this.mapToObject(model);

        await res.forwardEjs(req,res,this.viewPath, pageData);
    }

    mapToObject(map: Map<string, object>): { [key: string]: object } {
        const obj: { [key: string]: object } = {};

        for (const [key, value] of map) {
            obj[key] = value;
        }

        return obj;
    }

    /**
     * 오버로딩 미지원 -> 검사...
     */

}