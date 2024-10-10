import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {Post} from "../../../domain/post/Post";
import {ControllerV6} from "../ControllerV6";
import {Comment} from "../../../domain/comment/Comment";
import {CommentRepository} from "../../../domain/comment/CommentRepository";
import {MemberRepository} from "../../../domain/member/MemberRepository";
import {Repository} from "typeorm";

export class CommentSaveControllerV6 implements ControllerV6{

    private commentRepository  = CommentRepository.getInstance().getRepo();
    private memberRepository = MemberRepository.getInstance().getRepo();
    private postRepository = PostRepository.getInstance().getRepo();

    async process(req:Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {
        const postId = +paramMap.get('postId');
        const content = paramMap.get('content');

        if(!postId || !content ){
            return "redirect:error";
        }
        const loginUser = req.user;

        const findPost = await this.postRepository.findOne({
            where: { id: postId },
        });
        if(!loginUser || !findPost){
            return "redirect:error";
        }

        const comment = new Comment(loginUser, findPost , content);
        try{
            await this.commentRepository.save(comment);
            //해당 post의 상세 페이지로 이동
            return "redirect:post/"+postId;
        }
        catch(e){
            return "redirect:error";
        }
    }

    version6() {
    }
}