import {ModelView} from "../ModelView";

export interface ControllerV3{

    process (paramMap : Map<string, string>) : ModelView;
}