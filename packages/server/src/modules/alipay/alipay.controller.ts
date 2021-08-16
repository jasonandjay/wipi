import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import { ArticleService } from '../article/article.service';

// 普通公钥模式
const alipaySdk = new AlipaySdk({
  // 参考下方 SDK 配置
  appId: '2016100200643701',
  privateKey:
    'MIIEowIBAAKCAQEAn+DEDo6fLmpf6v4kreuIsr71MA97TD10/CKCsJENvNismLK+QU5LRp5wnkCxeSwz0thYAwrLk5pbYUj/N5svFalFPMLuy31EQ4TuJmKo3qwqYBYTV2hAEoyc3GKD5GwxGjtwULTT+1HL//BHuG99n7tVma5e5jPn8x8zBnVczppvikcLy69lNuqLPsuZnmQeF3sCDe4zplkEaodUnOfDgRnO8EWBcNJEcl1JvC66T5KYc4Hypfxn8z/LNGECsYbF/9XW512po0Hd+tVE35bM+ohhba+nQOoE6dbJWrZWjW4JogF0qX31nqeZG7010XKVpikT0KiEAE1gL/NK+bYr6wIDAQABAoIBAQCcrgc1ROwW7sSlZP7JOsQyeBWNTf7FTo0w8xkktGLEKYur8a+mDHaU9HzlefzzBTCcdsx53sB3HJRlGMaU1g4kqkhiLZ8b6N1XVhSVpaZc4lh85eV6iX4RL6AiEqGy35yXWpzNWwlLiHPllLKUux5fxZU0EMCL1V6A0piMwcN77CzAgX+0oxThhkDWZOdNaEl5SFRP/A+5WlkWzI65KJ7T8diFf8QUOQKYa+2YxAI8+YO8n2esXJoJmv64hplCHbum7k94MSffH4eZ52O3kqlv5GNADKpfepUofFh7KhSK7wiSmjmLX1H2Vz2QDhNcnF7AkyNCHs7o/0+UJ/1njqtBAoGBAM3a5U0tGmPjyIdyy25PXaGIyWceBjfbBZY38p2STQnGNQWqFIJ9uZO8t4k4DYsmJZUZQ5p6sjlG2NXEhFD/uudCzfZHwLPsA6kPzM94ipfGnO8u8kiKu2UzQX+pIcZZdHXLIjDF5qjJjrYJwd65xlfmSpYAZDhUo2MfGIRbVfY7AoGBAMbSvnLKaoZtpIlWtj1Mx2bcF96mFdrRKTe+yo0BykcToCuwdHqyWEEpZ5RZbQ5o18b5IkY7vhlxjs8HzuliDM08z8s7ptASVOxwt43Gz99yig6/Jo6M1hgNT5YMzMo31cEEa4uU24q0CoezIE7YyrxvMcYnLv+o5ZuSfplfS1YRAoGAP5GPKcv50ErxC9LJO2FK2q0w9KTy6qC6Eu9n/nzFSXVpvjwNZVaJzjOCwd8LX6MCDA7nL3cgPkvAfhLXgWPXRb79d0YlHeqOHtEAQDlLIx90KvBmZTxiLhgr685A3c2WByIZhtI2Ln0/krtkoPDhbRdyhOvOBw8r/VoG6iiCXS0CgYAjkuV8iHcS4l9EK32j7i7nWo3yymiypCXp0XtQS3ezy/EmoAXXRj3AOvZLdsyqfVvOQBk/08SprMXOiSkeXOrJdg3/4QZxyDXlsC1HcsESy92j0dPGQbC00PzibhveOqtGQ9IyQUoewSP5L7WiJevwVzzipXQlTkT21vlL298Q4QKBgHroz7OT0BRbvrHsjbMMpkHGE5AdgZs1mcnAQTIptDBqYeoAUWAoPNQPG/AIvKOW4FwwdurYoRB0h477aNb/lz0/nLILL0cU7aZ/XVXlbLZtcxUYZUpi1y7hD+09zZs9lmfjYotNPC97pxPkrnr9rmwvneM0BiODF/Bs5x/CvsLs', // 可设置AES密钥，调用AES加解密相关接口时需要（可选）
  encryptKey: 'uqKvuBYoDnrlbX0KQFZqqg==',
});

@Controller('alipay')
export class AlipayController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 创建支付订单
   */
  @Post('/create')
  async create(@Body() body) {
    console.log('body...', body);
    const formData = new AlipayFormData();
    // 解构参数
    const {
      id,
      totalAmount = '0.01',
      subject = '文章付费',
      // notifyUrl = 'http://123.206.55.50:11000/alipay/notify',
      notifyUrl = 'https://creationapi.shbwyz.com/api/alipay/notify',
    } = body;
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    formData.addField('app_id', '2016100200643701');
    formData.addField('appID', '2016100200643701');
    formData.addField('notifyUrl', notifyUrl);
    formData.addField('bizContent', {
      orderId: id,
      outTradeNo: id.replace(/-/gi, '_'),
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount,
      subject,
      body: body.body,
    });

    const result = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData });
    console.log('result...', result);
    return result;
  }

  /**
   * 支付回调接口
   */
  @Post('/notify')
  async notify(@Body() body) {
    console.log('notify...', body);
    if (body.notify_time && body.trade_status === 'TRADE_SUCCESS') {
      this.articleService.updatePay(body.out_trade_no);
    }
  }
}
