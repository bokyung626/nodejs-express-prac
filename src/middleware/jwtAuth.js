// jwt검증 및 유저정보 가져오기
// 모든 API를 거칠 때 권한을 인증할 수 있도록 한다.
import jwt from "jsonwebtoken";
import database from "../database";

export const jwtAuth = async(req,res,next) => {
    try {

        const headers = req.headers;
        // 여기서 에러 발생
        console.log(headers);
        const authorization = headers("Authorization") || headers("authorization");
        
        
        // Brearer ${token} or undefined

        if(authorization?.include("Bearer")|| authorization?.include("brearer")){
            if(typeof authorization === "string"){
                const bearers = authorization.split("");

                if(bearers.length === 2 && typeof[1] === "string"){
                    const accessToken = bearers[1];

                    // 토큰 복호화
                    const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY);

                    const user = await database.user.findUnique({
                        where:{
                            id: decodedToken.id,
                        },
                    });

                    if(user){
                        req.user = user;
                        next();
                    }else{
                        next({status:404, message:"유저를 찾을 수 없습니다."})
                    }
                }
            }else{
                next({status:400, message:"Token이 잘못되었습니다."})
            }
        }
        else{
            next({status:400, message:"Token이 잘못되었습니다."})
        }


    } catch (err) {
        next({...err, status: 403});
    }
}