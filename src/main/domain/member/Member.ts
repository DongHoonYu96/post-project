import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("members")
export class Member {

    @PrimaryGeneratedColumn()
    private id: number; // DB의 AutoIncrement Id

    @Column()
    private nickname: string;

    @Column()
    private readonly password: string;

    @Column({ unique: true })
    private readonly email: string;

    constructor(id: number, email : string , nickname: string, password : string) {
        this.id = id;
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