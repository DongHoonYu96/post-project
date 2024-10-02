import {ControllerV3} from "../ControllerV3";
import {ModelView} from "../../ModelView";

export class MemberFormControllerV3 implements ControllerV3{

    process(paramMap: Map<string, string>): ModelView {
        return new ModelView("new-form");
    }
}