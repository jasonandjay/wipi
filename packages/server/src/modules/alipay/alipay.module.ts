import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ArticleModule } from '../article/article.module';
import { AlipayController } from './alipay.controller';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';

const passModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtModule = JwtModule.register({
  secret: 'wipi',
  signOptions: { expiresIn: '4h' },
});

@Module({
  imports: [CategoryModule, TagModule, ArticleModule],
  controllers: [AlipayController],
})
export class AlipayModule {}
