import { Test, TestingModule } from "@nestjs/testing";
import { UrlService } from "./url.service";
import { Link } from "../../../common/link.entity";
import { describe } from "node:test";
import { ShortenUrlDTO } from "../dto/shortenUrlDTO";
import { BadRequestException, ConflictException, NotAcceptableException, NotFoundException } from "@nestjs/common";

describe('urlService', () => {
    let urlService: UrlService;

    const mockExistingCode = 'IwZUtfyzcYtcRPrV';
    const mockErrorCode = 'dkJSpKfCswofrImx';
    const mockExpiredCode = 'ErvjXuVbkHaucgQO';

    class MockLinkClass {
        constructor(private _: any) { }
        new = jest.fn().mockResolvedValue({});
        static save = jest.fn().mockImplementation(async (link: Link) => {
            return link;
        });
        static findOneBy = jest.fn().mockImplementation(async (payload: { urlCode: string }) => {
            const { urlCode } = payload;
            let foundLink: null | Link = null;
            if (urlCode === mockErrorCode) {
                throw new Error();
            }
            if (urlCode === mockExistingCode) {
                foundLink = new Link();
                foundLink.urlCode = mockExistingCode;
                foundLink.id = '1e6810ea-6132-46c0-8529-7fca449f4fb7';
                foundLink.longUrl = 'https://www.youtube.com';
                foundLink.createdAt = new Date(2024, 2, 1, 10, 4, 1, 0);
                foundLink.expiredAt = new Date(2034, 3, 1, 10, 4, 1, 0);
            }
            if (urlCode === mockExpiredCode) {
                foundLink = new Link();
                foundLink.urlCode = mockExpiredCode;
                foundLink.id = 'c32b4be4-2950-411a-81f1-25b9db3ef509';
                foundLink.longUrl = 'https://www.youtube.com';
                foundLink.createdAt = new Date(2014, 2, 1, 10, 4, 1, 0);
                foundLink.expiredAt = new Date(2019, 1, 1, 10, 4, 1, 0);
            }
            return foundLink;
        });
        static delete = jest.fn().mockReturnValue(true);
        static create = jest.fn().mockImplementation((link:
            {
                longUrl: string,
                shortUrl: string,
                urlCode: string,
                createdAt: Date,
                expiredAt: Date,
            }) => {
            const createdLink = new Link();
            createdLink.urlCode = link.urlCode;
            createdLink.longUrl = link.longUrl;
            createdLink.shortUrl = link.shortUrl;
            createdLink.createdAt = link.createdAt;
            createdLink.expiredAt = link.expiredAt;

            return createdLink;
        });
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                UrlService,
                {
                    provide: 'LinkRepository',
                    useValue: MockLinkClass,
                },
            ]
        }).compile()

        urlService = module.get<UrlService>(UrlService);
    });

    it('should be defined', () => {
        expect(urlService).toBeDefined();
    })

    describe('shortenUrl', async () => {
        it('Should create shortened URL', async () => {
            const payload: ShortenUrlDTO = {
                longUrl: 'https://www.google.com',
                customUrl: 'EVcWPbXXKVOVTGoR',
            };

            const shorten = async () => {
                return urlService.shortenUrl(payload);
            }

            await expect(shorten()).resolves.toBeInstanceOf(Object);
        });

        it('Should prevent requests with invalid URL', async () => {
            const payload: ShortenUrlDTO = {
                longUrl: 'notURLExample',
                customUrl: 'EVcWPbXXKVOVTGoR',
            };

            const shorten = async () => {
                return urlService.shortenUrl(payload);
            }

            await expect(shorten()).rejects.toBeInstanceOf(BadRequestException);
        })

        it('Should prevent requests with invalid custom code', async () => {
            const payload: ShortenUrlDTO = {
                longUrl: 'https://www.google.com',
                customUrl: 'notvalidcodenotvalidcodenotvalidcode',
            };

            const shorten = async () => {
                return urlService.shortenUrl(payload);
            }

            await expect(shorten()).rejects.toBeInstanceOf(BadRequestException);
        })

        it('Should throw an error if the code is already in use and has not expired yet', async () => {
            const payload: ShortenUrlDTO = {
                longUrl: 'https://www.google.com',
                customUrl: mockExistingCode,
            };

            const shorten = async () => {
                return urlService.shortenUrl(payload);
            }
            
            await expect(shorten()).rejects.toBeInstanceOf(ConflictException);
        })

        it('Should replace a code if it has already expired', async () => {
            const payload: ShortenUrlDTO = {
                longUrl: 'https://www.google.com',
                customUrl: mockExpiredCode,
            };

            const shorten = async () => {
                return urlService.shortenUrl(payload);
            }

            await expect(shorten()).resolves.toBeInstanceOf(Object);
        })

    });

    describe('redirect', async () => {
        it('Should return the longURL', async () => {
            const payload = mockExistingCode;

            const redirect = () => {
                return urlService.redirect(payload);
            }

            await expect(redirect()).resolves.toBe('https://www.youtube.com');
        });

        it('Should throw not found exception if there is no URL', async () => {
            const payload = 'EVcWPbXXKVOVTGaa';

            const redirect = async () => {
                return urlService.redirect(payload);
            }

            await expect(redirect()).rejects.toBeInstanceOf(NotFoundException);

        });

        it('Should throw not acceptable exception if URL is expired', async () => {
            const payload = mockExpiredCode;

            const redirect = async () => {
                return urlService.redirect(payload);
            }

            await expect(redirect()).rejects.toBeInstanceOf(NotAcceptableException);
        });
    });

    afterAll(() => async () => {
        jest.clearAllMocks();
    });
});