import { Test, TestingModule } from '@nestjs/testing';
import { Hotel } from 'src/common/entities/hotel.entity';
import { CreateHotelDto } from 'src/components/hotel/dto/create-hotel.dto';
import { UpdateHotelDto } from 'src/components/hotel/dto/update-hotel.dto';
import { HotelController } from 'src/components/hotel/hotel.controller';
import { HotelService } from 'src/components/hotel/hotel.service';

describe('HotelController', () => {
  let hotelController: HotelController;
  let hotelService: HotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelController],
      providers: [
        {
          provide: HotelService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    hotelController = module.get<HotelController>(HotelController);
    hotelService = module.get<HotelService>(HotelService);
  });

  it('should be defined', () => {
    expect(hotelController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new hotel', async () => {
      const createHotelDto: CreateHotelDto = {
        name: 'Hotel Test',
        address: '123 Test St',
        stars: 5,
      };
      const createdHotel = { id: 1, ...createHotelDto } as Hotel;

      jest.spyOn(hotelService, 'create').mockResolvedValue(createdHotel);

      const result = await hotelController.create(createHotelDto);

      expect(hotelService.create).toHaveBeenCalledWith(createHotelDto);
      expect(result).toEqual(createdHotel);
    });
  });

  describe('findAll', () => {
    it('should return an array of hotels', async () => {
      const hotels = [
        { id: 1, name: 'Hotel One', address: '123 St', stars: 4 },
        { id: 2, name: 'Hotel Two', address: '456 Ave', stars: 3 },
      ] as Hotel[];

      jest.spyOn(hotelService, 'findAll').mockResolvedValue(hotels);

      const result = await hotelController.findAll();

      expect(hotelService.findAll).toHaveBeenCalled();
      expect(result).toEqual(hotels);
    });
  });

  describe('findOne', () => {
    it('should return a hotel by name', async () => {
      const hotelName = 'Hotel One';
      const hotel = {
        id: 1,
        name: hotelName,
        address: '123 St',
        stars: 4,
      } as Hotel;

      jest.spyOn(hotelService, 'findOne').mockResolvedValue(hotel);

      const result = await hotelController.findOne(hotelName);

      expect(hotelService.findOne).toHaveBeenCalledWith(hotelName);
      expect(result).toEqual(hotel);
    });

    it('should return undefined if hotel is not found', async () => {
      const hotelName = 'Nonexistent Hotel';

      jest.spyOn(hotelService, 'findOne').mockResolvedValue(undefined);

      const result = await hotelController.findOne(hotelName);

      expect(hotelService.findOne).toHaveBeenCalledWith(hotelName);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a hotel by ID', async () => {
      const id = 1;
      const updateHotelDto: UpdateHotelDto = {
        name: 'Updated Hotel',
        address: '789 Updated St',
        stars: 5,
      };
      const updatedHotel = { id, ...updateHotelDto } as Hotel;

      jest.spyOn(hotelService, 'update').mockResolvedValue(updatedHotel);

      const result = await hotelController.update(
        id.toString(),
        updateHotelDto,
      );

      expect(hotelService.update).toHaveBeenCalledWith(id, updateHotelDto);
      expect(result).toEqual(updatedHotel);
    });
  });

  describe('remove', () => {
    it('should remove a hotel by ID and return a confirmation message', async () => {
      const id = 1;
      const confirmationMessage = {
        msg: `Has eliminado el hotel: Hotel to Delete`,
      };

      jest.spyOn(hotelService, 'remove').mockResolvedValue(confirmationMessage);

      const result = await hotelController.remove(id.toString());

      expect(hotelService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(confirmationMessage);
    });

    it('should return an error if hotel is not found', async () => {
      const id = 999;

      jest
        .spyOn(hotelService, 'remove')
        .mockRejectedValue(new Error('Hotel not found'));

      await expect(hotelController.remove(id.toString())).rejects.toThrow(
        'Hotel not found',
      );
      expect(hotelService.remove).toHaveBeenCalledWith(id);
    });
  });
});
