function Network(){}

// ************************************************************************************************** //
// Setup

Network.prototype.setup = function(){
  this.nodes = this.nodes_in_layers.map(d => { return d3.range(d).map(() => { return {} }) });
}

// ************************************************************************************************** //
// Update

Network.prototype.update = function(){
  this.calculate();
  // this.calculateColorSegments();
}

// ************************************************************************************************** //
// Calculate output values

var input_vals = { a: 1, b: 1, c: 1, d: 1 };

Network.prototype.calculate = function(){

  // ****************************************
  // Assigning values to Layer 1

  this.nodes[0][0].params = { a: input_vals.a, b: 0, c: 0, d: 0 };
  this.nodes[0][1].params = { a: 0, b: input_vals.b, c: 0, d: 0 };
  this.nodes[0][2].params = { a: 0, b: 0, c: input_vals.c, d: 0 };
  this.nodes[0][3].params = { a: 0, b: 0, c: 0, d: input_vals.d };

  this.nodes[0][0].output = this.nodes[0][0].params.a;
  this.nodes[0][1].output = this.nodes[0][1].params.b;
  this.nodes[0][2].output = this.nodes[0][2].params.c;
  this.nodes[0][3].output = this.nodes[0][3].params.d;

  this.nodes[0].forEach(node => { normalizeParams(node); })

  // ****************************************
  // Calculating values for other layers

  for(var layer = 1; layer < this.nodes.length; layer++){
    var currentLayer = this.nodes[layer];
    var previousLayer = this.nodes[layer-1];
    var weights = this.weights[layer-1];

    for(var i = 0; i < currentLayer.length; i++){
      var currentNode = currentLayer[i];
      currentNode.params = { a: 0, b: 0, c: 0, d: 0 };
      currentNode.input = 0;

      for(var j = 0; j < previousLayer.length; j++){
        var previousNode = previousLayer[j];
        var weight = weights[j][i];
        currentNode.input += weight*previousNode.output;
        currentNode.params.a += weight*previousNode.output*previousNode.params.a;
        currentNode.params.b += weight*previousNode.output*previousNode.params.b;
        currentNode.params.c += weight*previousNode.output*previousNode.params.c
        currentNode.params.d += weight*previousNode.output*previousNode.params.d;
      }

      currentNode.output = sigmoid(currentNode.input);
      normalizeParams(currentNode);
    }
  };

}

// ************************************************************************************************** //
// Normalize the ratio of input parameters for each node

function normalizeParams(node){
  node.params.a = Math.abs(node.params.a);
  node.params.b = Math.abs(node.params.b);
  node.params.c = Math.abs(node.params.c);
  node.params.d = Math.abs(node.params.d);

  var temp_sum = node.params.a + node.params.b + node.params.c + node.params.d;

  node.params.a /= temp_sum;
  node.params.b /= temp_sum;
  node.params.c /= temp_sum;
  node.params.d /= temp_sum;
}

// ************************************************************************************************** //
// Non linear activation functions

function sigmoid(x){ return 1/(1+Math.pow(x, -1)) }

// ************************************************************************************************** //
// Calculate Color Segments

// Network.prototype.calculateColorSegments = function(){

//   // ****************************************
//   // Colors for Layer 0

//   this.nodes[0][0].color = { r: 1, g: 0, b: 0, y: 0 };
//   this.nodes[0][1].color = { r: 0, g: 1, b: 0, y: 0 };
//   this.nodes[0][2].color = { r: 0, g: 0, b: 0, y: 1 };
//   this.nodes[0][3].color = { r: 0, g: 0, b: 1, y: 0 };

//   this.nodes[0].forEach(node => { normalize(node); })

//   // ****************************************
//   // Calculate the RGBY values

//   for(var layer = 1; layer < this.no_layers; layer++){

//     for(var i = 0; i < this.nodes_in_layers[layer]; i++){
//       this.nodes[layer][i].color = { r: 0, g: 0, b: 0, y: 0 };
//       for(var j = 0; j < this.nodes_in_layers[layer-1]; j++){
//         this.nodes[layer][i].color.r += this.nodes[layer-1][j].color.r*math.abs( this.weights[layer-1][j][i] );
//         this.nodes[layer][i].color.g += this.nodes[layer-1][j].color.g*math.abs( this.weights[layer-1][j][i] );
//         this.nodes[layer][i].color.b += this.nodes[layer-1][j].color.b*math.abs( this.weights[layer-1][j][i] );
//         this.nodes[layer][i].color.y += this.nodes[layer-1][j].color.y*math.abs( this.weights[layer-1][j][i] );
//       }
//     }

//     this.nodes[layer].forEach(node => { normalize(node); })

//   };

// }

// ************************************************************************************************** //
// Normalize values

// function normalize(node){
//   var temp = node.color.r + node.color.g + node.color.b + node.color.y;
//   node.color.r /= temp;
//   node.color.g /= temp;
//   node.color.b /= temp;
//   node.color.y /= temp;
// }
