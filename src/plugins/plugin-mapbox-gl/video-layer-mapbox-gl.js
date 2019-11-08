import Promise from 'utils/promise';

import { replace } from 'utils/query';
import { MapboxLayer } from '@deck.gl/mapbox';

import TileLayer from './custom-layers/tile-layer';

const VideoLayer = layerModel => {
  const { layerConfig, params, sqlParams, id } = layerModel;

  const layerConfigParsed =
    layerConfig.parse === false
      ? layerConfig
      : JSON.parse(replace(JSON.stringify(layerConfig), params, sqlParams));

  const { body } = layerConfigParsed || {};
  const { minzoom, maxzoom } = body || {};

  const layer = {
    id,
    type: 'custom',
    layers: [
      {
        id: `${id}-video-bg`,
        type: 'background',
        paint: {
          'background-color': 'transparent'
        },
        ...(maxzoom && {
          maxzoom
        }),
        ...(minzoom && {
          minzoom
        })
      },
      new MapboxLayer({
        id: `${id}-video`,
        type: TileLayer,
        // renderSubLayers: ({ id, data, tile, visible, zoom }) => {
        //   if (data && data.src) {
        //     return new BitmapLayer({
        //       id,
        //       image: data.src,
        //       bounds: tile.bbox,
        //       visible,
        //       zoom
        //     });
        //   }
        //   return null;
        // },
        minZoom: minzoom,
        maxZoom: maxzoom,
        opacity: layerModel.opacity
      })
    ]
  };

  return new Promise((resolve, reject) => {
    if (layer) {
      resolve(layer);
    } else {
      reject(new Error('error in layer config'));
    }
  });
};

export default VideoLayer;