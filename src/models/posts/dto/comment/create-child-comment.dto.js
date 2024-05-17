export class CreateChildCommentDTO {
  // 자식 댓글
  content;
  //postId; 어차피 부모 댓글은 정해져 있기 때문에 굳이 찾을 필요 없음
  userId;
  parentCommentId;

  constructor(props) {
    this.content = props.content;
    this.userId = props.userId;
    this.parentCommentId = props.parentCommentId;
  }
}
