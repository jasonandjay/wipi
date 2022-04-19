import { Controller, Post, Body } from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import { ArticleService } from '../article/article.service';

// 普通公钥模式
const alipaySdk = new AlipaySdk({
  // 参考下方 SDK 配置
  appId: '2016100200643701',
  privateKey:
    'MIIEowIBAAKCAQEAuGnGSrzCvtoP0/Cpv6gjUvnXrmWyGqkSVczAr/XMGRjswktZfXrWcFddwWSXoTSr6S2rYw/l5GmZETukvSztjQY7dWBSaKwhhTRymUaB9Dj0f4OX493/kiRhWLmPlf2vRzjGnfBdd9K4VhGzTTkXGT5x9aKZduHdI6kmKWCaEY46jpXf513eUjwO+UhltVr9o4ut/NeqeTGTn9/4jNY/YriXDA4FamXrscnwHN6rIDD95rk//4ZrtAghT39Rfvf8sNZLldGH7SQLrpCyCAO0dYKEA1cu2rHfvhawXFzCDQenCgWDMaNgbIgII8Z5UnwHjuPg2Jv+smnC2OJ5yIvTrwIDAQABAoIBAQCCdbnlB3KSB7woyFmeD3ml6r/tTV5ZRACHmEk8chvIKXzc2uddQLhRU00tUld+oL95P2i+tPGCzD2QFmyttAn9uUn4+IJ0MEmqbXcg/eNTfbNiPhsHBfcWUQxY8zUj/AqyzPSdqPzGltj3cqAw4lF391gxWK1Oj+ycnL41iXSVM56hVJ1lt+IJjyLn5yP5b3kYbGgBjn8tImjN2aOimEsMr3GPd1XDlNQH7XBCwNzM9Y8+0xciFIc+BNGTO3dw4TfaYoYHbz4MUwybTkWLVrOHJA2SQYVz5HgQ7kTrFOQH409p9+3JcG6c1vFs5ppZYFF4/f48q3P8Ev8D8YhxpvGhAoGBAPSESBS/DrdCDV7InYaSTLb5Zur7dlEuWzQ0Iv7wEGNHylhrH5SqaFS1qbUTm8Gp2Tn6343sz3GfkGDrX8JAU2w3GKoefjbJMWrNAXf15RVIIVFN9yRFD5zs688FISO1sDPYywqgj/DywXeVIF5JwHD7NDnKZrU+g7Qdi2jDK6o/AoGBAMES5Oq+tMkLMgPl5KJcz0g9JirZ5dHuZt52HzgPlyHPgJPxrjYdt5xQicgE7oWIVJKa+RYdAku8jUQe5e/+N9mlIh3pxWWgzBDO8lorlYaOn6kXQcBPgma+g3b98BqYkSCdVEqhTu+4S021IQhX7RAeHHdiLAdu24WRp3h0+hqRAoGAN4oMbVnwV8PTEaJz1WtJrY38yIcRmuLyqGrnQAz7S/G0jlzWsYf7ZrJUt+KaUGTqCHdpa+1MOTzLKJiOCatex4fEPG/srzkH1oB2Qu9Bd5IIr1UMO9rL7xMJhN5fZqMQQNaPV/ycdVhOhYED9ya9ZWxJso68wZJPjAvh7IvYUTUCgYAtlLhWcw9bJzl3kh6X9jE5bLZGB4sqNI40ls5n/cZARSylwLjQLdPbI2hjwEZPYBAXTF7hyZdxKeJv4puGPQ4SY9naFgZ0J7IFhdXRU9jJG4K1+LedHyg5+WAwB2NX5AzfFkWAGPT5wxiED+7seVWOKI2v4Y1jc9h/gBN5bKRfAQKBgG62gofCXoBXUWrBQ+wLuFo4+AeCnJAlN9hn89m9DtavSBJV+OGP9luol40ZnFRvlMEIU1plbaSRtmxuwpfgw4/LJKh3s4GV5ix87KT2ZmNsRbwxxGeCMnDhhP/pISiWErPD0sOReMSWyr41v7rohWmd83/FxUWU/WOPgxlo7bWo',
  encryptKey: 'uqKvuBYoDnrlbX0KQFZqqg==',
  gateway: 'https://openapi.alipaydev.com/gateway.do',
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
    if (body.notify_time && body.trade_status === 'TRADE_SUCCESS') {
      this.articleService.updatePay(body.out_trade_no);
    }
  }
}
