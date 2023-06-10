import { Module } from '@nestjs/common';
import { MainServiceModule } from '../main-service/main-service.module';
import { AuthService } from './auth.service';

@Module({
  imports: [MainServiceModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
