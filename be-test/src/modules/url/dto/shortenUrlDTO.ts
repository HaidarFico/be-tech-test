import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "@nestjs/class-validator";

export class ShortenUrlDTO {
    @IsUrl()
    @IsNotEmpty()
    @IsString()
    longUrl: string;
    
    @IsOptional()
    @IsString()
    @Length(6, 16)
    customUrl: string | null; 
}