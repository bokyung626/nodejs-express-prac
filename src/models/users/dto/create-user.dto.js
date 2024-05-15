export class CreateUserDTO {

    name;
    email;
    password;

    constructor(user){
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
    }

}