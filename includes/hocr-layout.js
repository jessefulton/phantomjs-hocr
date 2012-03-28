function hocrLayout(bgImg) {

	var getBoundingBox = function(el) {
		var t = $(el).attr('title');
		var matches = t.match(/bbox (\d+) (\d+) (\d+) (\d+)/);//indexOf("bbox");
		return {
			"tlx" : (matches[1])
			, "tly" : (matches[2])
			, "brx" : (matches[3])
			, "bry" : (matches[4])
		}
	}


	if (bgImg) {
		$(document.body).css("background", "transparent url('" + bgImg + "') 0 0 no-repeat");
	}
	
	var pbb = getBoundingBox($("#page_1"));
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

}