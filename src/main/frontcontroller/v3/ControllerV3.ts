import {ModelView} from "../ModelView";

export interface ControllerV3{

    process (paramMap : Map<String, Object>) : ModelView;
}