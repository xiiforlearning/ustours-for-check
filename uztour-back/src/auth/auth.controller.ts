import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { CompletePartnerProfileDto } from './dto/complete-partner-profile.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Request verification code for registration/login' })
  @ApiResponse({ status: 201, description: 'Verification code sent' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'type'],
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com', description: 'User email' },
        type: { type: 'string', enum: ['customer', 'partner'], example: 'partner', description: 'User type: customer или partner' }
      },
      example: {
        email: 'user@example.com',
        type: 'partner'
      }
    }
  })
  @Post('request-code')
  async requestCode(@Body() dto: RequestCodeDto, @Headers('accept-language') langHeader?: string) {
    return this.authService.requestCode(dto, langHeader);
  }

  @ApiOperation({ summary: 'Verify code for registration/login' })
  @ApiResponse({
    status: 200,
    description: 'Code verified, JWT issued or profile completion required',
  })
  @ApiBody({ type: VerifyCodeDto })
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto);
  }

  @ApiOperation({ summary: 'Complete partner profile (required fields only)' })
  @ApiResponse({ status: 200, description: 'Profile completed, SMS sent' })
  @ApiBody({ type: CompletePartnerProfileDto })
  @Post('complete-profile')
  async completeProfile(@Body() dto: CompletePartnerProfileDto) {
    return this.authService.completePartnerProfile(dto);
  }

  @ApiOperation({ summary: 'Verify partner phone with SMS code' })
  @ApiResponse({ status: 200, description: 'Phone verified, JWT issued' })
  @ApiBody({ type: VerifyPhoneDto })
  @Post('verify-phone')
  async verifyPhone(@Body() dto: VerifyPhoneDto) {
    return this.authService.verifyPhone(dto);
  }
}
