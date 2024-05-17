import { UserDTO } from '../../../users/dto';

export class commentDTO {
  id;
  content;
  user;
  childComments;

  constructor(props) {
    this.id = props.id;
    this.content = props.content;
    this.user = new UserDTO(props.user);
    // 답댓글이 없을 수 있음
    this.childComments = props.childComments?.map((comment) => new commentDTO(comment));
  }
}
