import { Test, TestingModule } from "@nestjs/testing";
import { URLController } from "./url.controller"
import { OriginalLinkDTO } from "../dto/originalLinkDTO";
import httpMocks, { createResponse } from 'node-mocks-http';
import { ShortenUrlDTO } from "../dto/shortenUrlDTO";
import { ConflictException, NotAcceptableException, NotFoundException } from "@nestjs/common";
import 'dotenv/config'
import { GetLongURLDTO } from "../dto/getLongUrlDTO";

describe('urlController', () => {
    let urlController: URLController;
    const mockValidUrlCode = 'olYERc';
    const mockExpiredUrlCode = 'gAQGif';
    const mockNotThereUrlCode = 'abeIfg';
    const mockExistingCode = 'Xmk5hp';
    let response: any;
    const base_url = process.env.BASE_URL;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [URLController],
            providers: [{
                provide: 'UrlService',
                useValue: {
                    shortenUrl: jest.fn().mockImplementation(async (urlDto: ShortenUrlDTO) => {
                        if (urlDto.customUrl && urlDto.customUrl === mockExistingCode) {
                            throw new ConflictException();
                        }
                        const expiredDate = new Date(2034, 3, 1, 10, 4, 1, 0);
                        if (!urlDto.customUrl) {
                            urlDto.customUrl = 'BCEyTS'
                        }
                        return {
                            shortUrl: `${base_url}/${urlDto.customUrl}`,
                            expiredAt: expiredDate
                        }
                    }),
                    redirect : jest.fn().mockImplementation(async (urlCode: string) => {
                        if (urlCode === mockValidUrlCode) {
                            return 'https://www.google.com'
                        }
                        if (urlCode === mockExpiredUrlCode) {
                            throw new NotAcceptableException();
                        }
                        throw new NotFoundException();
                    }),
                }
            }
        ]
    }
        ).compile()

        response = createResponse<Response>();
        urlController = module.get<URLController>(URLController);
    });

    it('should be defined', () => {
        expect(urlController).toBeDefined();
    });

    describe('postShortenedLink', () => {
        it('should return the newly created shortened link', async () => {

            const payload: OriginalLinkDTO = {
                custom_url: null,
                link: 'https://www.yahoo.com'
            }
            const shorten = async () => {
                return urlController.postShortenedLink(response, payload);
            }
            await expect(shorten()).resolves.toBeTruthy();
        });

        it('should return the newly created shortened link with custom url', async () => {

            const payload: OriginalLinkDTO = {
                custom_url: 'DOJibuxnoLrGWobC',
                link: 'https://www.yahoo.com'
            }
            const shorten = async () => {
                return urlController.postShortenedLink(response, payload);
            }

            await expect(shorten()).resolves.toBeTruthy();
        });
        it('should return error when there is a bad request', async () => {
            const payload: OriginalLinkDTO = {
                custom_url: 'invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid',
                link: 'https://www.yahoo.com'
            }
            const shorten = async () => {
                return urlController.postShortenedLink(response, payload);
            }

            const res = await shorten();
            expect(res.statusCode.valueOf()).toBe(400);
        });
        it('should return error when an existing code is requested', async () => {
            const payload: OriginalLinkDTO = {
                custom_url: mockExistingCode,
                link: 'https://www.yahoo.com'
            }
            const shorten = async () => {
                return urlController.postShortenedLink(response, payload);
            }

            const res = await shorten();
            expect(res.statusCode.valueOf()).toBe(409);
        });
    });

    describe('getLongUrl', () => {
        it('should redirect to long url', async () => {
            const code: GetLongURLDTO = {
                code: 'DOJibuxnoLrGWobC'
            }
            const payload = {
                code: code,
                response: response,
            };
            

            const getLongUrl = async () => {
                return urlController.getLongUrl(payload.response, payload.code);
            }
            await expect(getLongUrl()).resolves.toBeTruthy();
        });

        it('should return error when there is a bad request', async () => {
            const code: GetLongURLDTO = {
                code: 'invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid'
            }
            const payload = {
                code: code,
                response: response,
            }
            const getLongUrl = async () => {
                return urlController.getLongUrl(payload.response, payload.code);
            }

            const res = await getLongUrl();
            if (res) {
                expect(res.statusCode.valueOf()).toBe(400);
            }
        });

        it('should return error when there is an expired code', async () => {
            const code: GetLongURLDTO = {
                code: mockExpiredUrlCode
            }
            const payload = {
                code: code,
                response: response,
            }
            const getLongUrl = async () => {
                return urlController.getLongUrl(payload.response, payload.code);
            }

            const res = await getLongUrl();
            if (res) {
                expect(res.statusCode.valueOf()).toBe(410);
            }
        });

        it('should return error when the code is not found', async () => {
            const code: GetLongURLDTO = {
                code: mockNotThereUrlCode
            }
            const payload = {
                code: code,
                response: response,
            }
            const getLongUrl = async () => {
                return urlController.getLongUrl(payload.response, payload.code);
            }

            const res = await getLongUrl();
            if (res) {
                expect(res.statusCode.valueOf()).toBe(404);
            }
        });
    });

    afterAll(() => async () => {
        jest.clearAllMocks();
    });
})