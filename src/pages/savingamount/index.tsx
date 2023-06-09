import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import * as Icon from '@/assets/Icons';
import { useSearchDispatch, useSearchStore } from '@/components/SearchProvider';
import { BottomButton, DefaultTagStyle } from '@/components/common/buttons';
import { DefaultInput } from '@/components/common/input';
import * as Layout from '@/components/common/layout';
import SavingAmountOptions from '@/components/savingamount/SavingAmountOptions';
import * as Style from '@/components/savingamount/styles';
import { InputRegExp } from '@/constant';
import * as Font from '@/styles/font';

const NoticeModal = dynamic(() => import('@/components/modal/NoticeModal'), { ssr: false });

const SavingAmount = () => {
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [typingModal, setTypingModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const store = useSearchStore();
  const dispatch = useSearchDispatch();
  const router = useRouter();

  useEffect(() => inputRef?.current?.focus(), []);

  if (store.product.title === undefined || store.product.title === '') {
    return (
      <NoticeModal
        onClose={() => router.replace('/list')}
        message='물품이 제대로 선택되지 않았습니다.'
      />
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numberReg = InputRegExp.numberAndComma;
    const emptystringReg = InputRegExp.emptyString;

    if (numberReg.test(value) || emptystringReg.test(value)) {
      setAmount(Number(value.replaceAll(',', '')).toLocaleString('ko-KR'));
    } else setShowModal(true);
  };

  const handleInputSubmit = () => {
    if (!amount) {
      setTypingModal(true);
      return;
    }
    dispatch({
      type: 'ADD_SAVINGAMOUNT',
      item: Number(amount.replaceAll(',', '')),
    });
    router.push('/result');
  };

  return (
    <Layout.VStack margin='103px 0 0' height='100%' justifyContent='space-around'>
      <Layout.VStack alignItems='flex-start' gap='16px'>
        <Layout.HStack alignItems='center' gap='16px'>
          <Style.Span> {`${store.product.price?.toLocaleString()} ₩`} </Style.Span>
          <Font.Medium>인</Font.Medium>
        </Layout.HStack>

        <Layout.HStack alignItems='center' gap='16px'>
          <Style.Span> {store.product.title} </Style.Span>
          <Font.Medium>을(를) 갖기 위해</Font.Medium>
        </Layout.HStack>

        <Layout.HStack alignItems='center' gap='16px'>
          <Style.Span>한달</Style.Span>
          <Font.Medium>동안</Font.Medium>
        </Layout.HStack>

        <Layout.HStack alignItems='center' gap='16px'>
          <AmoutInput onChange={handleInputChange} resetAmount={setAmount} amount={amount} />
          <Font.Medium>원을 모은다면?</Font.Medium>
        </Layout.HStack>
        <SavingAmountOptions productPrice={store.product.price || 0} setAmount={setAmount} />
      </Layout.VStack>
      <Layout.Flex onClick={handleInputSubmit} justifyContent='center'>
        <BottomButton>다음으로</BottomButton>
      </Layout.Flex>

      {showModal && (
        <NoticeModal onClose={() => setShowModal(false)} message='숫자만 입력해주세요!' />
      )}
      {typingModal && (
        <NoticeModal onClose={() => setTypingModal(false)} message='모든 칸을 채워주세요!' />
      )}
    </Layout.VStack>
  );
};

export default SavingAmount;

interface AmountInput {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetAmount: Dispatch<SetStateAction<string>>;
  amount: string;
}

const AmoutInput = ({ onChange, resetAmount, amount }: AmountInput) => {
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef?.current?.focus(), []);

  return (
    <Style.InputBorder alignItems='center' focus={isFocus}>
      <Style.Input
        onChange={e => onChange(e)}
        pattern='[0-9]*'
        inputMode='decimal'
        value={amount}
        ref={inputRef}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />

      <Style.ButtonStyleInit type='button' onClick={() => resetAmount('0')}>
        <Style.InitializationIcon />
      </Style.ButtonStyleInit>
    </Style.InputBorder>
  );
};
