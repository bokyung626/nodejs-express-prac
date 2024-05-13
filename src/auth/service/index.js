import { CreateUserDTO } from "../../users/dto";
import { UserService } from "../../users/service";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthSevice{

    userService;

    constructor(){
        this.userService = new UserService();
    }

    // props : RegisterDTO
    async register(props){

        const isExist = await this.userService.checkUserByEmail(props.email);

        if(isExist) throw {status: 400, message:"이미 존재하는 이메일 입니다."};

        const newUserId = await this.userService.createUser(
            new CreateUserDTO(
                {
                    ...props,
                    password : await props.hashPassword(),
                }
            )
        );

        // 회원가입이 성공적으로 완료되면 Token을 발행해 주어야 함.
        // Access Token
        const accessToken = jwt.sign({id: newUserId}, process.env.JWT_KEY,{
            expiresIn:"2h",
        });

        // Refresh Token
        const refreshToken = jwt.sign({id: newUserId}, process.env.JWT_KEY,{
            expiresIn:"14d",
        });

        console.log("Tokens : " , accessToken,refreshToken);

        return {accessToken, refreshToken};
    }
}