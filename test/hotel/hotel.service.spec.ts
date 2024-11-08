import { Test, TestingModule } from '@nestjs/testing';
import { HotelRepository } from 'src/common/repositories/hotel.repo';
import { Hotel } from 'src/common/entities/hotel.entity';
import { HotelService } from 'src/components/hotel/hotel.service';
import { CreateHotelDto } from 'src/components/hotel/dto/create-hotel.dto';
import { UpdateHotelDto } from 'src/components/hotel/dto/update-hotel.dto';

describe('HotelService', () => {
  let hotelService: HotelService;
  let hotelRepository: HotelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        {
          provide: HotelRepository,
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    hotelService = module.get<HotelService>(HotelService);
    hotelRepository = module.get<HotelRepository>(HotelRepository);
  });

  it('should be defined', () => {
    expect(hotelService).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new hotel', async () => {
      const input: CreateHotelDto = {
        name: 'Hotel Test',
        address: '123 Test St',
        stars: 5,
      };
      const hotel = { id: 1, ...input } as Hotel;

      (hotelRepository.create as jest.Mock).mockReturnValue(hotel);
      (hotelRepository.save as jest.Mock).mockResolvedValue(hotel);

      const result = await hotelService.create(input);

      expect(hotelRepository.create).toHaveBeenCalledWith(input);
      expect(hotelRepository.save).toHaveBeenCalledWith(hotel);
      expect(result).toEqual(hotel);
    });
  });

  describe('findAll', () => {
    it('should return an array of hotels', async () => {
      const hotels = [
        { id: 1, name: 'Hotel One', address: '123 St', stars: 4 },
        { id: 2, name: 'Hotel Two', address: '456 Ave', stars: 3 },
      ] as Hotel[];

      (hotelRepository.find as jest.Mock).mockResolvedValue(hotels);

      const result = await hotelService.findAll();

      expect(hotelRepository.find).toHaveBeenCalled();
      expect(result).toEqual(hotels);
    });
  });

  describe('findOne', () => {
    it('should return a single hotel by name', async () => {
      const hotel = {
        id: 1,
        name: 'Hotel One',
        address: '123 St',
        stars: 4,
      } as Hotel;

      (hotelRepository.findOne as jest.Mock).mockResolvedValue(hotel);

      const result = await hotelService.findOne('Hotel One');

      expect(hotelRepository.findOne).toHaveBeenCalledWith({
        where: [{ name: 'Hotel One' }],
      });
      expect(result).toEqual(hotel);
    });

    it('should return undefined if hotel is not found', async () => {
      (hotelRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      const result = await hotelService.findOne('Nonexistent Hotel');

      expect(hotelRepository.findOne).toHaveBeenCalledWith({
        where: [{ name: 'Nonexistent Hotel' }],
      });
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return the updated hotel', async () => {
      const id = 1;
      const input: UpdateHotelDto = {
        name: 'Updated Hotel',
        address: '789 Updated St',
        stars: 5,
      };
      const updatedHotel = { id, ...input } as Hotel;

      (hotelRepository.save as jest.Mock).mockResolvedValue(updatedHotel);

      const result = await hotelService.update(id, input);

      expect(hotelRepository.save).toHaveBeenCalledWith({ id, ...input });
      expect(result).toEqual(updatedHotel);
    });
  });

  describe('remove', () => {
    it('should remove a hotel by ID and return a confirmation message', async () => {
      const hotel = {
        id: 1,
        name: 'Hotel to Delete',
        address: '123 St',
        stars: 4,
      } as Hotel;

      (hotelRepository.findOneBy as jest.Mock).mockResolvedValue(hotel);
      (hotelRepository.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await hotelService.remove(hotel.id);

      expect(hotelRepository.findOneBy).toHaveBeenCalledWith({ id: hotel.id });
      expect(hotelRepository.remove).toHaveBeenCalledWith(hotel);
      expect(result).toEqual({ msg: `Has eliminado el hotel: ${hotel.name}` });
    });

    it('should throw an error if hotel is not found', async () => {
      (hotelRepository.findOneBy as jest.Mock).mockResolvedValue(undefined);

      await expect(hotelService.remove(999)).rejects.toThrowError(
        'No se encontró el hotel',
      );
      expect(hotelRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(hotelRepository.remove).not.toHaveBeenCalled();
    });
  });
});
