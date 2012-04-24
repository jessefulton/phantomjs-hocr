#!/bin/bash
# convert.sh
# argument1 = pdf
#
# TODO: This breaks if there are spaces in the file name...
#
# This file will create hOCR versions of PDF files. It will also generate PDF & TIFF versions of each page within the PDF

if [ ! -n "$1" ]
then
	echo "ERROR: You must supply a file to convert"
	echo "USAGE: `basename $0` file.pdf"
	exit $E_BADARGS
fi  


# absolute directory of script
DIR="$( cd "$( dirname "$0" )" && pwd )"

HOCR_DIR="${DIR}/processed/hocr"
CAPTCHAFY_DIR="${DIR}/processed/captchafy"

#TODO: check to see if directory exists for this pdf
#move into relative "processed" directory or something...

filename=$(basename $1)
extension=${filename##*.}
filename=${filename%.*}

HOCR_DIR="${HOCR_DIR}/${filename}"
CAPTCHAFY_DIR="${CAPTCHAFY_DIR}/${filename}"

rm -rf $HOCR_DIR
mkdir $HOCR_DIR

convert -density 300 -compress None -monochrome -median 1 $1 "$HOCR_DIR/${filename}%03d.tiff"
convert -density 300 $1 "$HOCR_DIR/${filename}%03d.png"

pushd $HOCR_DIR

for converted in $(ls -a *.tiff)
do
	newfilename=$(basename $converted)
	newextension=${newfilename##*.}
	newfilename=${newfilename%.*}
	# tesseract $converted ./hocr/${newfilename} -l eng ../hocr.config
	tesseract $converted ${newfilename} -l eng ${DIR}/hocr.config
done;

popd