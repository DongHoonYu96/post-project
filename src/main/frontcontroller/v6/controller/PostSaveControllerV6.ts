import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {Post} from "../../../domain/post/Post";
import {ControllerV6} from "../ControllerV6";

export class PostSaveControllerV6 implements ControllerV6{

    private postRepository: PostRepository;

    constructor() {
        this.postRepository = PostRepository.getInstance();
    }

    async process(req:Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const title = paramMap.get('title');
        const content= paramMap.get('content');

        if(!title || !content || !req.user){
            return "REDIRECT_ERROR.REDIRECT_URL";
        }

        const post = new Post(title, content , req.user);
        try{
            const savedPost = await this.postRepository.save(post);
            //todo : 해당 post의 상세 페이지로 이동
            return "redirect:index"
        }
        catch(e){
            return "REDIRECT_ERROR.REDIRECT_URL";
        }
    }

    version6() {
    }
}