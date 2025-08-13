import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SignalsService } from './signals.service';

@Controller('signals')
export class SignalsController {
  
  constructor(private readonly signals: SignalsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.signals.create(body);
  }

  @Get()
  async findAll(@Query('deviceId') deviceId: string, @Query('from') from: string, @Query('to') to: string) {
    if (deviceId || from || to) {
      return this.signals.query({
        deviceId,
        from: from ? new Date(Number(from) || from) : undefined,
        to: to ? new Date(Number(to) || to) : undefined,
      });
    }
    return this.signals.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.signals.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.signals.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.signals.remove(id);
  }
}
