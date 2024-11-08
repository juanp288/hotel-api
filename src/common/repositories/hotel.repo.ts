import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from 'src/common/entities/hotel.entity';

export class HotelRepository extends Repository<Hotel> {
  constructor(
    @InjectRepository(Hotel)
    private readonly repository: Repository<Hotel>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
