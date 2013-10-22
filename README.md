PHP-Formatter-PHPUnit_Selenium2
===============================

Selenium IDE: PHP Formatter for PHPUnit_Extensions_Selenium2TestCase

This codes is inspired from [Webdriver-PHP-Formatter](https://github.com/jupeter/Webdriver-PHP-Formatter)

## HOW TO USE

Build the xpi file and install it and select it in your Selenium IDE 

### Build
Build xpi file.

Change directory to repository and execute following command:
	$ make


### Install to Firefox browser
1. Drag and drop `build/PHPUnit_Selenium2TestCase_Formatter.xpi` file to your Firefox browser.


### Make Test
1. Open Selenium IDE.
2. Make a testcase.
3. Export a testcase, select `PHP / PHPUnit / PHPUnit Selenium2TestCase` format.
4. Save your testcase.
5. Export Testsuite for PHPUnit  


### Run PHPUnit
1. Run your testcase.

	$ phpunit --colors YOUR_TEST_CASE.php


## License
Apache License 2.0
