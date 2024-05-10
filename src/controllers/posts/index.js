import { Router } from "express";

class PostController{

    router;
    path = "/posts"

    posts = [
        {
            id:1,
            title:"좋은 날씨네요",
            content:"놀러가고 싶다^^",
        },
    ];

    constructor(){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.get('/',this.getPosts.bind(this))
        this.router.get('/detail/:id',this.getPost.bind(this))
        this.router.post('/',this.createPost.bind(this))
    }

      // req,res를 매개인자로 갖는 콜백함수
    getPosts(req, res){
        res.status(200).json({ posts: this.posts });
    }

    getPost(req, res){
        const { id } = req.params; 
        const post = posts.find((post) => post.id === Number(id));
        res.status(201).json({ post });
    }

    createPost(req, res){
        const { title, content } = req.body;

        this.posts.push({
            id : new Date.getTime(),
            title,
            content,
        });

        res.status(201).json({ posts: this.posts });
    }

}

const postController = new PostController();

export default postController;