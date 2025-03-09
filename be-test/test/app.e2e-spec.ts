import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { OriginalLinkDTO } from 'src/modules/url/dto/originalLinkDTO';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../src/common/link.entity';
import 'dotenv/config'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let linkRepository: Repository<Link>;
  const baseUrl = process.env.BASE_URL;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    linkRepository = app.get<Repository<Link>>(getRepositoryToken(Link));
  });

  it('Database Initialized', async () => {
    expect(linkRepository).toBeDefined();
  });
  it('/link (POST) without custom code', async () => {
    const payload: OriginalLinkDTO = {
      link: 'https://www.google.com',
      custom_url: null
    };
    return await request(app.getHttpServer())
      .post('/link')
      .send(payload)
      .expect(201);
  });

  it('/link (POST) with custom code', async () => {
    const payload: OriginalLinkDTO = {
      link: 'https://www.youtube.com',
      custom_url: 'gGuRfLGsvAFFxArv'
    };
    return await request(app.getHttpServer())
    .post('/link')
    .send(payload)
    .expect(201);
    
  });

  it('/link (POST) with invalid code', async () => {
    const payload: OriginalLinkDTO = {
      link: 'https://www.youtube.com',
      custom_url: 'invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid'
    };
    return await request(app.getHttpServer())
      .post('/link')
      .send(payload)
      .expect(400);

  });

  it('/:code (get)', async () => {
    const link = linkRepository.create(
      {
        id: 'ded8e8c3-fd6a-42a7-a69d-0d206f7adf2a',
        createdAt: new Date(),
        expiredAt: new Date(),
        longUrl: 'https://www.youtube.com',
        shortUrl: `${baseUrl}/rkITmClieBiuroQy`,
        urlCode: 'rkITmClieBiuroQy'
      }
    );
    await linkRepository.save(link);
    const payload = 'rkITmClieBiuroQy'
    request(app.getHttpServer())
      .get(`/${payload}`)
      .expect(200);
  });

  it('/:code (get) not found', async () => {
    const testLink = 'rjotkc';
    await linkRepository.delete({urlCode: testLink});
    const payload = 'rjotkc'
    request(app.getHttpServer())
      .get(`/${payload}`)
      .expect(404);
  });

  it('/:code (get) expired', async () => {
    const link = linkRepository.create(
      {
        id: 'b2c998da-b819-4014-bf56-cf9119501c58',
        createdAt: new Date(2020, 1),
        expiredAt: new Date(2020, 2),
        longUrl: 'https://www.youtube.com',
        shortUrl: `${baseUrl}/rkITmClieBiuroQy`,
        urlCode: 'LtdznRLeRPVSzNDR'
      }
    );
    await linkRepository.save(link);
    const payload = 'LtdznRLeRPVSzNDR'
    request(app.getHttpServer())
      .get(`/${payload}`)
      .expect(410);
  });

  afterEach(async () => {
    await app.close();
  })

});
