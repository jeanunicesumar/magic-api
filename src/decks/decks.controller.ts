import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';

@Controller('decks')
export class DecksController {

  constructor(private readonly decksService: DecksService) {}

  @Get('/generate')
  public async generate(@Query('cache') cache: string = 'true'): Promise<Deck> {
    return await this.decksService.generate(cache);
  }

  @Get('/generate/json')
  public async generateJson(@Res() response: Response,  @Query('cache') cache: string = 'true'): Promise<void> {

    const json: string = await this.decksService.generateJson(cache);

    const filePath: string = path.join(__dirname, 'deck.json');
    fs.writeFileSync(filePath, json);

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment; filename="deck.json"');

    return response.sendFile(filePath);
  }

  @Post('/populate/cards')
  public async populate(): Promise<void> {
    this.decksService.populate();
  }

  @Post()
  public async create(@Body() createDeckDto: CreateDeckDto, userId: string): Promise<void> {
    return this.decksService.create(createDeckDto, userId);
  }

  @Get()
  public async findAll() {
    return this.decksService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.decksService.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(id, updateDeckDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.decksService.remove(id);
  }
  
}
