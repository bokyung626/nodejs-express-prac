import UserController from "./users";
import PostController from "./posts";

// 반복되는 라우터들을 묶어서 정리하는 것 만으로도 코드가 깔끔해진다.
export default [UserController,PostController];

