import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "@nestjs/class-validator";

export class OriginalLinkDTO {
    @IsUrl()
    @IsNotEmpty()
    @IsString()
    link: string;

    @IsOptional()
    @IsString()
    @Length(6, 16)
    custom_url: string | null;
}