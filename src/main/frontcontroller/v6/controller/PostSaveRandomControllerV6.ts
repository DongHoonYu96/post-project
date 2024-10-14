import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {Post} from "../../../domain/post/Post";
import {ControllerV6} from "../ControllerV6";

export class PostSaveRandomControllerV6 implements ControllerV6{

    private postRepository: PostRepository;

    constructor() {
        this.postRepository = PostRepository.getInstance();
    }

    async process(req:Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        for(let i=1; i<=100; i++){
            const title = `title ${i}`;
            const content = `content ${i}`;
            const post = new Post(title, content, req.user);
            await this.postRepository.save(post);
        }
        return "index";
    }

    version6() {
    }
}