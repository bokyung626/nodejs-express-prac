export class UserDTO{
    id;
    age;
    name;
    phoneNumber;
    email;

    constructor(user){
        this.id = user.id ?? undefined;
        this.age = user.age ?? undefined;
        this.name = user.name ?? undefined;
        this.phoneNumber = user.phoneNumber ?? undefined;
        this.email = user.email ?? undefined;
    }
}