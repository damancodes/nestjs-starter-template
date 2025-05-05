import { ApiProperty } from '@nestjs/swagger';
export class LoginAuthDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
