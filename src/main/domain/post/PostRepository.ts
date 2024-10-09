import { AppDataSource } from "../../repositories/AppDataSource";
import { Repository } from "typeorm";
import {Post} from "./Post";

export class PostRepository {
    private static instance: PostRepository | null = null;
    private postRepository: Repository<Post>;

    private constructor() {
        this.postRepository = AppDataSource.getInstance().getRepository(Post);
    }

    /**
     * MemberRepository의 유일한 인스턴스를 반환합니다.
     * 인스턴스가 없으면 새로 생성하여 반환합니다.
     * @returns {MemberRepository} MemberRepository의 유일한 인스턴스
     */
    public static getInstance(): PostRepository {
        if (PostRepository.instance === null) {
            PostRepository.instance = new PostRepository();
        }
        return PostRepository.instance;
    }

    /**
     * 새로운 Member를 저장소에 추가합니다.
     * @param {Member} member - 저장할 Member 객체
     * @returns {Promise<Member>} 저장된 Member
     */
    public async save(post: Post): Promise<Post> {
        return await this.postRepository.save(post);
    }


    public async findById(id: number): Promise<Post | null> {
        return await this.postRepository.findOne({ where:  { id } });
    }

    /**
     * 모든 Member를 반환합니다.
     * @returns {Promise<Member[]>} 저장된 모든 Member 객체의 배열
     */
    public async findAll(): Promise<Post[]> {
        return await this.postRepository.find({ withDeleted: false });
    }

    public async deleteById(id: number) {
        try {
            const result = await this.postRepository.softDelete(id);
            if (result.affected > 0) {
                console.log(`Post with id ${id} has been soft deleted.`);
                return true;
            } else {
                console.log(`No post found with id ${id}.`);
                return false;
            }
        } catch (error) {
            console.error(`Error while attempting to soft delete post with id ${id}:`, error);
            throw error; // 또는 에러를 처리하고 false를 반환할 수 있습니다.
        }
    }
}