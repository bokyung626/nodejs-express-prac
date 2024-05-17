import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export class RegisterDTO {
  name;
  email;
  age;
  password;

  constructor(props) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  async hashPassword() {
    const hashedpassword = await bcrypt.hash(this.password, Number(process.env.PASSWORD_SALT));

    return hashedpassword;
  }
}
