export class Member {

    private id: number; // DB의 AutoIncrement Id
    private userId: string;
    private nickname: string;
    private password: string;
    private email: string;

    constructor(id: number, email : string , nickname: string, password : string) {
        this.id = id;
        this.nickname = nickname;
        this.password = password;
        this.email = email;
    }

    public setId(id: number) : void {
        this.id = id;
    }

    public getId() {
        return this.id;
    }
}