import { Router } from 'express';
import { UserService } from '../service';
import { CreateUserDTO, UpdataUserDTO, UserDTO } from '../dto';
import { pagination } from '../../../middleware/pagination';

//Router
class UserController {
  router;
  path = '/users';
  userService;

  // 생성자
  constructor() {
    this.router = Router();
    this.init();
    this.userService = new UserService();
  }

  // 생성자를 실행할 때 가장 먼저 실행하는 함수
  init() {
    this.router.get('/', pagination, this.getUsers.bind(this));
    this.router.get('/detail/:id', this.getUser.bind(this));
    this.router.post('/', this.createUser.bind(this));
    this.router.post('/:id', this.updateUser.bind(this));
    this.router.post('/:id', this.deleteUser.bind(this));
  }

  // 유저 리스트 페이징해서 가져옴
  async getUsers(req, res, next) {
    try {
      const { users, count } = await this.userService.findUsers({ skip: req.skip, take: req.limit });
      res.status(200).json({ users: users.map((user) => new UserDTO(user)), count });
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.findUserById(id);

      res.status(200).json({ user: new UserDTO(user) });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const createUserDto = new CreateUserDTO(req.body);
      const newUserId = await this.userService.createUser(createUserDto);
      res.status(201).json({ id: newUserId });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateUserDto = new UpdataUserDTO(req.body);
      await this.userService.updateUser(id, updateUserDto);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }
}

const userController = new UserController();

export default userController;

//class, bind
