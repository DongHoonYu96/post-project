import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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