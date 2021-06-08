import React, {useMemo, useCallback} from 'react';
import {Play, Search, Maximize} from './Icons';
import {useSelector} from 'react-redux';
import {
  busySelector,
  durationSelector,
  dimensionSelector,
  usePreviewHandler,
  useRenderHandler
} from '../renderer';
import {AutoSizer} from 'react-virtualized';
import {WithKeplerUI} from '@hubble.gl/react';
import {Display} from '../display';
import {useCameraKeyframes, usePrepareCameraFrame} from '../timeline/hooks';
import {nearestEven} from '../../utils';

const PreviewBottomToolbar = ({playing, onPreview}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#232426',
        padding: '12px'
      }}
    >
      <Search />
      <div onClick={onPreview}>
        <Play />
      </div>
      <Maximize />
    </div>
  );
};

const DisplayOverlay = ({rendererBusy, currentTime, duration, width, height}) => {
  const loaderStyle = {
    display: rendererBusy === 'rendering' ? 'flex' : 'none',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    width: `${width}px`,
    height: `${height}px`,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const percent = useMemo(() => {
    return Math.floor((currentTime / duration) * 100).toFixed(0);
  }, [currentTime, duration]);

  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <div className="loader" style={loaderStyle}>
          <LoadingSpinner />
          <div
            className="rendering-percent"
            style={{color: 'white', position: 'absolute', top: '175px'}}
          >
            {percent} %
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
};

const AutoSizeStage = ({children}) => {
  const dimension = useSelector(dimensionSelector);

  const getMapDimensions = useCallback(
    (availableWidth, availableHeight) => {
      const scale = Math.min(availableWidth / dimension.width, availableHeight / dimension.height);

      return {
        mapWidth: nearestEven(dimension.width * scale, 0),
        mapHeight: nearestEven(dimension.height * scale, 0)
      };
    },
    [dimension]
  );

  return (
    <AutoSizer>
      {({width, height}) => {
        const {mapWidth, mapHeight} = getMapDimensions(width, height);
        return children({
          mapHeight,
          mapWidth,
          availableHeight: nearestEven(height, 0),
          availableWidth: nearestEven(width, 0)
        });
      }}
    </AutoSizer>
  );
};

const DisplayBox = ({height, width, children}) => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width, height}}>
    {children}
  </div>
);

export const PreviewPanel = ({
  getCameraKeyframes = undefined,
  getKeyframes,
  prepareFrame,
  deckProps = undefined,
  staticMapProps = undefined
}) => {
  const rendererBusy = useSelector(busySelector);
  const duration = useSelector(durationSelector);

  if (!getCameraKeyframes) {
    getCameraKeyframes = useCameraKeyframes();
  }

  const prepareCameraFrame = usePrepareCameraFrame();
  const combinedPrepareFrame = useCallback(
    scene => {
      prepareFrame(scene);
      prepareCameraFrame(scene);
    },
    [prepareFrame]
  );

  const onPreview = usePreviewHandler({getCameraKeyframes, getKeyframes});
  const onRender = useRenderHandler({getCameraKeyframes, getKeyframes});

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{flex: 1, position: 'relative'}}>
        <AutoSizeStage>
          {({mapHeight, mapWidth, availableHeight, availableWidth}) => (
            <DisplayBox width={availableWidth} height={availableHeight}>
              {/* <div style={{width: mapWidth, height: mapHeight, backgroundColor: 'green'}} /> */}
              <Display
                width={mapWidth}
                height={mapHeight}
                prepareFrame={combinedPrepareFrame}
                deckProps={deckProps}
                staticMapProps={staticMapProps}
              />
              <DisplayOverlay
                rendererBusy={rendererBusy}
                duration={duration}
                width={availableWidth}
                height={availableHeight}
              />
            </DisplayBox>
          )}
        </AutoSizeStage>
      </div>
      <PreviewBottomToolbar playing={Boolean(rendererBusy)} onPreview={onPreview} />
      <button onClick={onRender}>Render</button>
    </div>
  );
};