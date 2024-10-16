import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PostRepository} from "../../../domain/post/PostRepository";
import {ControllerV6} from "../ControllerV6";
import {Repository} from "typeorm";
import {Post} from "../../../domain/post/Post";
import {ViewCountManager} from "../../../domain/post/ViewCountManager";
import {REDIRECT_ERROR} from "../../../was/const/httpConsts";
import * as path from "node:path";
import {POST_IMAGE_PATH, POSTS_FOLDER_NAME_ABS} from "../../../domain/common/const/path.const";

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
            this.makeImageUrlAndSetModel(findPost, model);

            return "post-detail"
        }
        catch(e){
            return REDIRECT_ERROR.REDIRECT_URL;
        }
    }

    private makeImageUrlAndSetModel(findPost: Post, model: Map<string, object>) {
        /**
         * image : 이미지의 이름 (uuid)
         * imageUrl : 이미지의 경로
         */
        if (findPost.image) {
            const image = findPost.image;
            const imagePath = '/' + path.join(POSTS_FOLDER_NAME_ABS, image);

            model.set("imagePath", {imagePath: imagePath});
        }
    }

    version6() {
    }
}