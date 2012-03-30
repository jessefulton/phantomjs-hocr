#!/bin/bash
# convert.sh
# argument = pdf


if [ ! -n "$1" ]
then
  echo "Usage: `basename $0` argument1 argument2 etc."
  exit $E_BADARGS
fi  


# absolute directory of script
DIR="$( cd "$( dirname "$0" )" && pwd )"


#TODO: check to see if directory exists for this pdf
#move into relative "processed" directory or something...

filename=$(basename $1)
extension=${filename##*.}
filename=${filename%.*}

#convert -density 300 -compress None -monochrome -median 1 $1 $filename%03d.tiff
#convert -density 300 $1 $filename%03d.png

for filename in $(ls -a *.tiff)
do
	tesseract $filename hocr_$filename -l eng ../hocr.config
done;
