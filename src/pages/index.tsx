import React from 'react';

import styled from 'styled-components';

import * as Icon from '@/assets/Icons';
import { MainImage } from '@/assets/Images';
import { Indicator01 } from '@/assets/Indicators';
import * as SocialIcon from '@/assets/SocialIcons';
import SearchInput from '@/components/SearchInput';
import MarginBox from '@/components/common/marginBox';
import * as Font from '@/styles/font';

function Home() {
  return (
    <Container>
      <Font.Medium>더 쉽고 재미있게</Font.Medium>
      <Font.Large>소비사의 계산기를 사용해보세요!</Font.Large>
      <ImageBox>
        <MainImage />
      </ImageBox>
      <SearchInput />
      <LinkBox>
        <SocialIcon.FaceBookIcon />
        <SocialIcon.TwitterIcon />
        <SocialIcon.KakaoIcon />
        <Icon.LinkIcon />
      </LinkBox>
      <MarginBox margin='169px' />
      <Indicator01 />
    </Container>
  );
}
export default Home;

const ImageBox = styled.div`
  margin: 16px 0px;
`;
const LinkBox = styled.div`
  margin-top: 66px;
  display: flex;
  gap: 8px;
`;
const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
