import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import { AuthGuard } from 'src/config/auth/auth.guard';
import { Role } from '../users/roles/role';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';

@Controller('decks')

export class DecksController {

  constructor(private readonly decksService: DecksService) { }
  
  @UseGuards(AuthGuard)
  @Get('/generate')
  public async generate(@Query('cache') cache: string = 'false', @Req() request: any): Promise<Deck> {
    const userId = request.decodedData?.sub;
    return await this.decksService.generate(cache, userId);
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

  @Post('/populate')
  public async populate(): Promise<void> {
    return this.decksService.populate();
  }

  @Post()
  public async create(@Body() createDeckDto: CreateDeckDto, @Req() request: any): Promise<void> {
    const userId = request.user.sub;
    return this.decksService.create(createDeckDto, userId);
  }
 
  @Get('/')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async findAll(@Query('page') page: number = 1) {
       return this.decksService.findAll(page);
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
