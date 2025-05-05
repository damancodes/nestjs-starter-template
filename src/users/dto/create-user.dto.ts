import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { Provider } from '../entities/user.entity';
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'test+1@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'Test1243@',
  })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and be at least 8 characters long.',
    },
  )
  password?: string;

  //non api propert
  isVerified?: boolean;
  provider?: Provider;
}
