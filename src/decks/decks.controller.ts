import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('decks')
export class DecksController {

  constructor(private readonly decksService: DecksService) {}

  @Get('/generate')
  public async generate(): Promise<Deck> {
    return await this.decksService.generate();
  }

  @Get('/generate/json')
  public async generateJson(@Res() response: Response): Promise<void> {

    const json: string = await this.decksService.generateJson();

    const filePath: string = path.join(__dirname, 'deck.json');
    fs.writeFileSync(filePath, json);

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment; filename="deck.json"');

    return response.sendFile(filePath);
  }

  @Post()
  public async create(@Body() createDeckDto: CreateDeckDto): Promise<void> {
    return this.decksService.create(createDeckDto);
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
