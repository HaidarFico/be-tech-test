import { Test, TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe } from "node:test";
import { CustomCodeValidationPipe } from "./customCodeValidationPipe";
import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { GetLongURLDTO } from "../dto/getLongUrlDTO";

let validationPipe: CustomCodeValidationPipe;
let metadata: ArgumentMetadata;
beforeEach(() => {
  validationPipe = new CustomCodeValidationPipe()
  // metadata = jest.fn().mockImplementation()
  metadata = {
    type: 'param',
    data: undefined,
    metatype: undefined
  };
});

it('Should transform valid code string into DTO', async () => {
  const code = 'xDZnPSGygzYNqcaA';
  const res = await validationPipe.transform(code, metadata);
  expect(res).toBeInstanceOf(GetLongURLDTO);
  expect(res).toHaveProperty('code', 'xDZnPSGygzYNqcaA');
});

it('Should throw an error if the code is too short', async () => {
  const code = 'a';
  expect(validationPipe.transform(code, metadata)).rejects.toBeInstanceOf(BadRequestException);
});

it('Should throw an error if the code is too long', async () => {
  const code = 'xDZnPSGygzYNqcaAxDZnPSGygzYNqcaAxDZnPSGygzYNqcaAxDZnPSGygzYNqcaA';
  expect(validationPipe.transform(code, metadata)).rejects.toBeInstanceOf(BadRequestException);
});

it('Should throw an error if the input is not a parameter', async () => {
  const customMetadata = {
    type: 'body',
    data: undefined,
    metatype: undefined
  } as ArgumentMetadata;
  const code = 'xDZnPSGygzYNqcaA';
  expect(validationPipe.transform(code, customMetadata)).rejects.toBeInstanceOf(BadRequestException);
});