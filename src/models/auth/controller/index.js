import { Router } from "express";
import { AuthSevice } from "../service";
import { RegisterDTO } from "../dto/register.dto";
import { LoginDTO } from "../dto/login.dto";

class AuthController{
    authService;
    router;
    path="/auth";

    constructor(){
        this.router = Router();
        this.authService = new AuthSevice();
        this.init();
    }
    
    init(){
        // register,login은 모두 post로 작성한다.
        // Http method가 아닌 이외의 기능을 사용하는 경우 대부분 post를 사용.
        this.router.post('/register', this.register.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/refresh', this.refreshToken.bind(this));
    }

    async register(req, res, next){
        try{
            const body = req.body;

            const { accessToken, refreshToken } = await this.authService.register(new RegisterDTO(body));

            res.status(200).json({
                accessToken, 
                refreshToken,
            });
        }catch(err){
            next(err);
        }
    }

    async login(req, res, next){
        try{
          const body = req.body;

          const {accessToken, refreshToken } = await this.authService.login(new LoginDTO(body));
          
          res.status(200).json({
            accessToken, 
            refreshToken,
        });
        }catch(err){
            next(err);
        }
    }

    //Token 재발행 API
    async refreshToken(req, res, next){
        try {
            const body = req.body;

            const {accessToken, refreshToken} = await this.authService.refresh(
                body.accessToken, body.refreshToken
            );

            res.status(200).json({
                accessToken, refreshToken,
            })
        } catch (err) {
            next(err);
        }
    }

}

const authController = new AuthController();
export default authController;