import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { GetLongURLDTO } from "../dto/getLongUrlDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
@Injectable()
export class CustomCodeValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      const dtoRaw : GetLongURLDTO = {
        code: value,
      };

      const dto = plainToInstance(GetLongURLDTO, dtoRaw);
      const errors = await validate(dto);
      if(errors.length > 0) {
        throw new BadRequestException();
      }

      return value;
    } else {
      throw new BadRequestException('Invalid argument');
    }
  }
}