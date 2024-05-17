import database from '../../../database';
import { UserService } from '../../users/service';
import { PostsDTO } from '../dto';
import { PostDTO } from '../dto/post.dto';

export class PostService {
  constructor() {
    this.userService = new UserService();
  }

  // 게시글 목록
  //searchValue : 검색어
  async getPosts({ skip, take }, searchValue) {
    const posts = await database.post.findMany({
      where: {
        title: {
          contains: searchValue ?? '',
        },
      },
      include: {
        user: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await database.post.count({
      where: {
        title: {
          contains: searchValue,
        },
      },
    });

    return { posts: posts.map((post) => new PostsDTO(post)), count };
  }

  // 좋아요
  async postLike(userId, postId, isLike) {
    const user = await this.userService.findUserById(userId);

    const post = await database.post.findUserById({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    // 이전에 좋아요를 눌렀는가?
    const isLiked = await database.postLike.findUnique({
      where: {
        // 복합키로 조회할 때 참고!!
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
    });

    // 좋아요를 누르는 경우
    if (isLike && !isLiked) {
      await database.postLike.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      });
    } // 좋아요를 해제하는 경우
    else if (!isLike && isLiked) {
      await database.postLike.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: post.id,
          },
        },
      });
    }
  }

  // 게시글 상세내용
  async getPost(id) {
    const post = await database.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        commnets: {
          include: {
            user: true,
            childComments: {
              include: {
                user: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    return new PostsDTO(post);
  }

  // 게시글 작성
  // props : CreatePostDTO
  async createPost(props) {
    const user = await this.userService.findUserById(props.userId);
    // 유저 유무 검증, 유저가 없으면 UserService 측에서 에러를 반환하니 여기에 대해서 처리X

    // 게시글 생성
    const newPost = await database.post.create({
      data: {
        title: props.title,
        content: props.content,
        user: {
          // User테이블을 참조함 //유저 연동
          connect: {
            id: props.userId,
          },
        },
        tags: {
          createMany: {
            data: props.tags.map((tag) => ({ name: tag })), // [{name:"~~"}]
          },
        },
      },
    });

    return newPost.id;
  }

  // 부모댓글 생성 //props : createCommentDTO
  async createComment(props) {
    const user = await this.userService.findUserById(props.userId);
    const post = await database.post.findUnique({
      where: {
        id: props.postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    const newComment = await database.comment.create({
      data: {
        content: props.content,
        post: {
          connect: {
            id: post.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return newComment.id;
  }

  // 자식댓글 생성 //props : createChildCommentDTO
  async createChildComment(props) {
    const user = await this.userService.findUserById(props.userId);

    // 부모댓글 검증
    const parentComment = await database.comment.findUnique({
      where: {
        id: props.parentCommentId,
      },
    });

    if (!parentComment) throw { status: 404, message: '부모 댓글을 찾을 수 없습니다.' };

    const newChildComment = await database.comment.create({
      data: {
        content: props.content,
        user: {
          connect: {
            id: user.id,
          },
        },
        post: {
          id: parentComment.postId,
        },
        parentComment: {
          connect: {
            connect: {
              id: parentComment.id,
            },
          },
        },
      },
    });

    return newChildComment.id;
  }

  async updatePost(postId, props, user) {
    const post = await database.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    if (post.userId !== user.id) throw { status: 403, message: '본인의 글만 수정할 수 있습니다.' };

    if (props.tags) {
      const tags = await database.tag.findMany({
        where: {
          postId: postId,
        },
      });

      // 1) 태그를 모두 삭제하고, 새로 수정한 태그로 교체 (V)
      // 2) 기존의 태그에서 중복되는 값만 제외하고 교체

      await database.tag.deleteMany({
        where: {
          postId: post.id,
        },
      });

      await database.tag.createMany({
        data: props.tags.map((tag) => ({
          name: tag,
          post: {
            connect: {
              id: post.id,
            },
          },
        })),
      });
    }

    await database.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: props.title,
        content: props.content,
      },
    });
  }

  async updateComment(commentId, user) {
    const comment = await database.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    if (comment.userId !== user.id) throw { status: 403, message: '본인의 댓글만 수정할 수 있습니다.' };

    await database.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        content: props.content,
      },
    });
  }

  async deletePost(postId, user) {
    const post = await database.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw { status: 404, message: '게시글을 찾을 수 없습니다.' };

    if (post.userId !== user.id) throw { status: 403, message: '본인의 글만 삭제할 수 있습니다.' };

    await database.post.delete({
      where: {
        id: post.id,
      },
    });
  }

  async deleteComment(commentId, user) {
    const comment = await database.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    if (comment.userId !== user.id) throw { status: 403, message: '본인의 댓글만 삭제할 수 있습니다.' };

    await database.comment.delete({
      where: {
        id: post.id,
      },
    });
  }
}
