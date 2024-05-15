export class UserDTO{
    id;
    name;
    email;

    constructor(user){
        this.id = user.id ?? undefined;
        this.name = user.name ?? undefined;
        this.email = user.email ?? undefined;
    }
}