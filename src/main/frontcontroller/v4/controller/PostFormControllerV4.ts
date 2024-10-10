import {ControllerV4} from "../ControllerV4";

export class PostFormControllerV4 implements ControllerV4{

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        return "post-form";
    }
}