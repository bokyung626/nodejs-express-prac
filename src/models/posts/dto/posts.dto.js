import { UserDTO } from '../../users/dto';
import { commentDTO } from './comment';
import { TagDTO } from './tag/tag.dto';

export class PostsDTO {
  id;
  title;
  content;
  createdAt;
  user;

  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.user = new UserDTO(props.user);
  }
}
