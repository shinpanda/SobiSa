import { useRef, useState } from 'react';

import { toSvg } from 'html-to-image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { DownloadIcon } from '@/assets/Icons';
import Portal from '@/components/Portal';
import { Background, ModalContainer } from '@/components/common/Modal';
import { CloseButton, ShareButton } from '@/components/common/buttons';
import Certificate from '@/components/results/Certificate';
import ShareButtons from '@/components/results/ShareButtons';
import useModalAnimation from '@/hooks/useModalAnimation';

interface CertificateAndShareModalProps {
  onClose: () => void;
}

const createImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.decode = async () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
};

const toPng = async (node: HTMLDivElement) => {
  const { offsetWidth: width, offsetHeight: height } = node;
  const multiple = 2;

  const svgDataUrl = await toSvg(node);

  const canvas = document.createElement('canvas');
  const offscreenCanvas = canvas.transferControlToOffscreen();
  offscreenCanvas.width = width * multiple;
  offscreenCanvas.height = height * multiple;
  const context = offscreenCanvas.getContext('2d', { alpha: false });
  if (context === null) return '';

  const img: HTMLImageElement = await createImage(svgDataUrl);
  let done = false;
  const onFrame = () => {
    context.drawImage(img, 0, 0, width * multiple, height * multiple);
    if (canvas.toDataURL('image/png', 1.0).length > 204800) done = true;
    if (!done) {
      window.requestAnimationFrame(onFrame);
    }
  };
  onFrame();

  return new Promise((resolve: (url: string) => void) => {
    setTimeout(() => {
      const url = canvas.toDataURL('image/png', 1.0);
      resolve(url);
    }, 500);
  });
};

const CertificateAndShareModal = ({ onClose }: CertificateAndShareModalProps) => {
  const { show, animationAfterClose } = useModalAnimation(onClose);
  const [imgData, setImgData] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getImgData = () => {
    if (imgData) return imgData;
    if (ref.current === null) {
      return '';
    }
    return toPng(ref.current);
  };

  const certificateDownload = async () => {
    const dataUrl = await getImgData();
    const link = document.createElement('a');
    link.download = '임명장.png';
    link.href = dataUrl;
    link.click();
    setImgData(dataUrl);
  };

  const redirectHome = () => {
    router.push({ pathname: '/' });
  };

  return (
    <Portal>
      <Background show={show} />
      <Container show={show} id='container'>
        <Wrapper>
          <CertificateAndShareWrapper>
            <CloseButton style={{ alignSelf: 'flex-end' }} onClick={animationAfterClose} />
            <Certificate ref={ref} />
            <ShareButtons imgData={imgData} />
            <ModalButton onClick={certificateDownload}>
              이미지 저장하기! <DownloadIcon />
            </ModalButton>
            <ModalGrayButton onClick={redirectHome}>홈으로 돌아가기</ModalGrayButton>
          </CertificateAndShareWrapper>
        </Wrapper>
      </Container>
    </Portal>
  );
};
export default CertificateAndShareModal;

const Container = styled(ModalContainer)`
  background-color: transparent;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  padding: 0;
  padding-top: 10vh;
  padding-bottom: 0;

  justify-content: flex-start;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 4px;
    border-radius: 2px;
    background-clip: padding-box;
    border: 10px solid transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[2]};
  }
`;

const CertificateAndShareWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;
`;

const ModalButton = styled(ShareButton)`
  margin-top: -12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ModalGrayButton = styled(ModalButton)`
  color: ${props => props.theme.colors.gray[4]};
  background: ${props => props.theme.colors.gray[1]};
`;
