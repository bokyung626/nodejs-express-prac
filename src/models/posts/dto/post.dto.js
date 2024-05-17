import { UserDTO } from '../../users/dto';
import { commentDTO } from './comment';
import { TagDTO } from './tag/tag.dto';

export class PostDTO {
  id;
  title;
  content;
  createdAt;
  user;
  comments;
  tags;

  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt;

    this.user = new UserDTO(props.user);
    this.comments = props.comments.map(
      (comment) =>
        new commentDTO({
          id: comment.id,
          content: comment.content,
          childComments: comment.childComments,
          user: comment.user,
        }),
    );
    this.tags = props.tags.map(
      (tag) =>
        new TagDTO({
          id: tag.id,
          name: tag.name,
        }),
    );
  }
}
