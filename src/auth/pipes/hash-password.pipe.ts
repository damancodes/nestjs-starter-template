import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: CreateUserDto) {
    if (value.password) {
      const saltRounds = 10;
      value.password = await bcrypt.hash(value.password, saltRounds);
    }
    return value;
  }
}
