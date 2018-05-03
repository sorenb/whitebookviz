HTMLWidgets.widget({

  name: 'samedate_barchart',
  type: 'output',
  
  // TODO: tooltip done, update func, upstart animation?, config params done
  // Notes: in d3 when using functions like function(d,i) d is the data element and i is the index of it.

  factory: function(el, width, height) {

    return {

      renderValue: function(opts) {
      
      	// Set Danish locale as default
      	// The da_DK var must be loaded from the da_dk_locale.js via the htmlwidgets' yaml dependency file
      	d3.formatDefaultLocale(da_DK);
        var dateOpts = { month: 'short', day: 'numeric' };   // with year: { year: 'numeric', month: 'short', day: 'numeric' };
        var data = HTMLWidgets.dataframeToD3(opts.data);
      	var margin = { left:100, right:10, top:10, bottom:100 };
      	var curDate = opts.curDate;
      	var sortx = opts.sortx;
      	var frontColors = opts.frontColors;
      	var backColor = opts.backColor;
      	var tickNumY = opts.tickNumY;
      	var labelx = opts.labelx;
      	var labely = opts.labely;
      	var showScaleY = opts.showScaleY;
      	var barWidth = opts.barWidth;
      	var width = 1000 - margin.left - margin.right;
      	var height = 400 - margin.top - margin.bottom;
  		  var barsOffset = opts.barsOffset; // The horizontal offset between front and back bars
  		  //var alignCorrection = (width / 200); // The horizontal offset between front and back bars
  		  var circleSize = (width / 300); // 

        // Interleave the backColor with the frontColors in an array. Front colors are odd. Back colors are even. Rembemer arrays start with 0
        // e.g.: ["grey","red","grey","green","grey","blue"]
        var arr = [];
        for ( let color of frontColors ) {  // "for..of" is ES6 which might not work in rstudio viewer (for..of should be used with arrays, not for..in) 
            arr.push(backColor);
            arr.push(color);
        }
        
        // Calling this with the data elements index (the i in (d,i)) will color the front bars
        function bar_color(n) {
          // using modulo to loop through colors array and repeating it from beginning when running out of array elements.
          return arr[n % arr.length]; 
        }
      	
      	// the "el" var here is the html element that the D3 viz will bind to! 
      	// It's passed via the enclosing factory function above
      	// var svgContainer = d3.select("#chart-area")
      	var svgContainer = d3.select(el)  
      	   .append("svg")
          		.attr("width", width + margin.left + margin.right)
          		.attr("height", height + margin.top + margin.bottom);
      
        // 
      	var group = svgContainer
      	  .append("g")
      	    .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );
      	//  	      
  	    var circleGroupFront = svgContainer
  	      .append("g")
  	        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );
        
        // 
        var circleGroupBack = svgContainer
  	      .append("g")
  	        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );
      
      	// Define the div for the tooltip
      	var tooltipDiv = d3.select(el).append("div")	
      	    .attr("class", "tooltip")				
      	    .style("opacity", 0);
      	
      	// Add image download buttons shown on mouse hover in upper left corner
      	var downloadDiv = d3.select("body").append("div")	
      	    .attr("class", "download")				
      	    .html("Download<br/><button id='savepng'>png</button><button id='savesvg'>svg</button>")
      	    .style("left", "10px")
      	    .style("top", "10px");
      
  	    data.forEach( function(d) { d.count = +d.count,
  		                   d.year = d.date.substr(0,4),
  		                   d.monthAndDay = d.date.substr(5,5);
  		  });
      		                 
        // This keeps the years on the x-axis sorted correctly and controls the lef/right direction of the sort
        data.sort(function(a, b) {
          if (sortx == "asc") {
            return d3.ascending(+a.year,+b.year); // use descending if you want the highest years on the left
          } else if (sortx == "desc") {
            return d3.descending(+a.year,+b.year);  // plus sign converts to ints when used thus
          } else {
            console.log("Error! use asc or desc"); 
          }
        });

        // Create category scale for the X-axis
  	    var x = d3.scaleBand()                               // this assigns x-values based on names so data points having 
      		.domain(data.map( function(d) { return d.year }))  // the same names will have the same x-value, hence one rect 
      		.range([0, width])                                 // being on top of the other with the same name  
      		.paddingInner( 1 - barWidth )
      	  .paddingOuter(0.2);
  
        // Create continous scale for the Y-axis
  	    var y = d3.scaleLinear()
  		    .domain([0, d3.max(data, function(d) { return d.count + 3000})])  // +3000 to give a little space over the bars
  		    .range([height,0]);
     
        // Create/place the X-axis
  	    var xAxisCall = d3.axisBottom(x);
  	    group.append("g")
          .attr("class","x-axis")
          .attr("transform","translate(0," + (height) + ")")
          .style( "fill","none")
          .call(xAxisCall
              .tickSize(10,0,0)
              .tickSizeOuter(0)
          );
         
        // Create/place the Y-axis
  	    var yAxisCall = d3.axisLeft(y).ticks(tickNumY);    // with this D3 will create cirka five ticks. no promises
  	    group.append("g")
      		.attr("class","y-axis")
      		.call(yAxisCall
      		    .tickSize(-width, 0, 0)   // this somehow elongates the ticks to grid lines?
      		    .tickSizeOuter(0)
      		);
      
        // toggle-functionality for y-axis domain line
        if (showScaleY == 'false') {
          group.select(".y-axis .domain").remove(); 
        }
        
        var bars = group.selectAll(".viz")
  	      .data(data);
  	      
  	    var circFront = circleGroupFront.selectAll(".circfront")
  	      .data(data);
  	     
   	    var circBack = circleGroupBack.selectAll(".circback")
  	      .data(data);
  	      
  	    d3.selectAll('g.tick')
      		.select('line') //grab the tick line
      		.attr('class', 'tickClass') //style with a custom class and CSS
      		.style('stroke-width', 0.1); //or style directly with attributes or inline styles
  		
  		  group.selectAll(".x-axis .tickClass").style("opacity",0); 
  		
  		  //
      	bars.enter()
      	 	.append("rect")
      	 	  .attr('class', 'viz')
      	    .attr("y", function(d) { return y(d.count) })
      	    .attr("x", function(d) { 
      	      return d.monthAndDay == curDate.substr(5,5)? x(d.year) : x(d.year) + barsOffset;
      	    })   // ternary op
      	    .attr("width",x.bandwidth ) // setting width in px instead of using the d3 controlled x.bandwidth might get you all kinds of alignment hurt!
      	    .attr("height", function(d) { 
      	      return d.year == curDate.substr(0,4) && d.date.substr(0,10) != curDate.substr(0,10)? 0 : (height - y(d.count));
      	    })    // set height to 0 for latest date of current year       
      	    .attr("fill", function(d,i) { return bar_color(i)})   // so there is no second bar for current year
            .on("mouseover", handleMouseOverFront) // Mouse handlers for the collective tooltip
            .on("mouseout", handleMouseOutFront);

        // Append circles for the collective tooltip
        circFront.enter()
          .append("circle")
            .attr('class', 'viz')
            .attr("class", function(d) { 
      	      return d.monthAndDay == curDate.substr(5,5)? "circfront" : "circback";
      	    })   // ternary op
            .attr('r', circleSize)
            .attr("cx", function(d) { return x(d.year) + x.bandwidth()/2 })  // place the circle in the middle of the top of the bar
            .attr("cy", function(d) { return y(d.count) })
            .style("opacity", 0);
        
        // Append texts for the collective tooltip
        circFront.enter()
          .append("text")
            .text(function(d) { 
              var date = new Date(d.date.substr(0,10));
              //return date.toLocaleDateString('da-DK', dateOpts) + " " + d.count.toLocaleString('da-DK');
              return d.count.toLocaleString('da-DK');
            })	
            .attr("class", function(d) { 
      	      return d.monthAndDay == curDate.substr(5,5)? "circfront" : "circback";
      	    })
            .attr("x", function(d) { return x(d.year) + x.bandwidth()/2 })
      	    .attr("y", function(d) { return y(d.count) - 15})
            .style("text-anchor", "middle")
            .style("font-family", "DejaVu sans")
            .style("font-size", "10px")
            .style("opacity", 0);

        // text label for the y axis
        svgContainer.append("text")
          .text(labely)
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-family", "DejaVu sans");
        
        // text label for the x axis
        svgContainer.append("text")
          .text(labelx)
            .attr("transform","translate(" + ( (width + margin.left + margin.right)/2) + " ," +  (height + margin.top + 50) + ")")
            .style("font-family", "DejaVu sans");

        // Hook up a function to the savesvg button using FileSaver.js 
        d3.select("#savesvg")
        .on("click", writeDownloadLink); // This function resides in whitebook_image_tools.js
        
        // Hook up a function to the savepng button
        d3.select("#savepng")
        .on("click", saveSvgAsPng ); // This function resides in whitebook_image_tools.js

        // Mouse over event handler for circleGroupFront
        function handleMouseOverFront(d, i) {  // Add interactivity
      	  if (d.monthAndDay == curDate.substr(5,5)) {
            d3.selectAll(".circfront").style("opacity", 1);
          } else {
            d3.selectAll(".circback").style("opacity", 1);
          }
        }
        
        // Mouse out event handler for circleGroupFront
        function handleMouseOutFront(d, i) {
          if (d.monthAndDay == curDate.substr(5,5)) {
            d3.selectAll(".circfront").style("opacity", 0);
          } else {
            d3.selectAll(".circback").style("opacity", 0);
          }
        }
        
      },
      resize : function(width, height) {
        // we will not implement a resize function
      }
    };
  }
});

