//USAGE: casperjs render.js file [backgroundImage]
//	if backgroundImage not specified, expects a png file with the same name of html file in the current directory
//		ie: casperjs render.js home.html <-- ./home.png should be present

var fs = require('fs');
var casper = require('casper').create({
    clientScripts:  [
        'includes/jquery.min.js'
        , 'includes/hocr-layout.js'
    ],
    logLevel: "debug",              // Only "info" level messages will be logged
    onError: function(self, m) {   // Any "error" level message will be written
        console.log('FATAL:' + m); // on the console output and PhantomJS will
        self.exit();               // terminate
    }
});

var newHTML
	, fileName
	, startUrl
	, bgImage;

if (casper.cli.args.length === 0) {
    console.log('Try to pass some args when invoking this script!');
    casper.exit();
} else {
    startUrl = fileName = casper.cli.args[0];
    
    if (casper.cli.args.length >= 2) {
    	bgImage = casper.cli.args[1];
    }
    else {
    	bgImage = startUrl.substring(startUrl.lastIndexOf('/') + 1).replace(".html", ".png");
    }
}


if (fileName.indexOf("http") != 0) {
	startUrl = "file://" + fs.absolute(fileName);
}


casper.on('remote.alert', function(str) { console.log("ALERT: \t" + str); });
casper.on('remote.message', function(str) { console.log("CONSOLE: \t" + str); });

console.log("Opening URL " + startUrl, "info");
console.log("BGIMG " + bgImage);

casper.start(startUrl);

casper.then(function() {
	newHTML = this.evaluate(function(pg) {
		hocrLayout();
		return "<html>" + $("html").html() + "</html>";
	}, {'pg': this.getCurrentUrl()});

});

casper.then(function() {
	this.capture(fileName + ".png");
});

casper.run(function() {
	//console.log(newHTML, "info");
	fs.write(fileName + '_fubaz.html', newHTML, 'w');
	this.exit();

});





/*
var fs = require('fs');
var page = require('webpage').create();

var fileName = "";

if (phantom.args.length === 0) {
    console.log('Try to pass some args when invoking this script!');
} else {
    fileName = phantom.args[0];
}

page.onAlert = function(str) { console.log("ALERT: \t" + str); }
page.onError = function(str) { console.log("ERROR: \t" + str); }
page.onConsoleMessage = function(str) { console.log("CONSOLE: \t" + str); }

page.content = fs.read(fileName + '.html');
console.log("opened " + fileName + ".html");

page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {

	console.log("jquery loaded");

    // jQuery is loaded, now manipulate the DOM
	var newHtml = (page.evaluate(function () {
		$(function() {
		
			//alert(document.location.href);

			function getBoundingBox(el) {
				var t = $(el).attr('title');
				var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
				return {
					"tlx" : (matches[1])
					, "tly" : (matches[2])
					, "brx" : (matches[3])
					, "bry" : (matches[4])
				}
			}
			
			var bgImg = ""; //"doc-018.png"
			var pbb = getBoundingBox($("#page_1"));
			$(document.body).css("background", "transparent url('" + bgImg + "') 0 0 no-repeat");
			$(document.body).css("width", (pbb.brx - pbb.tlx) + "px");
			$(document.body).css("height", (pbb.bry - pbb.tly) + "px");
	
	
			$('.ocr_line[title~="bbox"]').each(function() {
				var maxHeight = 0;
				var hasAscenders = false;
				var hasDescenders = false;
	
				var lbb = getBoundingBox($(this));
				lineHeight = (lbb.bry-lbb.tly);
				baseline = Math.max(lbb.bry);
	
				
				
				//can we interpolate line height from average baseline
				
				//check maxHeight & baseline from each word in line
				$(this).find('.ocr_word[title~="bbox"]').each(function() {
					var wbb = getBoundingBox($(this));
					maxHeight = (maxHeight > (wbb.bry-wbb.tly)) ? maxHeight : (wbb.bry-wbb.tly);
					baseline = Math.max(baseline, wbb.bry);
					
					
					$(this).css("text-align", "center");
					if(true) {
						$(this).css("position", "absolute");
		
						//$(this).css("top", (wbb.tly-lbb.tly)+"px");
						$(this).css("left", (wbb.tlx-lbb.tlx)+"px");
						//$(this).css("width", (wbb.brx-wbb.tlx)+"px");
						$(this).css("height", (wbb.bry-wbb.tly)+"px");
	
					}
					
					//$(this).css("border", "1px solid green");
		//			$(this).css("font-size", (bry-tly)+"px");	
					
				});
	
				//console.log("line-height: " + lineHeight + "; maxHeight: " + maxHeight + "; baseline: " + baseline);
				$(this).css("line-height", lineHeight+"px");
				//$(this).css("text-align", "justify");
				$(this).css("position", "absolute");
				$(this).css("top", (lbb.tly)+"px");
				$(this).css("left", (lbb.tlx)+"px");
				$(this).css("width", (lbb.brx-lbb.tlx)+"px");
				$(this).css("height", (lbb.bry-lbb.tly)+"px");
				$(this).css("background-color", "#FFF");
				$(this).css("font-size", maxHeight+"px");
			});

			return "<html>" + $("html").html() + "</html>";
		
		});	

	}));

	fs.write(fileName + '_output.html', newHtml, 'w');

	//console.log(document.documentELement.innerHTML);
	
	page.render('output.png');
	phantom.exit();
});


*/