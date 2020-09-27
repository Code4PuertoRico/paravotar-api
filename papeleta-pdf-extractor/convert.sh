#!/bin/bash

# Usage: ./convert ./directory-with-pdfs-here
# Installation: brew install xpdf imagemagick ghostscript

if [ -z "$1" ]; then
  echo "Usage: ./convert ./directory-with-pdfs-here\n"
  exit 1
fi

for f in $1/*.pdf; do
  filename=$(basename "$f")
  base_filename="${filename%%.*}"
  base_output="$1/$base_filename"
  ppm_output="$1/$base_filename-000001.ppm"
  jpg_output="$1/$base_filename-1.jpg"
  echo "=> Converting $filename to $ppm_output..."
  pdftoppm -f 1 -l 1 "$f" "$base_output"

  echo "=> Converting $ppm_output to jpg..."
  convert "$ppm_output" -resize 3400x "$jpg_output"

  rm "$ppm_output"
  echo "=> Done!\n"
done
