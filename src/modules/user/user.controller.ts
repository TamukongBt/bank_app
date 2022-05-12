import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from './user.service';
@ApiTags('User Module')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserId(@Param('id') id: string): Promise<User> {
    return this.userService.getUser({ id: id });
  }

  @Get('/')
  async getUser(
    @Body()
    data,
  ): Promise<User[]> {
    return this.userService.getAllUser(data);
  }

  @Post('/')
  async createUser(
    @Body()
    data,
  ): Promise<User> {
    try {
      if (await this.userService.userExists(data.address)) {
        throw new Error('Email Already Exists');
      } else {
        const user = await this.userService.createUser(data);

        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('/login')
  async loginUser(
    @Body()
    data,
  ): Promise<{ user: User; token: string }> {
    try {
      const { user, token } = await this.userService.loginUser(data);

      return { user, token };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    data,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id: id },
      data: data,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({
      id: id,
    });
  }
}
