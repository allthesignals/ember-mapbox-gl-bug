import Component from '@ember/component';

export default Component.extend({
  zoom: 6.8,
  center: [-73.869324, 40.815888],
  geographyLevel: 'county',
  sourceConfig: {"id":"population-change","type":"vector","tiles":["http://0.ashbu.cartocdn.com/planninglabs/api/v1/map/b8f64184d3a1f80d023c72fbc5a8da47:1519701255157/{z}/{x}/{y}.mvt"],"minzoom":0},
  testLayer: Ember.computed('geographyLevel', function() {
    const geographyLevel = this.get('geographyLevel');
    const color = geographyLevel === 'county' ? '#000' : '#DDD';
    const layer = {"id":"population-change-counties","title":"% Population Change 2010-2016","type":"choropleth","source":"population-change","source-layer":"population-change-counties","paintConfig":{"isPercent":true,"opacity":0.6,"colors":[color,color,"#ffffe0","#b3e4ff","#5ab4ff","#004da8"],"breaks":[-0.025,-0.01,0.01,0.025,0.05]}};
    const { id, source, paintConfig } = layer;
    return {
          id,
          type: 'fill',
          source,
          'source-layer': layer['source-layer'],
          paint: buildPaint(paintConfig),
        }
  }),

  builtLayers: Ember.computed('geographyLevel', function() {
    const arrayWithObjects = [{}, {}];
    return arrayWithObjects;
  }),

  actions: {
   handleMapLoad(map) {

      const source = this.get('sourceConfig');
      map.addSource('population-change', source);
    },
  recomputeProp() {
    const geo = this.get('geographyLevel');
    (geo === 'county') ? this.set('geographyLevel', 'test') : this.set('geographyLevel', 'county');
  },
  },
});


function buildPaint({
  colors,
  breaks,
  opacity,
}) {
  const paint = {
    'fill-color': [
      'step',
      ['get', 'value'],
    ],
    'fill-opacity': opacity,
  };
  const colorArray = paint['fill-color'];

  // there will always be 1 more color than breaks
  colorArray.push(colors[0]);

  breaks.forEach((color, i) => {
    colorArray.push(breaks[i]);
    colorArray.push(colors[i + 1]);
  });

  return paint;
}
