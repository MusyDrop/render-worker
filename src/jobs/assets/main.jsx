"use strict";
var items = app.project.items;
var comp;
for (var i = 1; i <= items.length; i++) {
    var item = items[i];
    if (item.name === 'main') {
        comp = item;
    }
}
if (!comp) {
    throw new Error('Unable to find main composition by the name "main"');
}
var layer = comp.layers.byName('amplitude-layer');
if (!layer) {
    throw new Error('Unable to find shape layer by the name "shape"');
}
var sliderProp = layer
    .property('Effects')
    .property('Both Channels')
    .property('Slider');
var times = NX.get('times');
var keyframes = NX.get('keyframes');
sliderProp.setValuesAtTimes(times, keyframes);
sliderProp.expression = 'smooth(0.2, 7);';
