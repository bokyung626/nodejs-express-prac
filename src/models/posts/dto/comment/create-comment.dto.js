export class CreateCommentDTO {
  // 부모 댓글
  content;
  postId;
  userId;

  constructor(props) {
    this.content = props.content;
    this.postId = props.postId;
    this.userId = props.userId;
  }
}
