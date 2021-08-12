import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { AlipayController } from './alipay.controller';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule, TagModule, ArticleModule],
  controllers: [AlipayController],
})
export class AlipayModule {}
