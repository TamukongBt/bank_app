import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from './user.service';

// My additions
import {
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './user.dto';

@ApiTags('User Module')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserId(@Param('id') id: string): Promise<User> {
    return this.userService.getUser({ id: id });
  }

  @Get('/')
  async getUser(@Body() data): Promise<User[]> {
    return this.userService.getAllUser(data);
  }

  @Post('/')
  async createUser(
    @Body()
    data,
  ): Promise<User> {
    try {
      if (await this.userService.userExists(data.address)) {
        throw new Error('User Already Exists');
      } else {
        const user = await this.userService.createUser(data);

        return user;
      }
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

  // --Auth Section--

  // Adding auth
  // @UseGuards(JwtAuthGuard)
  // @ApiSecurity('access-key')
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('me')
  // public async me(@Request() req) {
  //   return new RenderUser(req.user);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('update/password')
  public async updatePassword(
    @Request() req,
    @Body()
    updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.userService.updatePassword(updatePasswordDto, req.user.id);
    return {
      message: 'password_update_success',
    };
  }
}
