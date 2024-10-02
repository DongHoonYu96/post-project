export class ModelView {
    private viewName : string;
    private model : Map<String, Object>= new Map(); // <논리이름, 실제객체? >

    constructor(viewName : string) {
        this.viewName = viewName;
    }

    public getViewName(){
        return this.viewName;
    }

    public setViewName(viewName : string): void {
        this.viewName = viewName;
    }

    public getModel() : Map<String, Object>{
        return this.model;
    }

    public setModel(model : Map<String, Object>): void{
        this.model = model;
    }

}