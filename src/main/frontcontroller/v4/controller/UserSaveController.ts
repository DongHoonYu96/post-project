import {Member} from "../../../domain/member/Member";
import {ControllerV4} from "../ControllerV4";
import {MemberRepository} from "../../../domain/member/MemberRepository";
import {REDIRECT_ERROR} from "../../../was/const/httpConsts";
import * as bcrypt from 'bcryptjs'

export class UserSaveController implements ControllerV4{

    private memberRepository: MemberRepository;

    constructor() {
        this.memberRepository = MemberRepository.getInstance();
    }

    async process(paramMap: Map<string, string>, model: Map<string, object>) {
        const email: string = paramMap.get('email');
        const nickname: string = paramMap.get('nickname');
        const password: string = paramMap.get('password');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const member = new Member(email, nickname , hashedPassword);
        try{
            await this.memberRepository.save(member);
            return `redirect:/user/login-ok?email=${email}&nickname=${nickname}`;
        }
        catch(e){
            return REDIRECT_ERROR.REDIRECT_URL;
        }
    }
}