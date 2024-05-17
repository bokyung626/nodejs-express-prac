// jwt검증 및 유저정보 가져오기
// 모든 API를 거칠 때 권한을 인증할 수 있도록 한다.
import jwt from 'jsonwebtoken';
import database from '../database';

export const jwtAuth = async (req, res, next) => {
  try {
    const headers = req.headers;

    // 회원가입 안 한 사람은 이게 없는데 어떻게 함..?
    //const authorization = headers('Authorization') || headers('authorization');
    const authorization = headers.Authorization || headers.authorization;
    // Brearer ${token} or undefined

    if (authorization?.includes('Bearer') || authorization?.includes('brearer')) {
      if (typeof authorization === 'string') {
        const bearers = authorization.split(' ');

        if (bearers.length === 2 && typeof bearers[1] === 'string') {
          const accessToken = bearers[1];

          // 토큰 복호화
          const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY);

          // 복호화한 토큰으로 유저 찾기
          const user = await database.user.findUnique({
            where: {
              id: decodedToken.id,
            },
          });

          if (user) {
            req.user = user;
            next(); // 미들웨어를 통과해 다음 단계로 넘어감
          } else {
            next({ status: 404, message: '유저를 찾을 수 없습니다.' });
          }
        }
      } else {
        next({ status: 400, message: 'Token이 잘못되었습니다.' });
      }
    } else {
      next({ status: 400, message: 'Token이 잘못되었습니다.' });
    }
  } catch (err) {
    next({ ...err, status: 403 });
  }
};
