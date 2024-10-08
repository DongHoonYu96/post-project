import {Member} from "../../../domain/member/Member";
import {MemoryMemberRepository} from "../../../domain/member/MemoryMemberRepository";
import {ControllerV4} from "../ControllerV4";
import {MemberRepository} from "../../../domain/member/MemberRepository";
import {AppDataSource} from "../../../repositories/AppDataSource";

export class MemberSaveControllerV4 implements ControllerV4{

    private memberRepository: MemberRepository;

    constructor() {
        this.memberRepository = MemberRepository.getInstance();
    }

    process(paramMap: Map<string, string>, model: Map<string, object>):string {
        const email: string = paramMap.get('email');
        const nickname: string = paramMap.get('nickname');
        const password: string = paramMap.get('password');

        const member = new Member(email, nickname , password);
        this.memberRepository.save(member);

        model.set("member", member);
        return "save-result";
    }
}