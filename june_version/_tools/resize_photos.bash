#!/bin/bash

images_dir=$(cd `dirname "$0"`/../images;pwd)
for src in `ls "$images_dir"`
do
  if `echo "$src" | grep -q "__small"`;then
    continue
  fi
  dst=`echo "$src" | sed -r "s/^(.+)\.([^\.]+)$/\1__small.\2/"`
  convert "$images_dir/$src" -resize "640x>" "$images_dir/$dst"
done
