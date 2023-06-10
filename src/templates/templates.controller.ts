import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Get,
  UseGuards,
  Req
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredPipe } from '../common/pipes/file-required.pipe';
import { CreateTemplateResponseDto } from './dto/response/create-template-response.dto';
import { TemplatesCrdMapper } from './mappers/templates-crd.mapper';
import { GetAllTemplatesResponseDto } from './dto/response/get-all-templates-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('/templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly responseMapper: TemplatesCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('archive'))
  @Post('/')
  public async create(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileRequiredPipe({}),
          new FileTypeValidator({
            fileType: 'application/zip'
          })
        ]
      })
    )
    archive: Express.Multer.File, // TODO: Add streaming instead of keeping buffer in memory
    @Body() dto: CreateTemplateDto
  ): Promise<CreateTemplateResponseDto> {
    const template = await this.templatesService.create(
      req.user.guid,
      archive.buffer,
      dto
    );
    return this.responseMapper.createMapper(template);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  public async findAll(
    @Req() req: Request
  ): Promise<GetAllTemplatesResponseDto> {
    const templates = await this.templatesService.findAll({
      userGuid: req.user.guid
    });
    return this.responseMapper.findAllMapper(templates);
  }
}
