import database from "../../../database";

export class UserService{

    // 해당 이메일을 가진 유저 유무 확인
    async checkUserByEmail(email){
        const user = await database.user.findUnique({
            where:{
                email,
            },
        });

        if(!user) return false;
        return user;
    }

    async findUserById(id){
        const user = await database.user.findUnique({
            where:{
                id,
            },
        });

        if(!user) throw {status:404, message:"유저를 찾을 수 없습니다."};
        return user;

    }

    async findUsers({skip, take}){
        const users = await database.user.findMany({
            skip,
            take,
        });

        const count = await database.user.count();

        return{
            users,
            count,
        };
    }

    async createUser(props){
        const newUser = await database.user.create({
            data:{
                name:props.name,
                email: props.email,
                age: props.age,
                phoneNumber: props.phoneNumber,
                password : props.password,
            },
        }); 
        // 새로운 유저의 id 반환
        return newUser.id;
    }

    async updateUser(id, props){

        // id 유무에 대한 에러 핸들링을 해줄 수 없기 때문에 사전에 먼저 처리를 해주어야 한다.
        const isExist = await database.user.findUnique({
            where : {
                id,
            },
        });

        if(!isExist) throw {statue:404, message:"유저를 찾을 수 없습니다."};

        await database.user.update({
            where:{
                id : isExist.id,
            },
            data:{
                name:props.name,
                email: props.email,
                age: props.age,
                phoneNumber: props.phoneNumber,
                password : props.password,
            },
        });
    }

    async deleteUser(id){
        await database.user.delete({
            where:{
                id,
            },
        });
    }
    
}