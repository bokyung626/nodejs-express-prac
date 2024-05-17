import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export class UpdataUserDTO {
  name;
  email;
  password;

  constructor(user) {
    this.name = user.name ?? undefined;
    this.email = user.email ?? undefined;
    this.password = user.password ?? undefined;
  }

  async updatePassword(password) {
    this.password = await bcrypt.hash(password, process.env.PASSWORD_SALT);
  }
}
