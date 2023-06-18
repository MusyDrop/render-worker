/// <reference types="types-for-adobe/AfterEffects/22.0"/>
declare const NX: any;

// https://github.com/ExtendScript/extendscriptr
const items = app.project.items;
let comp;

for (let i = 1; i <= items.length; i++) {
  const item = items[i];
  if (item.name === 'main') {
    comp = item as CompItem;
  }
}

if (!comp) {
  throw new Error('Unable to find main composition by the name "main"');
}

const layer = comp.layers.byName('amplitude-layer');

if (!layer) {
  throw new Error('Unable to find shape layer by the name "shape"');
}

const sliderProp = layer
  .property('Effects')
  .property('Both Channels')
  .property('Slider') as Property;
// sizeProp.expression = 'temp = thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider") * 50; \n [temp, temp]';

const times = NX.get('times');
const keyframes = NX.get('keyframes');
sliderProp.setValuesAtTimes(times, keyframes);
sliderProp.expression = 'smooth(0.2, 7);';
