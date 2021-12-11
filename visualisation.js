var visualisation = {};

visualisation.square_size = 60;
visualisation.x_distance_btwn_nodes = 200;
visualisation.y_distance_btwn_nodes = 40;

// ************************************************************************************************** //
// Setup

visualisation.setup = function(){

  // ****************************************
  // Create canvas

  this.svg_width = network.no_layers*this.square_size + (network.no_layers+1)*this.x_distance_btwn_nodes;
  this.svg_height = d3.max(network.nodes_in_layers)*this.square_size + (d3.max(network.nodes_in_layers)+1)*this.y_distance_btwn_nodes;

  this.svg = d3.select('#svg').attrs({ width: this.svg_width, height: this.svg_height });
  this.canvas = d3.select('#canvas').attrs({ width: this.svg_width, height: this.svg_height });
  this.ctx = this.canvas.node().getContext("2d");
  this.svg.selectAll('g').remove();

  // ****************************************
  // Create nodes

  network.nodes.forEach((layer, x) => {
    var y_offset = 0.5*(this.svg_height - layer.length*this.square_size - (layer.length-1)*this.y_distance_btwn_nodes)
    layer.forEach((node, y) => {
      node.x = (x+1)*this.x_distance_btwn_nodes + (x+0.5)*this.square_size;
      node.y = y_offset + y*this.y_distance_btwn_nodes + (y+0.5)*this.square_size;
      node.g = this.svg.append('g').attrs({ 'transform': 'translate(' +(node.x-0.5*this.square_size)+ ',' +(node.y-0.5*this.square_size)+ ')' });
      node.square = node.g.append('rect').attrs({ x: 0, y: 0, width: this.square_size, height: this.square_size }).styles({ fill: 'white', stroke: 'black', 'stroke-width': 2 });
      node.bars = d3.range(network.nodes_in_layers[0]).map(() => { return node.g.append('rect') });
      node.canvas_div = d3.select('#parent-div').append('div').styles({ 'position': 'absolute', 'left': node.x-0.5*this.square_size+'px', 'top': node.y-0.5*this.square_size+'px', 'width': this.square_size+'px', 'height': this.square_size+'px' });
      node.canvas = node.canvas_div.append('canvas').attrs({ width: this.square_size, height: this.square_size });
      node.ctx = node.canvas.node().getContext("2d");
    })
  });

  d3.select("#div-slider-a").styles({ top: network.nodes[0][0].y+'px', left: (network.nodes[0][0].x - 3*visualisation.square_size)+'px' });
  d3.select("#div-slider-b").styles({ top: network.nodes[0][1].y+'px', left: (network.nodes[0][1].x - 3*visualisation.square_size)+'px' });
  d3.select("#div-slider-c").styles({ top: network.nodes[0][2].y+'px', left: (network.nodes[0][2].x - 3*visualisation.square_size)+'px' });
  d3.select("#div-slider-d").styles({ top: network.nodes[0][3].y+'px', left: (network.nodes[0][3].x - 3*visualisation.square_size)+'px' });

  // ****************************************
  // Create links

  this.lines_group = this.svg.append('g');
  this.lines = [];

  for(var layer = 0; layer < network.no_layers-1; layer++){
    this.lines[layer] = [];
    for(var i = 0; i < network.nodes_in_layers[layer]; i++){
      this.lines[layer][i] = [];
      for(var j = 0; j < network.nodes_in_layers[layer+1]; j++){
        this.lines[layer][i][j] = this.lines_group.append('line').attrs({ x1: network.nodes[layer][i].x+0.5*this.square_size, y1: network.nodes[layer][i].y, x2: network.nodes[layer+1][j].x-0.5*this.square_size, y2: network.nodes[layer+1][j].y }).styles({ 'stroke': 'gray' });
      }
    }
  };

}

// ************************************************************************************************** //
// Update

var red = [255,0,0];
var green = [0,255,0];
var blue = [0,0,255];
// var yellow = [150,50,200];
var yellow = [255,255,0];
var opacity = 1;

visualisation.update = function(){

  // ****************************************
  // Creating smeared dots pattern

  // network.nodes.forEach(layer => {
  //   layer.forEach(node => {
  //     node.ctx.fillStyle = 'white';
  //     node.ctx.fillRect(node.x-0.5*this.square_size, node.y-0.5*this.square_size, this.square_size, this.square_size);

  //     node.ctx.lineWidth = 2;
  //     node.ctx.strokeStyle = 'black';

  //     var temp_x = 0, temp_y = 0, temp, color, r = 4;
  //     d3.range(400).forEach(() => {
  //       temp = math.random();
  //       color = 'rgba(' +yellow[0]+ ',' +yellow[1]+ ',' +yellow[2]+ ',' +opacity+ ')';
  //       if(temp <= node.color.r+node.color.g+node.color.b){ color = 'rgba(' +blue[0]+ ',' +blue[1]+ ',' +blue[2]+ ',' +opacity+ ')'; }
  //       if(temp <= node.color.r+node.color.g){ color = 'rgba(' +green[0]+ ',' +green[1]+ ',' +green[2]+ ',' +opacity+ ')'; }
  //       if(temp <= node.color.r){ color = 'rgba(' +red[0]+ ',' +red[1]+ ',' +red[2]+ ',' +opacity+ ')'; }

  //       temp_x = 0*r + math.random()*(this.square_size-0*r);
  //       temp_y = 0*r + math.random()*(this.square_size-0*r);

  //       node.ctx.fillStyle = color;
  //       node.ctx.beginPath();
  //       node.ctx.arc(temp_x, temp_y, r, 0, 2*Math.PI);
  //       node.ctx.fill();
  //     })

  //   })
  // })

  // ****************************************
  // Updating lines connecting nodes

  var max = math.max(math.abs(network.weights));

  for(var layer = 0; layer < network.no_layers-1; layer++){
    for(var i = 0; i < network.nodes_in_layers[layer]; i++){
      for(var j = 0; j < network.nodes_in_layers[layer+1]; j++){
        this.lines[layer][i][j].styles({ 'stroke-width': math.abs(network.weights[layer][i][j]*(3/max)) });
        if(network.weights[layer][i][j] < 0){ this.lines[layer][i][j].styles({ 'stroke-dasharray': '3 3' }); }
        else { this.lines[layer][i][j].styles({ 'stroke-dasharray': '0 0' }); }
      }
    }
  }

  // ****************************************
  // Creating voronoi color patches

  var voronoi = d3.voronoi()
    // .x(function(d) { return d.x; })
    // .y(function(d) { return d.y; })
    .extent([[0, 0], [this.square_size, this.square_size]]);

  network.nodes.forEach(layer => {
    layer.forEach(node => {
      // var n = 8;

      // var sites = d3.range(40).map((d) => { return { x: Math.random()*this.square_size, y: Math.random()*this.square_size } });
      // var sites = d3.range(40).map((d) => {
      //   return { x: Math.random()*this.square_size, y: Math.random()*this.square_size }
      // });

      // var sites = [];
      // for(var i = 0; i <= n; i++){ for(var j = 0; j <= n; j++){ sites.push({ x: (i+0.5)*this.square_size/(n+1), y: (j+0.5)*this.square_size/(n+1) }); } };

      // var sites = poissonDiscSampler(this.square_size, this.square_size, 10);

      var sites = [...poissonDiscSampler(0, 0, this.square_size, this.square_size, 0.05*this.square_size)];

      var diagram = voronoi(sites);
      var links = diagram.links();
      var polygons = diagram.polygons();

      for (var i = 0, n = polygons.length; i < n; ++i){
        node.ctx.beginPath();
        drawCell(polygons[i], node);
        // node.ctx.strokeStyle = "#888";
        // var temp = math.random();
        var temp = i/polygons.length;
        var color = 'rgba(' +yellow[0]+ ',' +yellow[1]+ ',' +yellow[2]+ ',' +opacity+ ')';
        if(temp < node.params.a+node.params.b+node.params.c){ color = 'rgba(' +blue[0]+ ',' +blue[1]+ ',' +blue[2]+ ',' +opacity+ ')'; }
        if(temp < node.params.a+node.params.b){ color = 'rgba(' +green[0]+ ',' +green[1]+ ',' +green[2]+ ',' +opacity+ ')'; }
        if(temp < node.params.a){ color = 'rgba(' +red[0]+ ',' +red[1]+ ',' +red[2]+ ',' +opacity+ ')'; }
        node.ctx.fillStyle = color;
        node.ctx.fill();
        // node.ctx.stroke();
      };

    })
  });

  // network.nodes.forEach(layer => {
  //   layer.forEach(node => {
  //     var points = d3.range(40).map((d) => { return [ Math.random()*this.square_size, Math.random()*this.square_size ] });
  //     var delaunay = d3.Delaunay.from(points);
  //     var voronoi = delaunay.voronoi([0, 0, this.square_size, this.square_size]);
  //     // var {points, triangles} = delaunay;
  //     // console.log(points);

  //     // node.ctx.beginPath();
  //     // delaunay.renderPoints(node.ctx);
  //     // node.ctx.fill();

  //     node.ctx.beginPath();
  //     voronoi.render(node.ctx);
  //     // delaunay.renderTriangle(node.ctx);

  //     // var temp = math.random();
  //     // var color = 'rgba(' +yellow[0]+ ',' +yellow[1]+ ',' +yellow[2]+ ',' +opacity+ ')';
  //     // if(temp <= node.color.r+node.color.g+node.color.b){ color = 'rgba(' +blue[0]+ ',' +blue[1]+ ',' +blue[2]+ ',' +opacity+ ')'; }
  //     // if(temp <= node.color.r+node.color.g){ color = 'rgba(' +green[0]+ ',' +green[1]+ ',' +green[2]+ ',' +opacity+ ')'; }
  //     // if(temp <= node.color.r){ color = 'rgba(' +red[0]+ ',' +red[1]+ ',' +red[2]+ ',' +opacity+ ')'; }
  //     // node.ctx.fillStyle = color;

  //     node.ctx.stroke();
  //     // node.ctx.fill();
  //   })
  // })

  // Testing code
  // // var points = d3.range(40).map((d) => { return { x: Math.random()*this.square_size, y: Math.random()*this.square_size } });
  // var points = d3.range(40).map((d) => { return [ Math.random()*this.square_size, Math.random()*this.square_size ] });
  // // var points = [[0,0], [0,this.square_size], [this.square_size, this.square_size], [this.square_size, 0], [0.5*this.square_size, 0.5*this.square_size]];
  // var delaunay = d3.Delaunay.from(points);
  // var voronoi = delaunay.voronoi([0, 0, 960, 500]);

  // console.log(delaunay);
}

// ************************************************************************************************** //
// Creating cells for voronoi color patches

function drawCell(cell, node) {
  // console.log(cell, node);
  // debugger
  if (!cell) return false;
  node.ctx.moveTo(cell[0][0], cell[0][1]);
  for (var j = 1, m = cell.length; j < m; ++j) {
    node.ctx.lineTo(cell[j][0], cell[j][1]);
  }
  node.ctx.closePath();
  return true;
}
