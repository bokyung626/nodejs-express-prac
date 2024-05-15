export class UpdataUserDTO{
    name;
    email;

    constructor(user){
        this.name = user.name ?? undefined;
        this.email = user.email ?? undefined;
    }
}