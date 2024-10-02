export class Member {

    private id: number; // DB의 AutoIncrement Id
    private userId: string;
    private name: string;
    private password: string;
    private email: string;

    constructor(id: number, userId : string , password: string, name : string ,  email: string) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public setPassword(password: string) : void {
        this.password = password;
    }

    public setUsername(name : string) : void {
        this.name = name;
    }

    public setId(id: number) : void {
        this.id = id;
    }

    public getId() {
        return this.id;
    }
}