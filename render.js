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



casper.start(startUrl);

casper.then(function() {
	newHTML = this.evaluate(function(bg) {
		hocrLayout(bg);
		return "<html>" + $("html").html() + "</html>";
	}, {'bg': bgImage});

});

casper.then(function() {
	this.capture(fileName + ".png");
});

casper.run(function() {
	//console.log(newHTML, "info");
	fs.write(fileName + '_fubaz.html', newHTML, 'w');
	this.exit();

});

