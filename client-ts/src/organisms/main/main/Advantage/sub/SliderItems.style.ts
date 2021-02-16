import styled from 'styled-components';

export type Props = {
  zoomFactor: number;
  slideMargin: number;
  visibleSlides: number;
  className: string;
};

const StyledSliderItem = styled.div<Props>`
  margin: 0 ${(props) => props.slideMargin}px;
  transition: transform 500ms ease;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  transform: scale(1);
  user-select: none;
  flex: 0 0
    calc(
      100% / ${(props) => props.visibleSlides} -
        ${(props) => props.slideMargin * 2}px
    );
  :hover {
    transform: scale(${(props) => props.zoomFactor / 100 + 1}) !important;
  }
  :hover ~ * {
    transform: translateX(${(props) => `${props.zoomFactor / 2}%`}) !important;
  }
  &.left {
    transform-origin: left;
    :hover ~ * {
      transform: translateX(${(props) => `${props.zoomFactor}%`}) !important;
    }
  }
  &.right {
    transform-origin: right;
    :hover ~ * {
      transform: translateX(0%) !important;
    }
  }
`;

export default StyledSliderItem;
