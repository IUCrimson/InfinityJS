(function () {
    var width = 960,
        height = 500;

    var fill = d3.scale.log()
        .domain([10, 500])
        .range(["brown", "steelblue"]);

    var path = d3.geo.path();

    var svg = d3.select("#area-choropleth").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("../browser/htmlforms/custom/infinityjs/d3/us-named.json", function (error, us) {
        console.log('got us');

        svg.append("g")
            .attr("class", "counties")
          .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { return fill(path.area(d)); });

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
            .attr("class", "states")
            .attr("d", path);
    });
})();
