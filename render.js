//USAGE: casperjs render.js file [backgroundImage]
//	if backgroundImage not specified, expects a png file with the same name of html file in the current directory
//		ie: casperjs render.js home.html <-- ./home.png should be present

var fs = require('fs');
var casper = require('casper').create({
    clientScripts:  [
    	'includes/module-shim.js'
        , 'includes/jquery.min.js'
        , 'includes/hocr-layout.js'
        , 'includes/captchafy/lib/captchafy.js'
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



casper.start(startUrl);

casper.thenEvaluate(function(bg) {
	hocrLayout(bg);
}, {'bg': bgImage});

casper.thenEvaluate(function() {
		var captchafy = module.exports;
		
		var getTextNodesIn = function(el) {
			var whitespace = /^\s*$/;
			return $(el).find("*").andSelf().contents().filter(function() {
				return (this.nodeType == 3) && !whitespace.test(this.nodeValue);
			});
		};
		
		try {	
			getTextNodesIn($(document.body)).each(function() {
				var fontSize = parseInt($(this.parentNode).css("font-size"));
				var rgbString = $(this.parentNode).css("color");
				
				var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				// parts now should be ["rgb(0, 70, 255", "0", "70", "255"]
				
				delete (parts[0]);
				for (var i = 1; i <= 3; ++i) {
					parts[i] = parseInt(parts[i]).toString(16);
					if (parts[i].length == 1) parts[i] = '0' + parts[i];
				} 
				var color = "#" + parts.join('').toUpperCase();
				
				var fontface = "Times"; //req.query.font ? req.query.font : "Times";
				
				var text = this.nodeValue;

				var cnvs = document.createElement("canvas");
				document.body.appendChild(cnvs);
				var captcha = captchafy.create(cnvs);


				captcha.init(text, fontSize, fontface); //, 300);
				//noiseProducer.snow(captcha);
				//textProducer.basic(captcha, {"text": text, "size": fontSize});
				
				console.log("captchafying " + text);
				
				captcha
					//.add(captchafy.text.basic, {"text": text, "size": fontSize, "fillStyle": color, "font": fontface })
					.add(captchafy.text.wavy, {"text": text, "size": fontSize, "fillStyle": color, "font": fontface })
					.add(captchafy.noise.blob, {"fillStyle": color, "h": fontSize, "w": (fontSize * 1.5)})
					.render();
				
				captcha.crop();

				//$(this).replaceWith(this.nodeValue.replace(/([a-z0-9]+)/gi, '<img src="'+ captcha.canvas.toDataURL() + '" />'));
				$(this).replaceWith('<img src="'+ captcha.canvas.toDataURL() + '" />');
				document.body.removeChild(cnvs);
			});
		}
		catch(e) {
			//handle exception
			alert(e);
		}
		

		
});

casper.then(function() {
	newHTML = this.evaluate(function(bg) {
		return "<html>" + $("html").html() + "</html>";
	}, {'bg': bgImage});
});


casper.then(function() {
	this.capture(fileName + ".png");
	this.capture(fileName + ".pdf");
});

casper.run(function() {
	//console.log(newHTML, "info");
	fs.write(fileName + '_fubaz.html', newHTML, 'w');
	this.exit();

});

