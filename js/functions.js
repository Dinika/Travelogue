var width = 960,
    height = 960,
    speed = -1e-2,
    start = Date.now();

var sphere = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .precision(.5);

var graticule = d3.geo.graticule();

var canvas1 = d3.select("body").append("canvas"),
    canvas2 = d3.select("body").append("canvas").attr("class", "blur"),
    canvas3 = d3.select("body").append("canvas");

d3.selectAll("canvas")
    .attr("width", width)
    .attr("height", height);

var context1 = canvas1.node().getContext("2d"),
    context2 = canvas2.node().getContext("2d"),
    context3 = canvas3.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection);

projection.scale(width / 2.3).clipAngle(90);

context1.beginPath();
path.context(context1)(sphere);
context1.lineWidth = 3;
context1.strokeStyle = "#000";
context1.stroke();

context1.beginPath();
path(sphere);
context1.fillStyle = "#fff";
context1.fill();

context2.fillStyle = "rgba(0,0,0,.4)";
context3.strokeStyle = "rgba(0,0,0,.2)";

d3.json("/mbostock/raw/4090846/world-110m.json", function(error, topo) {
  if (error) throw error;

  var land = topojson.feature(topo, topo.objects.land),
      grid = graticule();

  d3.timer(function() {
    context2.clearRect(0, 0, width, height);
    context3.clearRect(0, 0, width, height);

    projection.rotate([speed * (Date.now() - start), -15]);

    projection.scale(width / 2.3).clipAngle(90);

    context2.beginPath();
    path.context(context2)(land);
    context2.fill();

    context3.beginPath();
    path.context(context3)(grid);
    context3.lineWidth = .5;
    context3.stroke();

    projection.scale(width / 2.2).clipAngle(106.3);

    context3.beginPath();
    path(land);
    context3.fillStyle = "#737368";
    context3.fill();

    projection.scale(width / 2.2).clipAngle(90);

    context3.beginPath();
    path(land);
    context3.fillStyle = "#dadac4";
    context3.fill();
  });
});

d3.select(self.frameElement).style("height", height + "px");