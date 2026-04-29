import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './dto/request/create-user.request';
import { BadRequestException } from '@nestjs/common';
import { hashPassword } from 'src/utils/hash.util';
import { UserProfileResponse } from './dto/response/user-profile.response';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { OpenWeatherService } from 'src/services/openweather/openweather.service';
import { CityService } from 'src/city/city.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly openWeatherService: OpenWeatherService,
    private readonly cityService: CityService
  ) {}

  async createUser(dto: CreateUserRequest): Promise<User> {
    const existing = await this.userRepo.findOneBy({
      username: dto.username,
    });
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const hashed = await hashPassword(dto.password);
    const user = this.userRepo.create({
      username: dto.username,
      fullname: dto.fullName,
      password: hashed,
      email: `${dto.username}@example.com`, // Mock email because DB requires it but DTO doesn't
    });
    return this.userRepo.save(user);
  }

  async findOne(username: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username },
      relations: ['currentCity'],
    });
  }

  async getUserById(userId: number): Promise<UserProfileResponse | null> {
    const user = await this.userRepo.findOne({
      where: { userId },
      relations: ['currentCity'],
    });
    if (!user) throw new BadRequestException('User not found');
    return UserProfileResponse.fromEntity(user);
  }

  async updateUserAvatar(
    userId: number,
    fileAvatar: Express.Multer.File
  ): Promise<UserProfileResponse | null> {
    const user = await this.userRepo.findOne({
      where: { userId },
    });
    if (!user) throw new BadRequestException('User not found');
    if (!fileAvatar) throw new BadRequestException('Missing file avatar');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const result = await this.cloudinaryService.uploadStream(fileAvatar.buffer);
    if (!result.secure_url)
      throw new BadRequestException('Error when upload avatar');
    user.avatar = result.secure_url;
    await this.userRepo.save(user);
    return UserProfileResponse.fromEntity(user);
  }

  async updateUserFullname(
    userId: number,
    fullname: string
  ): Promise<UserProfileResponse | null> {
    const user = await this.userRepo.findOne({
      where: { userId },
    });
    if (!user) throw new BadRequestException('User not found');
    user.fullname = fullname;
    await this.userRepo.save(user);
    return UserProfileResponse.fromEntity(user);
  }

  async updateUserCurrentCityByCoordinates(
    userId: number,
    latitude: number,
    longitude: number
  ): Promise<UserProfileResponse | null> {
    const user = await this.userRepo.findOne({
      where: { userId },
    });
    if (!user) throw new BadRequestException('User not found');

    const locations = await this.openWeatherService.reverseGeocode(
      latitude,
      longitude
    );
    const topLocation = locations[0];

    const city = await this.cityService.findBestCityFromCoordinates(
      latitude,
      longitude,
      topLocation?.name,
      topLocation?.country
    );

    user.current_city_fk = city.city_id;
    await this.userRepo.save(user);

    const updatedUser = await this.userRepo.findOne({
      where: { userId },
      relations: ['currentCity'],
    });
    if (!updatedUser) throw new BadRequestException('User not found');

    return UserProfileResponse.fromEntity(updatedUser);
  }
}
