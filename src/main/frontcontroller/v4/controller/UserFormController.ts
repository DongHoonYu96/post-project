import {ControllerV4} from "../ControllerV4";

export class UserFormController implements ControllerV4{

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        return "new-form";
    }
}