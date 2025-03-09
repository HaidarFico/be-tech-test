import { OriginalLinkDTO } from "./originalLinkDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

it('Should succesfully create DTO without custom link', async () => {
    const data = {link : 'https://www.google.com'};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
});

it('Should succesfully create DTO with custom link', async () => {
    const data = {link : 'https://www.google.com', custom_url: 'KteRznsDEqqNwaRF'};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
});

it('Should return error when the link is invalid', async () => {
    const data = {link : 'invalid'};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('link must be an URL address');
});

it('Should return error when the code is too long', async () => {
    const data = {link : 'https://www.google.com', custom_url: 'KteRznsDEqqNwaRFKteRznsDEqqNwaRFKteRznsDEqqNwaRFKteRznsDEqqNwaRF'};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('custom_url must be shorter than or equal to 16 characters');
});

it('Should return error when the code is too short', async () => {
    const data = {link : 'https://www.google.com', custom_url: 'a'};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('custom_url must be longer than or equal to 6 characters');
});

it('Should return error when the link is empty', async () => {
    const data = {link : ''};
    const dto = plainToInstance(OriginalLinkDTO, data);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(JSON.stringify(errors[0].constraints)).toContain('link should not be empty');
});