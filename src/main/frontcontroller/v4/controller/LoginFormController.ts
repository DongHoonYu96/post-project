import {ControllerV4} from "../ControllerV4";

export class LoginFormController implements ControllerV4{

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        return "login-form";
    }
}