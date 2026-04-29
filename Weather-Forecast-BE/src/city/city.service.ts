import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './city.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>
  ) {}

  async suggestNameCities(keyword: string): Promise<object[]> {
    const cities = await this.cityRepo.find({
      where: { city_name: ILike(`%${keyword}%`) },
      take: 10,
      relations: ['country'],
    });
    return cities.map((city) => ({
      city_id: city.city_id,
      city_name: city.city_name,
      country_name: city.country?.country_name || 'Unknown',
    }));
  }

  async getCityById(city_id: number): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { city_id: city_id },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async getCityByIdWithCountry(city_id: number): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { city_id: city_id },
      relations: ['country'],
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async getCityByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<object> {
    const city = await this.findNearestCityByCoordinates(latitude, longitude);
    const cityWithCountry = await this.getCityByIdWithCountry(city.city_id);

    return {
      city_id: cityWithCountry.city_id,
      city_name: cityWithCountry.city_name,
      country_name: cityWithCountry.country?.country_name || 'Unknown',
      latitude: cityWithCountry.latitude,
      longitude: cityWithCountry.longitude,
    };
  }

  async findBestCityFromCoordinates(
    latitude: number,
    longitude: number,
    cityName?: string,
    countryCode?: string
  ): Promise<City> {
    const normalizedName = cityName?.trim();
    const normalizedCountryCode = countryCode?.trim().toUpperCase();

    if (normalizedName) {
      const query = this.cityRepo
        .createQueryBuilder('city')
        .where('LOWER(city.city_name) = LOWER(:cityName)', {
          cityName: normalizedName,
        });

      if (normalizedCountryCode) {
        query.andWhere('city.country_id = :countryCode', {
          countryCode: normalizedCountryCode,
        });
      }

      const matchedCities = await query.getMany();
      const nearestMatchedCity = this.pickNearestCity(
        matchedCities,
        latitude,
        longitude
      );
      if (nearestMatchedCity) {
        return nearestMatchedCity;
      }
    }

    return this.findNearestCityByCoordinates(latitude, longitude);
  }

  async findNearestCityByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<City> {
    const searchRadii = [1, 5, 20];

    for (const radius of searchRadii) {
      const nearbyCities = await this.getCitiesInBounds(latitude, longitude, radius);
      const nearestCity = this.pickNearestCity(nearbyCities, latitude, longitude);
      if (nearestCity) {
        return nearestCity;
      }
    }

    const allCities = await this.cityRepo.find();
    const nearestCity = this.pickNearestCity(allCities, latitude, longitude);
    if (!nearestCity) {
      throw new NotFoundException('City not found');
    }
    return nearestCity;
  }

  private async getCitiesInBounds(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<City[]> {
    return this.cityRepo
      .createQueryBuilder('city')
      .where('city.latitude BETWEEN :minLat AND :maxLat', {
        minLat: latitude - radius,
        maxLat: latitude + radius,
      })
      .andWhere('city.longitude BETWEEN :minLon AND :maxLon', {
        minLon: longitude - radius,
        maxLon: longitude + radius,
      })
      .getMany();
  }

  private pickNearestCity(
    cities: City[],
    latitude: number,
    longitude: number
  ): City | null {
    if (cities.length === 0) {
      return null;
    }

    let nearestCity = cities[0];
    let minDistance = this.calculateSquaredDistance(
      nearestCity.latitude,
      nearestCity.longitude,
      latitude,
      longitude
    );

    for (let i = 1; i < cities.length; i++) {
      const city = cities[i];
      const distance = this.calculateSquaredDistance(
        city.latitude,
        city.longitude,
        latitude,
        longitude
      );
      if (distance < minDistance) {
        nearestCity = city;
        minDistance = distance;
      }
    }

    return nearestCity;
  }

  private calculateSquaredDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const latDiff = lat1 - lat2;
    const lonDiff = lon1 - lon2;
    return latDiff * latDiff + lonDiff * lonDiff;
  }
}
