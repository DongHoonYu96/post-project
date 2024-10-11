import {Repository} from "typeorm";
import {AppDataSource} from "../../repositories/AppDataSource";
import {Comment} from "./Comment";

export class CommentRepository {
    private static instance: CommentRepository | null = null;
    private readonly commentRepository: Repository<Comment>;

    private constructor() {
        this.commentRepository = AppDataSource.getInstance().getRepository(Comment);
    }

    public getRepo(){
        return this.commentRepository;
    }

    public static getInstance(): CommentRepository {
        if (CommentRepository.instance === null) {
            CommentRepository.instance = new CommentRepository();
        }
        return CommentRepository.instance;
    }
}