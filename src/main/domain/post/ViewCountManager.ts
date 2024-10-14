import {PostRepository} from "./PostRepository";
import {RedisClient} from "../../repositories/RedisClient";

/**
 * 게시글 조회수 관리를 위한 클래스
 */
export class ViewCountManager {
    private static instance: ViewCountManager | null = null;
    private redis = RedisClient;
    private postRepository = PostRepository.getInstance().getRepo();

    private constructor() {
    }

    public static getInstance() {
        if (ViewCountManager.instance === null) {
            ViewCountManager.instance = new ViewCountManager();
        }
        return ViewCountManager.instance;
    }

    /**
     * 게시글 조회수를 증가시키고 현재 조회수를 반환
     * @param postId - 게시글 ID
     * @returns 증가된 조회수
     */
    async incrementViewCount(postId: number): Promise<number> {
        const key = `post:${postId}:views`;
        const viewCount = await this.redis.incr(key); //키값의 val을 1증가시킴.
        return viewCount;
    }

    /**
     * 캐시의 조회수를 데이터베이스에 동기화
     */
    async syncViewCountsToDatabase(): Promise<void> {
        const keys = await this.redis.keys('post:*:views');
        for (const key of keys) {
            const postId = parseInt(key.split(':')[1]);
            const views = await this.redis.get(key);

            if (views) {
                //기존db값 += 증가된 조회수
                await this.postRepository.increment({ id: postId }, 'views', parseInt(views));
                await this.redis.del(key);
            }
        }
    }

    /**
     * 리소스 정리
     */
    async cleanup(): Promise<void> {
        await this.redis.quit();
    }
}