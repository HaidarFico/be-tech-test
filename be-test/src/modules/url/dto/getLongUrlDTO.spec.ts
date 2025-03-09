import { GetLongURLDTO } from "./getLongUrlDTO";
import { Test, TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe } from "node:test";

it('Should succesfully create DTO', async () => {
    const data = {code : 'xDZnPSGygzYNqcaA'};
    const dto = plainToInstance(GetLongURLDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
});

it('Should return error when the code is too long', async () => {
    const data = {code : 'xDZnPSGygzYNqcaAxDZnPSGygzYNqcaAxDZnPSGygzYNqcaA'};
    const dto = plainToInstance(GetLongURLDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('code must be shorter than or equal to 16 characters');
});

it('Should return error when the code is too short', async () => {
    const data = {code : 'a'};
    const dto = plainToInstance(GetLongURLDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('code must be longer than or equal to 6 characters');
});

it('Should return error when the code is empty', async () => {
    const data = {code : ''};
    const dto = plainToInstance(GetLongURLDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('code must be longer than or equal to 6 characters');
});