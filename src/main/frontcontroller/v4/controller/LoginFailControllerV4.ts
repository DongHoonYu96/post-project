import {ControllerV4} from "../ControllerV4";

export class LoginFailControllerV4 implements ControllerV4{

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        return "user/login-failed";
    }
}