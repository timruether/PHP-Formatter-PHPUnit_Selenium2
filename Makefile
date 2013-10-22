#
# Makefile
#     build xpi file (Firefox Add-on file)
#

ZIP     = /usr/bin/zip
SRCDIR  = ./src
XPIFILE = PHPUnit_Selenium2TestCase_Formatter.xpi


all: $(XPIFILE)

$(XPIFILE):; cd $(SRCDIR); $(ZIP) -r ../build/$(XPIFILE) *

clean:; rm -rf ./build/*


