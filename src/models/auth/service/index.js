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

    // props : LoginDTO
    async login(props){
        
        // 존재하는 유저인지 확인
        const isExist = await this.userService.checkUserByEmail(props.email);

        if(!isExist) throw {status:404, message:"존재하지 않는 유저입니다."};

        // 비밀번호 확인
        const isCorrect = await props.comparePassword(isExist.password);

        if(!isCorrect) throw {status:404, message:"비밀번호를 잘못 입력하였습니다."};

        // 토큰 발급
        const accessToken = jwt.sign({id: isExist.id}, process.env.JWT_KEY,{
            expiresIn:"2h",
        });

        // Refresh Token
        const refreshToken = jwt.sign({id: isExist.id}, process.env.JWT_KEY,{
            expiresIn:"14d",
        });

        return {accessToken, refreshToken};
    }

    //뭔 소린지 모르겠다..
    async refresh(accessToken, refreshToken){
        const accessTokenPayload = jwt.verify(accessToken, process.env.JWT_KEY,{
            ignoreExpiration: true, // 토큰 만료를 신경쓰지 않겠다.
        });
        const refreshTokenPayload = jwt.verify(refreshToken, process.env.JWT_KEY);

        if(accessTokenPayload.id !== refreshTokenPayload.id){
            throw {status: 403, message:"권한이 없습니다."};
        }

        const user = await this.userService.findUserById(accessTokenPayload.id);

        // 토큰 발급
        const newAccessToken = jwt.sign({id: user.id}, process.env.JWT_KEY,{
            expiresIn:"2h",
        });

        // Refresh Token
        const newRefreshToken = jwt.sign({id: user.id}, process.env.JWT_KEY,{
            expiresIn:"14d",
        });

        return{
            newAccessToken, newRefreshToken,
        };
    }
}