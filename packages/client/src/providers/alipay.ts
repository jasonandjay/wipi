import { httpProvider } from './http';

export class AlipayProvider {
  /**
   * 创建订单
   */
  static async createPay(params): Promise<string> {
    return httpProvider.post('/alipay/create', params);
  }
}