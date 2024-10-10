import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {ControllerV6} from "../ControllerV6";

export class PostDetailControllerV6 implements ControllerV6{

    private postRepository: PostRepository;

    constructor() {
        this.postRepository = PostRepository.getInstance();
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
            const findPost = await this.postRepository.findById(postId);
            model.set("post",findPost);
            return "redirect:post-detail"
        }
        catch(e){
            return "redirect:error";
        }
    }

    version6() {
    }
}