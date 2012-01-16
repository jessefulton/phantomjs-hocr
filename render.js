var fs = require('fs');
var page = require('webpage').create();



page.content = fs.read('example.html');
page.onAlert = function(str) { console.log(str); }
//console.log(page.content);
page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    // jQuery is loaded, now manipulate the DOM
	var newHtml = (page.evaluate(function () {
		var oStr = "";
		$('*[title~="bbox"]').each(function() {
			var t = ($(this).attr('title'));
			var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
			var tlx = (matches[1]);
			var tly = (matches[2]);
			var brx = (matches[3]);
			var bry = (matches[4]);
			$(this).css("position", "absolute");
			$(this).css("top", tly+"px");
			$(this).css("left", tlx+"px");
			$(this).css("width", (brx-tlx)+"px");
			$(this).css("height", (bry-tly)+"px");
			$(this).css("font-size", (bry-tly)+"px");		
		});
		return "<html>" + $("html").html() + "</html>";
		//return document.documentElement.innerHTML;
	}));

	fs.write('output.html', newHtml, 'w');

	//console.log(document.documentELement.innerHTML);
	
	page.render('output.png');
	phantom.exit();
});


