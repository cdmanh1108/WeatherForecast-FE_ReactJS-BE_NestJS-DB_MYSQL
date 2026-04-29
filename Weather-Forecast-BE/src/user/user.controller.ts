import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/request/create-user.request';
import { ApiResponse } from 'src/common/dto/response/api-response.response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/auth/interfaces/auth-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateUserFullnameRequest,
  UpdateUserLocationRequest,
} from './dto/request/update-user.request';
import { UploadedFileType } from 'src/common/types/uploaded-file.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserRequest) {
    const result = await this.userService.createUser(dto);
    return ApiResponse.success(result, 'Create new account successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserById(@Req() req: AuthRequest) {
    const userId = req.user.sub;
    const result = await this.userService.getUserById(userId);
    return ApiResponse.success(result, 'Get User Profile successfully');
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('avatar')
  async updateUserProfile(
    @Req() req: AuthRequest,
    @UploadedFile() fileAvatar: UploadedFileType
  ) {
    const userId = req.user.sub;
    const result = await this.userService.updateUserAvatar(userId, fileAvatar);
    return ApiResponse.success(result, 'Update profile successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('fullname')
  async updateUserFullName(
    @Req() req: AuthRequest,
    @Body() dto: UpdateUserFullnameRequest
  ) {
    const userId = req.user.sub;
    if (dto.fullname === undefined) {
      throw new BadRequestException('fullname is required');
    }
    const result = await this.userService.updateUserFullname(
      userId,
      dto.fullname
    );
    return ApiResponse.success(result, 'Update profile successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('current-city/by-coordinates')
  async updateUserCurrentCityByCoordinates(
    @Req() req: AuthRequest,
    @Body() dto: UpdateUserLocationRequest
  ) {
    const userId = req.user.sub;
    const result = await this.userService.updateUserCurrentCityByCoordinates(
      userId,
      dto.latitude,
      dto.longitude
    );
    return ApiResponse.success(
      result,
      'Update current city from user location successfully'
    );
  }
}
