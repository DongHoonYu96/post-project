import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {ControllerV6} from "../ControllerV6";
import {Repository} from "typeorm";
import {Post} from "../../../domain/post/Post";

export class PostDetailControllerV6 implements ControllerV6{

    private postRepository : Repository<Post>;

    constructor() {
        this.postRepository = PostRepository.getInstance().getRepo();
    }

    async process(req:Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        // const postId = +paramMap.get('id');
        /**
         * URL에서 id 추출
         * post/1 -> pop = 1
         */
        const postId = +req.path.split('/').pop();

        if(!postId){
            return "redirect:error";
        }

        try{
            const findPost = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['member', 'comments', 'comments.member'],
            });
            model.set("post",findPost);
            return "post-detail"
        }
        catch(e){
            return "redirect:error";
        }
    }

    version6() {
    }
}