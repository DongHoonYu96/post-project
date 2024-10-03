import {ControllerV4} from "../ControllerV4";

export class HomeController implements ControllerV4{

    process(paramMap: Map<string, string>, model: Map<string, object>): string {
        return "index";
    }
}