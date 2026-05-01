import { IsBoolean } from 'class-validator';

export class UpdateUserEnabledDto {
  @IsBoolean()
  enabled!: boolean;
}
