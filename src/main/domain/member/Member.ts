import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany} from "typeorm";
import {Post} from "../post/Post";

@Entity("members")
export class Member {

    @PrimaryGeneratedColumn()
    id: number; // DB의 AutoIncrement Id

    @Column()
    nickname: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn() //밀리초 저장안함.
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, post => post.member)
    posts: Post[];

    constructor(email : string , nickname: string, password : string) {
        this.nickname = nickname;
        this.password = password;
        this.email = email;
    }

    public setId(id: number) : void {
        this.id = id;
    }

    public getEmail(){
        return this.email;
    }
    public getId() {
        return this.id;
    }

    public getPassword() {
        return this.password;
    }
}