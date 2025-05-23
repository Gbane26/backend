import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import { PrismaService } from '../../PrismaService'; 
import { BadRequestException } from '@nestjs/common';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    try {
      if (!dto.name) {
        throw new BadRequestException('The task name is required');
      }
  
      if (dto.id) {
        return await this.prismaService.task.update({
          where: { id: dto.id },
          data: { name: dto.name },
        });
      }
  
      return await this.prismaService.task.create({
        data: { name: dto.name },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to save task: ${error.message}`);
    }
  }
  
}
