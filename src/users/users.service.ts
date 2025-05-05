import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as _ from 'lodash';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //create user with usename and password
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    /**
     * settig isVerified to false
     * and loginType to password
     */

    const user = this.userRepository.create({
      passwordHash: createUserDto.password,
      isVerified: false,
      provider: Provider.PASSWORD,
      ...createUserDto,
    });
    const save = await this.userRepository.save(user);
    return _.omit(save, ['password']);
  }
  findAll() {
    return `This action returns all users`;
  }

  async findOne(userfilter: { email?: string; id?: string }) {
    const user = await this.userRepository.findOneBy({ ...userfilter });
    return user;
  }
  //  update(id: number, updateUserDto: UpdateUserDto) {

  update() {
    return;
  }

  remove() {
    return;
  }
}
