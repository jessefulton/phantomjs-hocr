Application for generating formatted HTML pages from hOCR output using jQuery + PhantomJS.


Requires Tesseract, ImageMagick, and CasperJS


Usage
=======
	sh hocr.sh sources/filename.pdf 
	casperjs render.js processed/hocr/filename/filename001.html <-- Not needed any more

To Do
=======
Bash script breaks for file names with spaces
Captchafied pages/images still going into hocr directory
Set up captchafy to run on all *.html files (or some matching pattern) in a directory