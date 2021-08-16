import React from 'react';
import { Modal } from 'antd';
import { AlipayProvider } from '@/providers/alipay';

import { default as Router } from 'next/router';

export interface AliPayProps {
  totalAmount: string;
  id: string;
}

export const AliPay: React.FC<AliPayProps> = ({ totalAmount, id }) => {
  console.log('totalAmount...', totalAmount);
  const pay = async () => {
    const result = await AlipayProvider.createPay({
      totalAmount,
      id,
    //   notifyUrl: 'http://123.206.55.50:11000/alipay/notify',
    });
    console.log('result...', result);

    if (result) {
      window.location.href = result;
    }
  };

  return (
    <Modal
      title="确认以下收费信息"
      width={400}
      visible={true}
      bodyStyle={{
        display: 'flex',
        justifyContent: 'center',
        overflowX: 'hidden',
      }}
      onCancel={(e) => {
        Router.push('/');
      }}
      onOk={() => pay()}
      okText={'立即支付'}
      cancelText={'取消'}
      transitionName={''}
      maskTransitionName={''}
    >
      <p>
        支付金额：<span>¥{totalAmount}</span>
      </p>
    </Modal>
  );
};
