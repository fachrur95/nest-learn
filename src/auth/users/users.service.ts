import { PaginateOptions, getProperties, paginate } from '@app/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Token } from './entities/token.entity';

interface FindAllUsers {
  conditions?: FilterUserDto;
  paginateOptions?: PaginateOptions;
  search?: string;
}

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async create(createUserDto: CreateUserDto, session?: User) {
    try {
      const user = new User();

      if (createUserDto.password !== createUserDto.retypedPassword) {
        throw new BadRequestException(['Password are not identical']);
      }

      const existingUser = await (
        await this.usersRepository.findOne(
          [
            { username: createUserDto.username },
            { email: createUserDto.email },
          ],
          true,
        )
      ).getOne();

      if (existingUser) {
        throw new BadRequestException(['username or email is already taken']);
      }

      user.email = createUserDto.email;
      user.username = createUserDto.username;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.password = await this.hashPassword(createUserDto.password);
      user.createdBy = session?.email ?? createUserDto.email;
      user.otpCode = createUserDto.otpCode;

      return this.usersRepository.create(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findAll({ conditions, search, paginateOptions }: FindAllUsers) {
    const query = await this.usersRepository.find('user');

    // Filter by fieldName process
    if (conditions) {
      for (const key in conditions) {
        query.andWhere(`LOWER(user.${key}) = LOWER(:value)`, {
          value: conditions[key],
        });
      }
    }

    // Global search process
    if (typeof search === 'string') {
      const userKeys = getProperties(FilterUserDto);
      for (const key of userKeys) {
        query.orWhere(`LOWER(user.${key}) LIKE LOWER(:search)`, {
          search: `%${search}%`,
        });
      }
    }

    const data = await paginate(query, paginateOptions);

    return data;
  }

  public async findOne(id: number) {
    const entity = await this.usersRepository.findOne({ id });

    entity.leftJoinAndMapMany(
      'entity.tokens',
      Token,
      'tokens',
      'tokens.userId = entity.id',
    );

    return entity.getOne();
  }

  public update(id: number, updateUserDto: UpdateUserDto, session: User) {
    return this.usersRepository.findOneAndUpdate(
      { id },
      { ...updateUserDto, updatedBy: session.email },
    );
  }

  public remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  public async verifyUser(username: string, password: string) {
    const user = await (
      await this.usersRepository.findOne({ username })
    ).getOne();
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  public async updateRefreshToken(user: User) {}
}
