import {ControllerV3} from "../ControllerV3";
import {ModelView} from "../../ModelView";

interface Member {
    id: number;
    loginId: string;
    name: string;
}

export class MemberListControllerV3 implements ControllerV3{
    process(paramMap: Map<String, Object>): ModelView {
        //todo : repository에서 member 모두 찾아서 넣기
        const members: Member[] =  [
            { id: 1, loginId: 'user1', name: '홍길동' },
            { id: 2, loginId: 'user2', name: '김철수' },
            { id: 3, loginId: 'nvda', name: '젠슨황' }
        ];
        const mv : ModelView = new ModelView("members");
        mv.getModel().set("members",members);

        return mv;
    }
}