import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelRepository } from 'src/common/repositories/hotel.repo';
import { Hotel } from 'src/common/entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @Inject(HotelRepository)
    private readonly hotelRepository: HotelRepository,
  ) {}

  async create(input: CreateHotelDto): Promise<Hotel> {
    return await this.hotelRepository.save(this.hotelRepository.create(input));
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find();
  }

  async findOne(name: string): Promise<Hotel> {
    return await this.hotelRepository.findOne({ where: [{ name }] });
  }

  async update(id: number, input: UpdateHotelDto): Promise<Hotel> {
    return await this.hotelRepository.save({ id, ...input });
  }

  async remove(id: number) {
    const hotelToDelete = await this.hotelRepository.findOneBy({ id });
    if (!hotelToDelete) {
      throw new UnprocessableEntityException('No se encontró el hotel');
    }

    await this.hotelRepository.remove(hotelToDelete);

    return { msg: `Has eliminado el hotel: ${hotelToDelete.name}` };
  }
}
