import { useEffect, useState } from 'react';

import styled from 'styled-components';

import FacebookButton from '@/components/common/share/FacebookButton';
import KakaoButton from '@/components/common/share/KakaoButton';
import LinkButton from '@/components/common/share/LinkButton';
import NativeShareButton from '@/components/common/share/NativeShareButton';
import TwitterButton from '@/components/common/share/TwitterButton';
import { convertDataUrlToFile } from '@/components/results/ConvertImage';
import { sharedMessage } from '@/constant';

interface ShareButtonsProps {
  imgData: string;
}

const ShareButtons = ({ imgData }: ShareButtonsProps) => {
  const [NativeShareFile, setNativeShareFile] = useState<File | null>(null);
  const { title = '', url = '' } = sharedMessage;

  useEffect(() => {
    try {
      (async () => {
        const file = await convertDataUrlToFile(imgData);
        if (file && navigator.share !== undefined) {
          setNativeShareFile(file);
        }
      })();
    } catch (e) {
      console.error('convertDataUrlToFile error', e);
    }
  }, [imgData]);

  return (
    <ShareButtonsContainer>
      {NativeShareFile ? (
        <NativeShareButton sharedMessage={{ ...sharedMessage, files: [NativeShareFile] }} />
      ) : (
        <>
          <FacebookButton pageUrl={url} />
          <TwitterButton sendText={title} pageUrl={url} />
          <KakaoButton webUrl={url} />
          <LinkButton pageUrl={url} />
        </>
      )}
    </ShareButtonsContainer>
  );
};

export default ShareButtons;

const ShareButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
`;
