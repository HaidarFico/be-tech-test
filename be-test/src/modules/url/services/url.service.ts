import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "../../../common/link.entity";
import { Repository } from "typeorm";
import { ShortenUrlDTO } from "../dto/shortenUrlDTO";
import { nanoid } from "nanoid";
import * as moment from "moment";
import isURL from "validator/lib/isURL";
import 'dotenv/config'

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
    ) { }

    async shortenUrl(urlDto: ShortenUrlDTO) {
        const { longUrl, customUrl } = urlDto;
        if (!isURL(longUrl)) throw new BadRequestException();
        if (customUrl && (customUrl.length > 17 || customUrl.length < 5)) throw new BadRequestException();
        const currentDate = new Date();

        const baseUrl = process.env.BASE_URL;
        try {
            const urlCode = customUrl || nanoid(6);
            
            const existingUrl = await this.linkRepository.findOneBy({ urlCode: urlCode });
            if (existingUrl && (existingUrl.urlCode === customUrl && existingUrl.expiredAt > currentDate)) {
                throw new ConflictException();
            }
            if (existingUrl && currentDate >= existingUrl.expiredAt) await this.linkRepository.delete({ urlCode: existingUrl.urlCode });
            if (existingUrl && (currentDate < existingUrl.expiredAt || existingUrl.longUrl === longUrl)) return {
                shortUrl: existingUrl.shortUrl,
                expiredAt: existingUrl.expiredAt,
            };

            const shortUrl = `${baseUrl}/${urlCode}`;
            const expiredDate = moment(currentDate).add(5, 'years').toDate();

            const url = this.linkRepository.create({
                longUrl: longUrl,
                shortUrl: shortUrl,
                urlCode: urlCode,
                createdAt: currentDate,
                expiredAt: expiredDate,
            });
            await this.linkRepository.save(url);
            return {
                shortUrl: shortUrl,
                expiredAt: expiredDate,
            };
        } catch (error) {
            throw error;
        }
    }

    async redirect(urlCode: string) {
        try {
            const currentDate = new Date();
            const url = await this.linkRepository.findOneBy({ urlCode: urlCode });
            if (!url) throw new NotFoundException();
            if (url && currentDate >= url.expiredAt) {
                await this.linkRepository.delete({ urlCode: url.urlCode });
                throw new NotAcceptableException();
            }
            return url.longUrl;
        } catch (error) {
            throw error;
        }
    }
}