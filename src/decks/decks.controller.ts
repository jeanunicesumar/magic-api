import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
const cluster = require('node:cluster');

@Controller('decks')

export class DecksController {
  constructor(private readonly service: DecksService) {}
 
  @UseGuards(AuthGuard)
  @Get('/generate')
  public async generate(@Query('cache') cache: string = 'true', @Req() request: any): Promise<Deck> {
    const userId = request.decodedData?.sub;
    return await this.service.generate(cache, userId);
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

  @Get('/list-user-decks')
  @UseGuards(AuthGuard)
  public async listDecks(@Req() req: any): Promise<Deck[]> {
      const userId = req.decodedData?.sub;
      return await this.service.listDecks(userId);
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
  public async create(@Body() createDeckDto: CreateDeckDto, @Req() request: any): Promise<void> {
    const userId = request.user.sub;
    return this.service.create(createDeckDto, userId);
  }
 

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async findAll(@Query('page') page: number = 1) {
       return this.service.findAll(page);
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