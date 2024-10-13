import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";
import {PostRepository} from "../../../domain/post/PostRepository";
import {RedisClient} from "../../../repositories/RedisClient";
import {PaginationService} from "../../../domain/common/PaginationService";
import {BasePaginatePostDto} from "../../../domain/common/dto/BasePaginatePostDto";

export class HomeControllerV6 implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();
    private postRepository  = PostRepository.getInstance().getRepo();
    private paginationService =PaginationService.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const findCookieVal = this.sessionMgr.findCookie(req, this.sessionMgr.SESSION_COOKIE_NAME);
        const findMember = this.sessionMgr.findMemberByCookieVal(findCookieVal);

        // await this.redisClient.connect();

        const data = await this.paginationService.paginate(
            new BasePaginatePostDto(1, 1,
                undefined, 'ASC', 10),
            this.postRepository,
            {
                relations:{
                    member: true,
                }
            },
            'post',
        );

        const posts = data.data;
        model.set("posts",posts);
        model.set("data", data);

        /**
         * 로그인이 된경우, 동적 렌더링 필요
         */
        if (findMember) {
            model.set("member", findMember);
            return "index";
        } else {
            return "index";
        }
    }


    version6() {
    }

    sayHello() {
        //say hello
    }
}