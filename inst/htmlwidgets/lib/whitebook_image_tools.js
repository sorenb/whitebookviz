function writeDownloadLink(){
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = d3.select("svg")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, "myProfile.svg");
}


function saveSvgAsPng(){
  //var svgString = new Blob([html], {type: "image/svg+xml"});
  var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
  var width = document.querySelector('svg').getAttribute('width');
  var height = document.querySelector('svg').getAttribute('height');
  svgString2Image( svgString, 3*width, 3*height, 'png', save ); // passes Blob and filesize String to the callback
  
  function save( dataBlob, filesize ){
    saveAs( dataBlob, 'samedate_barchart.png' ); // saveAs is a FileSaver.js function
  }
}


function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  
  canvas.width = width;
  canvas.height = height;
  
  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);
    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });
  };
  image.src = imgsrc;
}