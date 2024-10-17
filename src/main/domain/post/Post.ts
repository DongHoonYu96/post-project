import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany, Index
} from "typeorm";
import {Member} from "../member/Member";
import {Comment} from "../comment/Comment";

@Entity("posts")
@Index("idx_post_created_at", ["createdAt"])
@Index("idx_created_at_with_id", ["createdAt", "id"])
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: 0 })
    views: number;

    @Column({
        nullable:true,
    })
    image?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Member, member => member.posts)
    member: Member;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    constructor(title : string, content : string, member : Member, image?: string) {
        this.title = title;
        this.content = content;
        this.member = member;
        this.image = image;
    }
}