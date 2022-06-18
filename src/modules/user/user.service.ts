import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from './user.dto';
import { compare, hash } from 'bcrypt';

interface FormatLogin extends Partial<User> {
  login: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async fetchUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getAllUser(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
  async userExists(id: string): Promise<boolean> {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (userExists) {
      return true;
    } else {
      return false;
    }
  }

  // Password check
  //use by user module to change user password
  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) },
    });
  }
  //use by auth module to register user in database
  // async create(userDto: CreateUserDto): Promise<any> {

  //     // // check if the user exists in the db
  //     const userInDb = await this.prisma.user.findFirst({
  //         where: {login: userDto.login}
  //     });
  //     if (userInDb) {
  //         throw new HttpException("user_already_exist",
  //            HttpStatus.CONFLICT);
  //     }
  //     return await this.prisma.user.create({
  //         ...(userDto),
  //         password: await hash(userDto.password, 10)
  //     });
  // }
  //use by auth module to login user
  async findByLogin({ accountNo, password }: LoginUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { accountNo: accountNo },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  //use by auth module to get user in database
  async findByPayload({ accountNo }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { accountNo },
    });
  }
}
