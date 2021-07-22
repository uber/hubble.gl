import styled from 'styled-components';
import {DEFAULT_ROW_GAP, DEFAULT_PADDING, DEFAULT_SETTINGS_WIDTH} from './constants';

export const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

export const StyledLabelCell = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 400;
  font-size: 11px;
`;

export const StyledValueCell = styled.div`
  align-self: center;
  color: ${props => props.theme.textColor};
  font-weight: 500;
  font-size: 11px;
  padding: 0 12px;
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 88px auto;
  grid-template-rows: repeat(
    ${props => props.rows},
    ${props => (props.rowHeight ? props.rowHeight : '34px')}
  );
  grid-row-gap: ${DEFAULT_ROW_GAP}px;
`;

export const ButtonGroup = styled.div`
  display: flex;
`;

export const ModalContainer = styled.div`
  position: relative;
`;

export const PanelCloseInner = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${DEFAULT_PADDING}px ${DEFAULT_PADDING}px 0 ${DEFAULT_PADDING}px;
`;

export const StyledTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  padding: 0 ${DEFAULT_PADDING}px 16px ${DEFAULT_PADDING}px;
`;

export const PanelBodyInner = styled.div`
  padding: 0 ${DEFAULT_PADDING}px;
  padding-bottom: ${DEFAULT_PADDING}px;
  display: grid;
  grid-template-columns: ${props => props.exportVideoWidth}px ${DEFAULT_SETTINGS_WIDTH}px;
  grid-template-rows: auto;
  grid-column-gap: ${DEFAULT_ROW_GAP}px;
  margin-bottom: ${DEFAULT_ROW_GAP}px;
`;

export const Panel = styled.div`
  width: ${props =>
    props.exportVideoWidth + 2 * DEFAULT_PADDING + DEFAULT_ROW_GAP + DEFAULT_SETTINGS_WIDTH}px;
`;
