import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {ControllerV6} from "../ControllerV6";
import {Repository} from "typeorm";
import {Post} from "../../../domain/post/Post";
import {ViewCountManager} from "../../../domain/post/ViewCountManager";
import {REDIRECT_ERROR} from "../../../was/const/httpConsts";

export class PostDetailControllerV6 implements ControllerV6{

    private postRepository = PostRepository.getInstance().getRepo();
    private viewCountManager = ViewCountManager.getInstance();

    constructor() {
    }

    async process(req:Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        // const postId = +paramMap.get('id');
        /**
         * URL에서 id 추출
         * post/1 -> pop = 1
         */
        const postId = +req.path.split('/').pop();

        if(!postId){
            return REDIRECT_ERROR.REDIRECT_URL;
        }

        try{
            const findPost = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['member', 'comments', 'comments.member'],
            });

            //코드위치 : 에러가없이 post 찾아온 이후,
            //redis에 조회수 증가시킴
            await this.viewCountManager.incrementViewCount(postId);

            model.set("post",findPost);
            model.set("member",req.user);
            return "post-detail"
        }
        catch(e){
            return REDIRECT_ERROR.REDIRECT_URL;
        }
    }

    version6() {
    }
}