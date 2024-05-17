import { Router } from 'express';
import { PostService } from '../service';
import { CreatePostDTO } from '../dto/create-post.dto';
import { CreateCommentDTO } from '../dto/comment/create-comment.dto';
import { pagination } from '../../../middleware/pagination';
import { UpdateCommentDTO, UpdatePostDTO } from '../dto';

class PostController {
  router;
  path = '/posts';
  postService;

  constructor() {
    this.router = new Router();
    this.postService = new PostService();
    this.init();
  }

  init() {
    this.router.get('/:id', this.getPost.bind(this));
    this.router.get('/', pagination, this.getPosts.bind(this));

    this.router.post('/:postId/like-combined', this.postLike.bind(this));

    this.router.post('/', this.createPost.bind(this));
    this.router.post('/comments', this.createComment.bind(this));
    this.router.post('/child-comments', this.createChileComment.bind(this));

    this.router.patch('/:postId', this.updatePost.bind(this));
    this.router.patch('/comments/:commentId', this.updateComment.bind(this));

    this.router.delete('/:id', this.deletePost.bind(this));
    this.router.delete('/comments/:commentId', this.deleteComment.bind(this));
  }

  // 포스트 상세 불러오기 API
  async getPost(req, res, next) {
    try {
      const { id } = req.params;

      const post = await this.postService.getPost(id);

      res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  }

  // 포스트 목록 불러오기 API
  async getPosts(req, res, next) {
    try {
      // 검색값의 경우 req.query에 들어온다.

      const searchValue = req.query.searchValue;

      const { posts, count } = await this.postService.getPosts(
        {
          skip: req.skip,
          take: req.take,
        },
        searchValue,
      );

      res.status(200).json({ posts, count });
    } catch (err) {
      next(err);
    }
  }

  // 좋아요 API
  async postLike(req, res, next) {
    try {
      if (!req.user) throw { status: 404, message: '로그인 해주세요.' };
      const { postId } = req.params;
      const { isLike } = req.body;

      await this.postService.postLike(req.user.id, postId, isLike);

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }

  // 신규 포스트 작성 API
  async createPost(req, res, next) {
    try {
      // 사용자 검증
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };

      const body = req.body;
      const newPostId = await this.postService.createPost(
        new CreatePostDTO({
          title: body.title,
          content: body.content,
          tags: body.tags,
          userId: req.user.id,
        }),
      );

      res.status(201).json({ id: newPostId });
    } catch (err) {
      next(err);
    }
  }

  // 신규 댓글 작성 API
  async createComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };

      const body = req.body;

      const newCommentId = await this.postService.create(
        new CreateCommentDTO({
          content: body.content,
          userId: req.user.id,
          postId: body.postId,
        }),
      );

      return res.status(201).json({ id: newCommentId.id });
    } catch (err) {
      next(err);
    }
  }

  // 신규 답댓글 작성 API
  async createChileComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };

      const body = req.body;

      const newChildCommentId = await this.postService.create(
        new this.createChileComment({
          content: body.content,
          parentCommentId: body.parentCommentId,
          userId: req.user.id,
        }),
      );

      return res.status(201).json({ id: newChildCommentId.id });
    } catch (err) {
      next(err);
    }
  }

  // 댓글 수정 API
  async updateComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };

      const { commentId } = req.params;
      const body = req.body;

      await this.postService.updatePost(commentId, new UpdateCommentDTO(body), req.user);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  // 포스트 수정 API
  async updatePost(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };

      const { postId } = req.params;
      const body = req.body;

      await this.postService.updatePost(postId, new UpdatePostDTO(body), req.user);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };
      const { id } = req.params;
      await this.postService.deletePost(id, req.user);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해 주세요.' };
      const { commentId } = req.params;
      await this.postService.deleteComment(commentId, req.user);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }
}

const postController = new PostController();

export default postController;
