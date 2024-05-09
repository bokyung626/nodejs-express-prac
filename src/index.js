import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from 'dayjs';

const app = express();

let users = [
    {
        id:1,
        name: "bk",
        age:30,
    }
];

//요청을 json형태로 받는 데 특화된 라이브러리 express 내장함수
app.use(express.urlencoded({extended: true, limit:"700mb"})); //http URL 쿼리를 좀 더 쉽게 다룰 수 있게 해줌 //용량 제한 설정 json으로 700mb까지만 받음
app.use(express.json()); //다양한 형태의 리퀘스트 바디 확인 가능 
app.use(cors({origin:"*"})); //cors
app.use(helmet()); //보안강화

// GET Method
// 유저 정보 가져오기
// req : query or path // req body가 손실되는 경우가 있어서
// 성공 statue : 200
app.get("/users", (req,res)=>{
    res.status(200).json({users});  //성공 시 유저 정보를 내보내줌
});

// POST Method
// 유저 생성
// 요청 -> body
// 성공 status : 201
app.post("/users", (req,res)=>{
    const {name, age} = req.body;
    console.log("body", req.body);
    users.push({
        id:new Date().getTime(), //유일한 값
        name,
        age,
    });

    res.status(201).json({users}); //성공 시 유저 정보를 내보내줌
});

// PATCH Method
// 유저 정보 수정
// 성공 status : 204
// id : req.params.id
// 요청 -> body
app.patch("/users/:id", (req,res)=>{
    const { id } = req.params;
    const { name, age } = req.body; 
    const targetUserIdx = users.findIndex((user) => user.id === Number(id));
    users[targetUserIdx] = {
        id: users[targetUserIdx].id,
        name: name ?? users[targetUserIdx].name,
        age: age ?? users[targetUserIdx].age
    }
    res.status(204).json({}); //204로 응답을 보낼 때는 json을 비워줘야 한다. 수정에 성공했다. 정해진 약속.
});

// DELETE Method
// 유저 삭제
// 성공 status : 204
app.delete("/users/:id", (req,res)=>{
    const {id} = req.params;

    const deleteUsers = users.filter((user) => user.id !== Number(id)); //해당 id를 제외하고 나머지 user만 남음
    users = deleteUsers;

    res.status(204).json({});
});

// req : 요청 -> Request
// res : 응답 -> Response 
app.get("/", (req, res) => {
    res.send("Node.js 정말 재미있어요!");// 아무 표현 요청이나 응답 다 보낼 수 있음.
})

app.listen(8000, ()=>{ // app.listen(작동포트, 서버 실행 후 실행 될 콜백 함수)
    console.log("server running... port 8000.");
})