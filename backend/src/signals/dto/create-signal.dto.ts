import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSignalDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsDateString()
  time: string;

  @IsNumber()
  dataLength: number;

  @IsNumber()
  @IsOptional()
  dataVolume?: number;

  @IsOptional()
  raw?: any;
}
