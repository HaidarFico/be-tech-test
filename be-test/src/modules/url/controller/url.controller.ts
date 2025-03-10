import { BadRequestException, Body, ConflictException, Controller, Get, GoneException, Inject, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException, Param, Post, Res, UsePipes } from '@nestjs/common';
import { OriginalLinkDTO } from '../dto/originalLinkDTO';
import { UrlService } from '../services/url.service';
import { Response } from 'express';
import { CustomCodeValidationPipe } from '../pipe/customCodeValidationPipe';
import { GetLongURLDTO } from '../dto/getLongUrlDTO';

@Controller()
export class URLController {
  constructor(
    @Inject('UrlService')
    private readonly urlService: UrlService
  ) { }
  private readonly logger = new Logger(UrlService.name, { timestamp: true });

  @Post('link')
  async postShortenedLink(
    @Res() res: Response,
    @Body() originalLink: OriginalLinkDTO
  ) {
    let result: { shortUrl: string, expiredAt: Date } | null = null;
    try {
      if (originalLink.custom_url && originalLink.custom_url.length > 16) throw new BadRequestException();
      result = await this.urlService.shortenUrl(
        {
          longUrl: originalLink.link,
          customUrl: originalLink.custom_url ? originalLink.custom_url : null
        });
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.log('Code already in use', this.postShortenedLink.name);
        return res.status(409).json({
          message: 'Code already in use.',
          error: ConflictException,
          statusCode: 409,
        });
      }
      this.logger.log('Invalid Request', this.postShortenedLink.name);
      return res.status(400).json({
        message: 'Invalid Request.',
        error: BadRequestException,
        statusCode: 400,
      });
    }
    this.logger.log('Link Shortened', this.postShortenedLink.name);
    return res.status(201).json({
      message: 'Done!',
      data: result,
    });
  }

  @UsePipes(CustomCodeValidationPipe)
  @Get(':code')
  async getLongUrl(
    @Res() res: Response,
    @Param('code', CustomCodeValidationPipe)
    dto: string
  ) {
    let link = '';
    try {
      if (dto.length > 16) throw new BadRequestException();
      link = await this.urlService.redirect(dto);
    } catch (error) {
      this.logger.log('Invalid Request', this.getLongUrl.name);
      if (error instanceof NotFoundException) {
        return res.status(404).json({
          message: 'Not Found',
          error: NotFoundException,
          statusCode: 404,
        });
      }
      if (error instanceof NotAcceptableException) {
        return res.status(410).json({
          message: 'Code has expired',
          error: GoneException,
          statusCode: 410,
        });
      }
      if (error instanceof BadRequestException) {
        return res.status(400).json({
          message: 'InvalidRequest',
          error: BadRequestException,
          statusCode: 400,
        });
      }
      return res.status(500).json({
        message: 'Internal Server Error',
        error: InternalServerErrorException,
        statusCode: 500,
      });
    }
    this.logger.log('Redirected', this.getLongUrl.name);
    return res.redirect(link);
  }
}
