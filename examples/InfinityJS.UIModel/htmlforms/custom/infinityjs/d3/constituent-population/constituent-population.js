(function () {
    var inf = BBUI.ns('InfinityJS');

    inf.UI.beginWait();
    inf.DataList.loadAsObjects('60705588-4ea6-4bf0-bb69-a07940905ad0').then(function (dataList) {
        inf.UI.endWait();
        
        var width = 960,
            height = 500,
            totals = _.pluck(dataList, 'TOTAL'),
            maxPopulation = _.max(totals),
            minPopulation = _.min(totals),
            totalPopulation = _.reduce(totals, function(t, num) { return t + num; }, 0);

        var fill = d3.scale.log()
            .domain([minPopulation, maxPopulation])
            .range(["white", "brown"]);

        var path = d3.geo.path();

        var svg = d3.select("#constituents-bycounty").append("svg")
            .attr("width", width)
            .attr("height", height);

        // See https://github.com/mbostock/us-atlas 
        // Offical records of geographic names etc are here: http://geonames.usgs.gov/domestic/download_data.htm
        // Todo: Add state code/abbreviation to us.objects.counties.
        d3.json("../browser/htmlforms/custom/infinityjs/d3/us-named.json", function (error, us) {
            // The list of states and thier FIPS code.
            var stateList = _.map(us.objects.states.geometries, function (s) {
                return s.properties;
            });
            
            // Adding a STATEID property looked up from the D3 stateList collection
            // to the dataList collection
            dataList = _.map(dataList, function (d) {
                var state = _.findWhere(stateList, { code: d.STATE });
                if (!state) return d;
                d.STATEID = parseInt(state.id);
                return d;
            });
            
            // Draw counties
            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    var stateId = Math.floor(d.properties.id / 1000);
                    var countyInDataList = _.find(dataList, function (c) {
                        if (!c.COUNTY || !d.properties.name) 
                            return false;

                        return c.STATEID === stateId &&
                               c.COUNTY === d.properties.name.replace(' ', '').toLowerCase();
                    });
                    
                    d = countyInDataList
                        ? $.extend(d, countyInDataList)
                        : $.extend(d, { COUNTY: d.properties.name, TOTAL: 0 });

                    return fill(d.TOTAL);
                })
			    .on("mouseover", mouseOver).on("mouseout", mouseOut);

            // Draw states
            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                .attr("class", "states")
                .attr("d", path);
        });
    });

    function tooltipHtml(c) {
        return "<h4>" + (c.NAME || c.COUNTY) + "</h4><table>" +
			"<tr><td>" + c.TOTAL + "</td></tr></table>";
    }

    function mouseOver(d) {
        d3.select("#tooltip").transition().duration(200).style("opacity", .9);
        d3.select("#tooltip").html(tooltipHtml(d))
            .style("left", (d3.event.pageX - 200) + "px")
            .style("top", (d3.event.pageY - 100) + "px");
    }

    function mouseOut() {
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
    }
})();
