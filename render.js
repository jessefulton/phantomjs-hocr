var fs = require('fs');
var page = require('webpage').create();



page.content = fs.read('example.html');
page.onAlert = function(str) { console.log(str); }
//console.log(page.content);
page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    // jQuery is loaded, now manipulate the DOM
	var newHtml = (page.evaluate(function () {
	

		//.ocr_page .ocr_carea .ocr_par .ocr_line .ocr_word .ocr_xword
	/*
		$('.ocr_line[title~="bbox"], .ocr_line').each(function() {
			var maxHeight = 0;
			var baseline = 0;
			try {
				var t = ($(this).attr('title'));
				var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
				var tlx = (matches[1]);
				var tly = (matches[2]);
				var brx = (matches[3]);
				var bry = (matches[4]);
				maxHeight = (maxHeight > (bry-tly)) ? maxHeight : (bry-tly);
				baseline = Math.max(baseline, bry);
			} catch(e) {
				console.log(e);
			}
			
			console.log("Max Height for " + this.id + "  "  + maxHeight);
			console.log("Baseline for " + this.id + "  "  + baseline);
			
			$(this).find('*').each(function() {
				$(this).css("bottom", baseline+"px");											
			});
			$(this).css("position", "absolute");
			$(this).css("font-size", (bry-tly)+"px");
			$(this).css("left", tlx+"px");
			//$(this).css("bottom", baseline+"px");								
		});
*/


		$('.ocr_line[title~="bbox"]').each(function() {
			var maxHeight = 0;
			var baseline = 0;
			try {
				var t = ($(this).attr('title'));
				var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
				var tlx = (matches[1]);
				var tly = (matches[2]);
				var brx = (matches[3]);
				var bry = (matches[4]);
				maxHeight = (maxHeight > (bry-tly)) ? maxHeight : (bry-tly);
				baseline = Math.max(baseline, bry);
			} catch(e) {
				console.log(e);
			}
			$(this).css("position", "absolute");
			$(this).css("top", (maxHeight+baseline)+"px");
			$(this).css("font-size", maxHeight+"px");
		});


		$('.ocr_word[title~="bbox"]').each(function() {
			var t = ($(this).attr('title'));
			var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
			var tlx = (matches[1]);
			var tly = (matches[2]);
			var brx = (matches[3]);
			var bry = (matches[4]);
			$(this).css("position", "absolute");
			//$(this).css("top", tly+"px");
			$(this).css("left", tlx+"px");
			$(this).css("width", (brx-tlx)+"px");
			$(this).css("height", (bry-tly)+"px");
			//$(this).css("border", "1px solid green");
//			$(this).css("font-size", (bry-tly)+"px");		
		});
		
		$('.xocr_word').each(function() {
			var theWord = $(this).text();
			var fontSize = $(this).closest(".ocr_line").css("font-size");
			$(this).html("<img src='http://0.0.0.0:5100/captcha/" + encodeURIComponent(theWord) + "/" + fontSize + "' />");
		});
		
		return "<html>" + $("html").html() + "</html>";
	}));

	fs.write('output.html', newHtml, 'w');

	//console.log(document.documentELement.innerHTML);
	
	page.render('output.png');
	phantom.exit();
});


