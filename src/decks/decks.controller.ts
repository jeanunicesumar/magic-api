import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import { Card } from './entities/card.entity';

@Controller('decks')
export class DecksController {

  constructor(private readonly decksService: DecksService) {}

  @Get('/generate')
  public async generate(): Promise<Deck> {
    return await this.decksService.generate();
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
