import { fetchTile } from 'services/carto-service';
import { replace } from 'utils/query';

const CartoLayer = (layerModel) => {
  const { layerConfig, params, sqlParams, id } = layerModel;
  const layerConfigParsed = layerConfig.parse === false
    ? layerConfig
    : JSON.parse(replace(JSON.stringify(layerConfig), params, sqlParams));

  return new Promise((resolve, reject) => {
    fetchTile(layerModel)
      .then((response) => {
        const tileUrl = `${response.cdn_url.templates.https.url.replace('{s}', 'a')}/${layerConfigParsed.account}/api/v1/map/${response.layergroupid}/{z}/{x}/{y}.mvt`;

        return resolve({
          id,
          source: {
            type: 'vector',
            tiles: [tileUrl]
          },
          layer: {
            id,
            type: 'fill',
            source: id,
            'source-layer': 'layer0',
            paint: {
              'fill-color': 'transparent',
              'fill-outline-color': '#ff0000'
            }
          }
        });
      })
      .catch(err => reject(err));
  });
};

export default CartoLayer;
