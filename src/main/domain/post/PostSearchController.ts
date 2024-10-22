import {Request} from "../../was/request";
import {Response} from "../../was/response";
import {ControllerV6} from "../../frontcontroller/v6/ControllerV6";
import {PostRepository} from "../../domain/post/PostRepository";
import {REDIRECT_ERROR} from "../../was/const/httpConsts";
import {SessionManager} from "../../utils/SessionManager";

export class PostSearchController implements ControllerV6{

    private sessionMgr : SessionManager = SessionManager.getInstance();
    private postRepository = PostRepository.getInstance().getRepo();

    async process (req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const title = req.query['title'];
        if(!title){
            return REDIRECT_ERROR.REDIRECT_URL;
        }
        if(!req.query['page']){
            req.query['page'] = "1";
        }

        const findCookieVal = this.sessionMgr.findCookie(req, this.sessionMgr.SESSION_COOKIE_NAME);
        const findMember = this.sessionMgr.findMemberByCookieVal(findCookieVal);

        const queryBuilder  = this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.member", "member")
            .andWhere('post.title LIKE :title', { title: `%${title}%` })
            .orderBy("post.createdAt", "DESC")
            .addOrderBy("post.createdAt", "DESC")
            .skip((+req.query['page'] - 1) * 10)
            .take(10)

        const start = performance.now();
        // 결과 조회
        const [posts, totalCount] = await queryBuilder.getManyAndCount();
        const end = performance.now();
        console.log(`쿼리 실행 시간 get posts 단독: ${end - start} 밀리초`);

        const curPage  =  {
            curPage: +req.query['page'],
        }

        const data = {
            total: totalCount,
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
    version6 () {

    }
}