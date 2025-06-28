import { Controller, Post, Body, UseGuards, Req, Get, Patch, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiExcludeEndpoint, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Post('customer/register')
  async registerCustomer(@Body() dto: CreateCustomerDto) {
    return this.usersService.createCustomer(dto);
  }

  @ApiExcludeEndpoint()
  @Post('partner/register')
  async registerPartner(@Body() dto: CreatePartnerDto) {
    return this.usersService.createPartner(dto);
  }

  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile returned', schema: { example: { id: 'uuid', email: 'user@example.com', isEmailVerified: true, createdAt: '2024-01-01T00:00:00.000Z', customer: null, partner: null } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }

  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile updated', schema: { example: { id: 'uuid', email: 'user@example.com', isEmailVerified: true, createdAt: '2024-01-01T00:00:00.000Z', customer: null, partner: null } } })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', example: 'user@example.com' } } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req, @Body() updateDto: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) throw new ForbiddenException('User not found');
    return this.usersService.updateUser(user.id, updateDto);
  }

  @ApiOperation({ summary: 'Update authenticated partner profile' })
  @ApiResponse({ status: 200, description: 'Authenticated partner profile updated', schema: { example: { id: 'uuid', phone: '+1234567890', firstName: 'Ivan', lastName: 'Ivanov', avatar: 'https://...', certificates: ['https://...'], spokenLanguages: ['en', 'ru'], about: 'Опытный гид', yearsOfExperience: 5, whatsapp: '+1234567890', telegram: '@ivan' } } })
  @ApiBody({ schema: { type: 'object', properties: { phone: { type: 'string', example: '+1234567890' }, firstName: { type: 'string', example: 'Ivan' }, lastName: { type: 'string', example: 'Ivanov' }, companyName: { type: 'string', example: 'ООО Рога и Копыта' }, avatar: { type: 'string', example: 'https://...' }, certificates: { type: 'array', items: { type: 'string', example: 'https://...' } }, spokenLanguages: { type: 'array', items: { type: 'string', example: 'en' } }, about: { type: 'string', example: 'Опытный гид' }, yearsOfExperience: { type: 'number', example: 5 }, whatsapp: { type: 'string', example: '+1234567890' }, telegram: { type: 'string', example: '@ivan' } } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('partner-profile')
  async updatePartnerProfile(@Req() req, @Body() updateDto: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user || !user.partner) throw new ForbiddenException('Partner not found');
    return this.usersService.updatePartnerFields(user.partner.id, updateDto);
  }
}
