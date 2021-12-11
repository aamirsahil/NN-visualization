// ************************************************************************************************** //
// Global parameters

var network;
var hidden_nodes = 10;
var epoch_count = 19;
var readData;

// ************************************************************************************************** //
// Read Data

$(document).ready(() => {
  createEvents();

  // d3.json('./log3.json', (data) => { console.log(data); setup(); update(data); })

  d3.json('./data/log5.json', (data) => {
    readData = data;
    setup();
    goTo(epoch_count);
  })
})

// ************************************************************************************************** //
// Setup

function setup(){
  network = new Network();
  network.no_layers = 4;
  network.hidden_nodes = hidden_nodes;
  network.nodes_in_layers = [4, hidden_nodes, hidden_nodes, 1];

  network.setup();
  visualisation.setup();
}

// ************************************************************************************************** //
// Update

function update(data){
  network.weights = [];
  for(var i = 1; i < network.no_layers; i++){
    network.weights.push( data['weights'+i][hidden_nodes] );
  }

  network.update();
  svg.update();
}

// ************************************************************************************************** //
// Go To

function goTo(index){
  network.weights = [];
  for(var i = 1; i < network.no_layers; i++){
    network.weights.push( readData[hidden_nodes]['weights'+i][index] );
  }

  network.update();
  visualisation.update();
}

// ************************************************************************************************** //
// Repeat

function repeat(){
  goTo(epoch_count);

  console.log(epoch_count);

  epoch_count++;
  if(epoch_count < 20){ window.requestAnimationFrame(repeat); }
}

// ************************************************************************************************** //
// Create Events

function createEvents(){
  d3.select('#hiddenNodesButton').on('change', () => {
    var val = parseInt(d3.select('#hiddenNodesButton').property('value'));
    hidden_nodes = val;
    setup();

    epoch_count = 0;
    d3.select('#indexRange').property('value', epoch_count);
    d3.select('#indexVal').text(epoch_count);
    goTo(epoch_count);
  })

  d3.select('#indexRange').on('input', () => {
    var val = parseInt(d3.select('#indexRange').property('value'));
    d3.select('#indexVal').text(val);
    epoch_count = val;
    goTo(epoch_count);
  })

  d3.select('#slider-a').on('input', () => {
    var val = parseFloat(d3.select('#slider-a').property('value'));
    input_vals.a = val;
    goTo(epoch_count);
  })

  d3.select('#slider-b').on('input', () => {
    var val = parseFloat(d3.select('#slider-b').property('value'));
    input_vals.b = val;
    goTo(epoch_count);
  })

  d3.select('#slider-c').on('input', () => {
    var val = parseFloat(d3.select('#slider-c').property('value'));
    input_vals.c = val;
    goTo(epoch_count);
  })

  d3.select('#slider-d').on('input', () => {
    var val = parseFloat(d3.select('#slider-d').property('value'));
    input_vals.d = val;
    goTo(epoch_count);
  })
}