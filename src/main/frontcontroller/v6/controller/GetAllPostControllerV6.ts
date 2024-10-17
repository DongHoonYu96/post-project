import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";
import {PostRepository} from "../../../domain/post/PostRepository";
import {PaginationService} from "../../../domain/common/PaginationService";
import {BasePaginatePostDto} from "../../../domain/common/dto/BasePaginatePostDto";
import {performance} from "perf_hooks";

export class GetAllPostControllerV6 implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();
    private postRepository  = PostRepository.getInstance().getRepo();
    private paginationService =PaginationService.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const findCookieVal = this.sessionMgr.findCookie(req, this.sessionMgr.SESSION_COOKIE_NAME);
        const findMember = this.sessionMgr.findMemberByCookieVal(findCookieVal);

        const start = performance.now();

        // const data = await this.paginationService.paginate(
        //     new BasePaginatePostDto(+req.query['page'], undefined,
        //         undefined, 'DESC', 10),
        //     this.postRepository,
        //     {
        //         relations:{
        //             member: true,
        //         }
        //     },
        //     'post',
        // );

        const posts = await this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.member", "member")
            // .where("post.createdAt <= :date", { date: new Date() })
            .orderBy("post.createdAt", "DESC")
            .addOrderBy("post.id", "DESC")
            .skip((+req.query['page'] - 1) * 10)
            .take(10)
            .getMany();

        const cnt = await this.postRepository.count();

        const end = performance.now();
        console.log(`쿼리 실행 시간 get posts 단독: ${end - start} 밀리초`);

        const curPage  =  {
            curPage: +req.query['page'],
        }

        const data = {
            total: cnt,
        }

        model.set("posts",posts);
        model.set("data", data);
        model.set("curPage", curPage);

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
}