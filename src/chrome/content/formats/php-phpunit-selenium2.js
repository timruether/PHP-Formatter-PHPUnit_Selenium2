////////////////////////////////////////////////////////////////////////
// Selenium IDE
// PHP Formatter for PHPUnit_Extentions_Selenium2TestCase
////////////////////////////////////////////////////////////////////////

var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);

/**
 * 
 * @returns {bool}
 */
function useSeparateEqualsForArray() {
    return true;
}

/**
 * 
 * @param {String} testName
 * @returns {@exp;@exp;testName@pro;split@pro;m@call;ap@call;@call;join|@exp;testName@pro;split@pro;m@call;ap@call;@call;join}
 */
function testClassName(testName) {
    return testName.split(/[^0-9A-Za-z]+/).map(
            function(x) {
                return capitalize(x);
            }).join('_') + 'Test';
}

/**
 * 
 * @param {String} testName
 * @returns {@exp;@exp;testName@pro;split@pro;m@call;ap@call;@call;join|@exp;testName@pro;split@pro;m@call;ap@call;@call;join}
 */
function testMethodName(testName) {
    return "test" + testName.split(/[^0-9A-Za-z]+/).map(
            function(x) {
                return capitalize(x);
            }).join('_');
}

/**
 * 
 * @returns {String}
 */
function nonBreakingSpace() {
    return "\"\\u00a0\"";
}

/**
 * 
 * @param {int} value
 * @returns {String}
 */
function array(value) {
    var str = 'array(';
    for (var i = 0; i < value.length; i++) {
        str += string(value[i]);
        if (i < value.length - 1)
            str += ", ";
    }
    str += ')';
    return str;
}

/**
 * 
 * @returns {String}
 */
Equals.prototype.toString = function() {
    return this.e1.toString() + " == " + this.e2.toString();
};

/**
 * 
 * @returns {String}
 */
Equals.prototype.assert = function() {
    statement = '';
    statement += "$result = " + this.e2.toString() + ";\n";
    statement += "$this->assertEquals(" + this.e1.toString() + ", $result);";
    return statement;
};

/**
 * 
 * @returns {String}
 */
Equals.prototype.verify = function() {
    return verify(this.assert());
};

/**
 * 
 * @returns {String}
 */
NotEquals.prototype.toString = function() {
    return this.e1.toString() + " != " + this.e2.toString();
};

/**
 * 
 * @returns {String}
 */
NotEquals.prototype.assert = function() {
    return "$this->assertNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
};

/**
 * 
 * @returns {String}
 */
NotEquals.prototype.verify = function() {
    return verify(this.assert());
};

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function joinExpression(expression) {
    return "implode(',', " + expression.toString() + ")";
}

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function statement(expression) {
    var s = expression.toString();
    if (s.length == 0) {
        return null;
    }
    return s + ';';
}

/**
 * 
 * @param {int} type
 * @param {String} variable
 * @param {object} expression
 * @returns {String}
 */
function assignToVariable(type, variable, expression) {
    return "$" + variable + " = " + expression.toString();
}

/**
 * 
 * @param {String} value
 * @returns {String}
 */
variableName = function(value) {
    return "$" + value;
};

/**
 * 
 * @param {object} expression
 * @param {String} callback
 * @returns {String}
 */
function ifCondition(expression, callback) {
    return "if (" + expression.toString() + ") {\n" + callback() + "}";
}

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function assertTrue(expression) {
    return "$this->assertTrue(" + expression.toString() + ");";
}

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function assertFalse(expression) {
    return "$this->assertFalse(" + expression.toString() + ");";
}

/**
 * 
 * @param {object} statement
 * @returns {String}
 */
function verify(statement) {
    return "try {\n" +
            indents(1) + statement + "\n" +
            "} catch (PHPUnit_Framework_AssertionFailedError $e) {\n" +
            indents(1) + "array_push($this->verificationErrors, $e->__toString());\n" +
            "}";
}

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function verifyTrue(expression) {
    return verify(assertTrue(expression));
}

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function verifyFalse(expression) {
    return verify(assertFalse(expression));
}

/**
 * 
 * @returns {String}
 */
RegexpMatch.prototype.toString = function() {
    return "(bool)preg_match('/" + this.pattern.replace(/\//g, "\\/") + "/'," + this.expression + ")";
};

/**
 * 
 * @param {object} expression
 * @returns {String}
 */
function waitFor(expression) {
    return "for ($second = 0; ; $second++) {\n" +
            indent(1) + 'if ($second >= 60) $this->fail("timeout");\n' +
            indent(1) + "try {\n" +
            indent(2) + (expression.setup ? expression.setup() + " " : "") +
            indent(2) + "if (" + expression.toString() + ") break;\n" +
            indent(1) + "} catch (Exception $e) {}\n" +
            indent(1) + "sleep(1);\n" +
            "}\n";
}

/**
 * 
 * @param {int} line
 * @param {bool} isAssert
 * @returns {String}
 */
function assertOrVerifyFailure(line, isAssert) {
    var message = '"expected failure"';
    var failStatement = "fail(" + message + ");";
    return "try { " + line + " " + failStatement + "} catch (Exception $e) {}";
}

/**
 * 
 * @param {int} milliseconds
 * @returns {String}
 */
function pause(milliseconds) {
    return "usleep(" + parseInt(milliseconds, 10) + ");";
}

/**
 * 
 * @param {String} message
 * @returns {String}
 */
function echo(message) {
    return "print(" + xlateArgument(message) + ");";
}

/**
 * 
 * @param {type} comment
 * @returns {@exp;comment@pro;comment@call;replace}
 */
function formatComment(comment) {
    return comment.comment.replace(/.+/mg, function(str) {
        return "// " + str;
    });
}

/**
 * Returns a string representing the suite for this formatter language.
 *
 * @param testSuite  the suite to format
 * @param filename   the file the formatted suite will be saved as
 */
function formatSuite(testSuite, filename) {
    var suiteClass = /^(\w+)/.exec(filename)[1];
    suiteClass = suiteClass[0].toUpperCase() + suiteClass.substring(1);

    var formattedSuite = "<phpunit>\n"
            + indents(1) + "<testsuites>\n"
            + indents(2) + "<testsuite name='" + suiteClass + "'>\n";

    for (var i = 0; i < testSuite.tests.length; ++i) {
        var testClass = testSuite.tests[i].getTitle();
        formattedSuite += indents(3)
                + "<file>" + testClass + "<file>\n";
    }

    formattedSuite += indents(2) + "</testsuite>\n"
            + indents(1) + "</testsuites>\n"
            + "</phpunit>\n";

    return formattedSuite;
}

/**
 * 
 * @returns {@pro;defaultExtension@this.options}
 */
function defaultExtension() {
    return this.options.defaultExtension;
}

this.options = {
    receiver: '',
    environment: 'firefox',
    extendedClass: 'PHPUnit_Extensions_Selenium2TestCase',
    indent: '4',
    initialIndents: '2',
    showSelenese: 'false',
    defaultExtension: 'php'
};

options.header =
        "<?php\n"
        + "\n"
        + "class ${className} extends ${extendedClass}\n"
        + "{\n"
        + indents(1) + "/**\n"
        + indents(1) + " * Setup\n"
        + indents(1) + " */\n"
        + indents(1) + "public function setUp()\n"
        + indents(1) + "{\n"
        + indents(2) + "\$this->setBrowser('firefox');\n"
        + indents(2) + "\$this->setBrowserUrl('${baseURL}');\n"
        + indents(1) + "}\n"
        + indents(1) + "\n"
        + indents(1) + "/** \n"
        + indents(1) + " * Method ${methodName} \n"
        + indents(1) + " * @test \n"
        + indents(1) + " */ \n"
        + indents(1) + "public function ${methodName}()\n"
        + indents(1) + "{\n";

options.footer =
        indents(1) + "}\n"
        + "\n"
        + "}\n";


this.configForm =
        '<description>Variable for Selenium instance</description>' +
        '<textbox id="options_receiver" />' +
        '<description>Environment</description>' +
        '<textbox id="options_environment" />' +
        '<description>Extended class</description>' +
        '<textbox id="options_extendedClass" />' +
        '<checkbox id="options_showSelenese" label="Show Selenese"/>';

this.name = 'PHPUnit (Selenium2TestCase)';
this.testcaseExtension = '.php';
this.suiteExtension = '.xml';
this.webdriver = true;

/**
 * 
 */
WDAPI.Driver = function() {
    this.ref = '$this';
};

/**
 * 
 * @param {String} locatorType
 * @param {String} locator
 * @returns {String}
 */
WDAPI.Driver.searchContext = function(locatorType, locator) {
    var locatorString = xlateArgument(locator);
    switch (locatorType) {
        case 'xpath':
            return '$this->byXPath(' + locatorString + ')';
        case 'css':
            return '$this->byCssSelector(' + locatorString + ')';
        case 'id':
            return '$this->byId(' + locatorString + ')';
        case 'link':
            return '$this->byLinkText(' + locatorString + ')';
        case 'name':
            return '$this->byName(' + locatorString + ')';
        case 'tag_name':
            return '$this->by("tag name", ' + locatorString + ')';
    }
    throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.back = function() {
    return this.ref + "->back()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.close = function() {
    return this.ref + "->close()";
};

/**
 * 
 * @param {String} locatorType
 * @param {String} locator
 * @returns {@exp;WDAPI@call;Element}
 */
WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
    //return new WDAPI.Element(this.ref + "->findElement(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
    return new WDAPI.Element(WDAPI.Driver.searchContext(locatorType, locator));
};

/**
 * 
 * @param {String} locatorType
 * @param {String} locator
 * @returns {@exp;WDAPI@call;ElementList}
 */
WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
    //return new WDAPI.ElementList(this.ref + "->findElements(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
    return new WDAPI.ElementList(WDAPI.Driver.searchContext(locatorType, locator));
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.getCurrentUrl = function() {
    return this.ref + "->url()";
};

/**
 * 
 * @param {String} url
 * @returns {String}
 */
WDAPI.Driver.prototype.get = function(url) {
    if (url.length > 1 && (url.substring(1, 8) === "http://" || url.substring(1, 9) === "https://")) { // url is quoted
        return this.ref + "->url(" + url + ")";
    } else {
        //return this.ref + "->url($this->baseUrl + " + url + ")";
        return this.ref + "->url(" + url + ")";
    }
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.getTitle = function() {
    return this.ref + "->title()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.refresh = function() {
    return this.ref + "->refresh()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Driver.prototype.isTextPresent = function() {
    return this.ref + "->refresh()";
};

/**
 * 
 * @param {String} ref
 */
WDAPI.Element = function(ref) {
    this.ref = ref;
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.clear = function() {
    return this.ref + "->clear()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.click = function() {
    return this.ref + "->click()";
};

/**
 * 
 * @param {String} attributeName
 * @returns {String}
 */
WDAPI.Element.prototype.getAttribute = function(attributeName) {
    return this.ref + "->attribute(" + xlateArgument(attributeName) + ")";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.getText = function() {
    return this.ref + "->text()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.isDisplayed = function() {
    return this.ref + "->displayed()";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.isSelected = function() {
    return this.ref + "->selected()";
};

/**
 * 
 * @param {String} text
 * @returns {String}
 */
WDAPI.Element.prototype.sendKeys = function(text) {
    return "$this->keys(" + xlateArgument(text) + ")";
};

/**
 * 
 * @returns {String}
 */
WDAPI.Element.prototype.submit = function() {
    return this.ref + "->submit()";
};

/**
 * 
 * @param {String} label
 * @returns {String}
 */
WDAPI.Element.prototype.select = function(label) {
    return "$this->select(" + this.ref + ")->selectOptionByLabel(" + xlateArgument(label) + ")";
};

/**
 * 
 * @param {String} value
 * @returns {String}
 */
WDAPI.Element.prototype.setValue = function(value) {
    return this.ref + "->value(" + xlateArgument(value) + ")";
};

/**
 * 
 * @param {String} ref
 * @returns {void}
 */
WDAPI.ElementList = function(ref) {
    this.ref = ref;
};

/**
 * 
 * @param {int} index
 * @returns {String}
 */
WDAPI.ElementList.prototype.getItem = function(index) {
    return this.ref + "[" + index + "]";
};

/**
 * 
 * @returns {String}
 */
WDAPI.ElementList.prototype.getSize = function() {
    return this.ref + "->size()";
};

/**
 * empty function
 * 
 */
WDAPI.Utils = function() {
};




//////////////////////////////////////////////////////////////////////
// overwrite webdriver.js
//////////////////////////////////////////////////////////////////////

/**
 * 
 * @returns {bool}
 */
SeleniumWebDriverAdaptor.prototype.isTextPresent = function() {
    var target = this.rawArgs[0];
    return '(bool)strpos(strip_tags($this->source()), ' + "'" + target + "'" + ')';
};

/**
 * 
 * @param {type} elementLocator
 * @param {type} text
 * @returns {@exp;webElement@call;setValue}
 */
SeleniumWebDriverAdaptor.prototype.type = function(elementLocator, text) {
    var locator = this._elementLocator(this.rawArgs[0]);
    var driver = new WDAPI.Driver();
    var webElement = driver.findElement(locator.type, locator.string);
    return webElement.setValue(this.rawArgs[1]);
};
