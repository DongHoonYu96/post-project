import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {SessionManager} from "../../../utils/SessionManager";
import {PostRepository} from "../../../domain/post/PostRepository";
import {RedisClient} from "../../../repositories/RedisClient";
import {PaginationService} from "../../../domain/common/PaginationService";
import {BasePaginatePostDto} from "../../../domain/common/dto/BasePaginatePostDto";
import { performance } from 'perf_hooks';

export class HomeControllerV6 implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();
    private postRepository  = PostRepository.getInstance().getRepo();
    private paginationService =PaginationService.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const findCookieVal = this.sessionMgr.findCookie(req, this.sessionMgr.SESSION_COOKIE_NAME);
        const findMember = this.sessionMgr.findMemberByCookieVal(findCookieVal);

        // await this.redisClient.connect();

        const start = performance.now();

        // const data = await this.paginationService.paginate(
        //     new BasePaginatePostDto(1, undefined,
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
            .take(10)
            .getMany();

        const end = performance.now();
        console.log(`쿼리 실행 시간 get posts 단독: ${end - start} 밀리초`);

        const cnt = await this.postRepository.count();

        const end2 = performance.now();
        console.log(`쿼리 실행 시간 count 포함: ${end2 - start} 밀리초`);

        

        const data = {
            total: cnt,
        }

        const curPage  =  {
            curPage: 1
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

    sayHello() {
        //say hello
    }
}