import { Router } from "express";

//Router
class UserController {

    router;
    path = "/users"
    
    users = [
        {
            id:1,
            name: "router",
            age: 5,
        },
    ];

    // 생성자
    constructor(){
        this.router = Router();
        this.init();
    }

    // 생성자를 실행할 때 가장 먼저 실행하는 함수
    init(){
        this.router.get('/', this.getUsers.bind(this)); 
        this.router.get("/detail/:id", this.getUser.bind(this));
        this.router.post('/', this.createUser.bind(this));
    }

    // req,res를 매개인자로 갖는 콜백함수
    getUsers(req, res, next){
        try {
            res.status(200).json({ user: this.users });
        } catch (err) {
            next(err);
        }
    }

    createUser(req, res){
        const { name, age } = req.body;

        this.users.push({
            id : new Date.getTime(),
            name,
            age,
        });

        res.status(201).json({ users: this.users });
    }
};

const userController = new UserController();

export default userController;

//class, bind