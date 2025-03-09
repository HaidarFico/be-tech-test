import { IsNotEmpty, IsString, Length } from "@nestjs/class-validator";

export class GetLongURLDTO {
    @IsString()
    @IsNotEmpty()
    @Length(6, 16)
    code: string
};