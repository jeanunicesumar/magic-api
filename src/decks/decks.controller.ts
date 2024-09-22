import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';

@Controller('decks')
export class DecksController {

  constructor(private readonly service: DecksService) {}

  @Get('/generate')
  public async generate(@Query('cache') cache: string = 'true'): Promise<Deck> {
    return await this.service.generate(cache);
  }

  @Get('/generate/json')
  public async generateJson(@Res() response: Response,  @Query('cache') cache: string = 'true'): Promise<void> {

    const json: string = await this.service.generateJson(cache);

    const filePath: string = path.join(__dirname, 'deck.json');
    fs.writeFileSync(filePath, json);

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment; filename="deck.json"');

    return response.sendFile(filePath);
  }

  @Post('/populate/cards')
  public async populate(): Promise<void> {
    this.service.populate();
  }

  @Post('validate/json')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 100000 }),
      new FileTypeValidator({ fileType: 'application/json' }),
    ],
  })) file: Express.Multer.File): Promise<string> {
    return this.service.validateJson(file)
  }


  @Post()
  public async create(@Body() createDeckDto: CreateDeckDto, userId: string): Promise<void> {
    return this.service.create(createDeckDto, userId);
  }

  @Get()
  public async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.service.update(id, updateDeckDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
  
}
