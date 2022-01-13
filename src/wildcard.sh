#!/bin/bash
# This is a neat little hack.
# When linking .mjs files to the bin directory,
# the include paths are all messed up because the files think
# that they actually are in the bin directory.

# Instead, link this shell file as all the bin files
# And it'll call the desired utility js file and forward all arguments.
SCRIPT=$(basename $0)
if [[ $SCRIPT == "nbins" ]]
then
	cd ~/.nbins
    ./nbins.mjs $@
else
	cd $NSCRIPTS_PATH
    ./$SCRIPT.mjs $@
fi