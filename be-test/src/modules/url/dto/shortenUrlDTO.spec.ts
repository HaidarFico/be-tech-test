import { ShortenUrlDTO } from "./shortenUrlDTO";
import { Test, TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe } from "node:test";

it('Should succesfully create DTO without custom link', async () => {
    const data = {longUrl : 'https://www.google.com'};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
});

it('Should succesfully create DTO with custom link', async () => {
    const data = {longUrl : 'https://www.google.com', customUrl: 'KteRznsDEqqNwaRF'};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
});

it('Should return error when the link is invalid', async () => {
    const data = {longUrl : 'invalid'};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('longUrl must be an URL address');
});

it('Should return error when the code is too long', async () => {
    const data = {longUrl : 'https://www.google.com', customUrl: 'KteRznsDEqqNwaRFKteRznsDEqqNwaRFKteRznsDEqqNwaRFKteRznsDEqqNwaRF'};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('customUrl must be shorter than or equal to 16 characters');
});

it('Should return error when the code is too short', async () => {
    const data = {longUrl : 'https://www.google.com', customUrl: 'a'};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('customUrl must be longer than or equal to 6 characters');
});

it('Should return error when the longUrl is empty', async () => {
    const data = {longUrl : ''};
    const dto = plainToInstance(ShortenUrlDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('longUrl should not be empty');
});