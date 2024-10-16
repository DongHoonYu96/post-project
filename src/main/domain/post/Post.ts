import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import {Member} from "../member/Member";
import {Comment} from "../comment/Comment";

@Entity("posts")
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