/*
 * Formatter for Selenium 2 / PHP Formatter for PHPUnit_Extentions_Selenium2TestCase client.
 */

if (!this.formatterType) {  // this.formatterType is defined for the new Formatter system
    // This method (the if block) of loading the formatter type is deprecated.
    // For new formatters, simply specify the type in the addPluginProvidedFormatter() and omit this
    // if block in your formatter.
    var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
    subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);
}

function testClassName(testName) {
    return testName.split(/[^0-9A-Za-z]+/).map(
            function(x) {
                return capitalize(x);
            }).join('_') + 'Test';
}

function testMethodName(testName) {
    return "test" + testName.split(/[^0-9A-Za-z]+/).map(
            function(x) {
                return capitalize(x);
            }).join('_');
}

function nonBreakingSpace() {
    return "\"\\u00a0\"";
}

function array(value) {
    var str = '[';
    for (var i = 0; i < value.length; i++) {
        str += string(value[i]);
        if (i < value.length - 1)
            str += ", ";
    }
    str += ']';
    return str;
}

notOperator = function() {
    return "!";
};

Equals.prototype.toString = function() {
    return this.e2.toString() + " == " + this.e1.toString();
};

Equals.prototype.assert = function() {
    //return "assert_equal " + this.e1.toString() + ", " + this.e2.toString();
    return "$this->assertEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
};

Equals.prototype.verify = function() {
    return verify(this.assert());
};

NotEquals.prototype.toString = function() {
    return this.e1.toString() + " != " + this.e2.toString();
};

NotEquals.prototype.assert = function() {
    return this.ref = "->assertNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ")";
};

NotEquals.prototype.verify = function() {
    return verify(this.assert());
};

function joinExpression(expression) {
    return expression.toString() + ".join(\",\")";
}

function statement(expression) {
    expression.noBraces = true;
    return expression.toString() + ";";
}

function assignToVariable(type, variable, expression) {
    return variable + " = " + expression.toString();
}

function ifCondition(expression, callback) {
    return "if " + expression.toString() + "\n" + callback() + "end";
}

function tryCatch(tryStatement, catchStatement, exception) {
    return "try {\n" +
            indents(1) + tryStatement + "\n" +
            "} catch(" + exception + " $e) {\n" +
            indents(1) + catchStatement + "\n" +
            "}";
}

function assertTrue(expression) {
    return "$this->assertTrue(" + expression.toString() + ");";
}

function assertFalse(expression) {
    return "$this->assertFalse(" + expression.invert().toString() + ");";
}

function verify(statement) {
    return "try {\n" +
            indents(1) + statement + "\n" +
            "} catch (PHPUnit_Framework_AssertionFailedError $e) {\n" +
            indents(1) + "array_push($this->verificationErrors, $e->__toString());\n" +
            "}";
}

function verifyTrue(expression) {
    return verify(assertTrue(expression));
}

function verifyFalse(expression) {
    return verify(assertFalse(expression));
}

RegexpMatch.patternAsRegEx = function(pattern) {
    var str = pattern.replace(/\//g, "\\/");
    if (str.match(/\n/)) {
        str = str.replace(/\n/g, '\\n');
        return '/' + str + '/m';
    } else {
        return str = '/' + str + '/';
    }
};

RegexpMatch.prototype.patternAsRegEx = function() {
    return RegexpMatch.patternAsRegEx(this.pattern);
};

RegexpMatch.prototype.toString = function() {
    return "(bool)preg_match('/" + this.pattern.replace(/\//g, "\\/") + "/'," + this.expression + ")";
};

RegexpMatch.prototype.assert = function() {
    return '$this->assertRegExp(' + this.patternAsRegEx() + ', ' + this.expression + ')';
};

RegexpMatch.prototype.verify = function() {
    return verify(this.assert());
};

RegexpNotMatch.prototype.patternAsRegEx = function() {
    return RegexpMatch.patternAsRegEx(this.pattern);
};

RegexpNotMatch.prototype.toString = function() {
    return this.expression + " !~ " + this.patternAsRegEx();
};

RegexpNotMatch.prototype.assert = function() {
    return '$this->assertNotRegExp( ' + this.patternAsRegEx() + ', ' + this.expression + ')';
};

RegexpNotMatch.prototype.verify = function() {
    return verify(this.assert());
};

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

function assertOrVerifyFailure(line, isAssert) {
    var message = '"expected failure"';
    var failStatement = "fail(" + message + ");";
    return "try { " + line + " " + failStatement + "} catch (Exception $e) {}";
}

function pause(milliseconds) {
    return "usleep(" + parseInt(milliseconds, 10) + ");";
}

function echo(message) {
    return "print(" + xlateArgument(message) + ");";
}

function formatComment(comment) {
    return comment.comment.replace(/.+/mg, function(str) {
        return "// " + str;
    });
}

function keyVariable(key) {
    return "$" + key;
}

this.sendKeysMaping = {
    BKSP: "backspace",
    BACKSPACE: "backspace",
    TAB: "tab",
    ENTER: "enter",
    SHIFT: "shift",
    CONTROL: "control",
    CTRL: "control",
    ALT: "alt",
    PAUSE: "pause",
    ESCAPE: "escape",
    ESC: "escape",
    SPACE: "space",
    PAGE_UP: "page_up",
    PGUP: "page_up",
    PAGE_DOWN: "page_down",
    PGDN: "page_down",
    END: "end",
    HOME: "home",
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down",
    INSERT: "insert",
    INS: "insert",
    DELETE: "delete",
    DEL: "delete",
    SEMICOLON: "semicolon",
    EQUALS: "equals",
    NUMPAD0: "numpad0",
    N0: "numpad0",
    NUMPAD1: "numpad1",
    N1: "numpad1",
    NUMPAD2: "numpad2",
    N2: "numpad2",
    NUMPAD3: "numpad3",
    N3: "numpad3",
    NUMPAD4: "numpad4",
    N4: "numpad4",
    NUMPAD5: "numpad5",
    N5: "numpad5",
    NUMPAD6: "numpad6",
    N6: "numpad6",
    NUMPAD7: "numpad7",
    N7: "numpad7",
    NUMPAD8: "numpad8",
    N8: "numpad8",
    NUMPAD9: "numpad9",
    N9: "numpad9",
    MULTIPLY: "multiply",
    MUL: "multiply",
    ADD: "add",
    PLUS: "add",
    SEPARATOR: "separator",
    SEP: "separator",
    SUBTRACT: "subtract",
    MINUS: "subtract",
    DECIMAL: "decimal",
    PERIOD: "decimal",
    DIVIDE: "divide",
    DIV: "divide",
    F1: "f1",
    F2: "f2",
    F3: "f3",
    F4: "f4",
    F5: "f5",
    F6: "f6",
    F7: "f7",
    F8: "f8",
    F9: "f9",
    F10: "f10",
    F11: "f11",
    F12: "f12",
    META: "meta",
    COMMAND: "command"
};

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

function defaultExtension() {
    return this.options.defaultExtension;
}

this.options = {
    receiver: "$this",
    showSelenese: 'false',
    header: "<?php\n"
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
            + indents(1) + "{\n",
    footer: indents(1) + "}\n"
            + "\n"
            + "}\n",
    indent: "2",
    initialIndents: "2",
    defaultExtension: "php",
    extendedClass: 'PHPUnit_Extensions_Selenium2TestCase',
};

this.configForm =
        '<description>Variable for Selenium instance</description>' +
        '<textbox id="options_receiver" />' +
        '<description>Header</description>' +
        '<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
        '<description>Footer</description>' +
        '<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
        '<description>Indent</description>' +
        '<menulist id="options_indent"><menupopup>' +
        '<menuitem label="Tab" value="tab"/>' +
        '<menuitem label="1 space" value="1"/>' +
        '<menuitem label="2 spaces" value="2"/>' +
        '<menuitem label="3 spaces" value="3"/>' +
        '<menuitem label="4 spaces" value="4"/>' +
        '<menuitem label="5 spaces" value="5"/>' +
        '<menuitem label="6 spaces" value="6"/>' +
        '<menuitem label="7 spaces" value="7"/>' +
        '<menuitem label="8 spaces" value="8"/>' +
        '</menupopup></menulist>' +
        '<checkbox id="options_showSelenese" label="Show Selenese"/>';

this.name = "PHPUnit (Selenium2TestCase)";
this.testcaseExtension = ".php";
this.suiteExtension = ".xml";
this.webdriver = true;

WDAPI.Driver = function() {
    this.ref = options.receiver;
};

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

WDAPI.Driver.prototype.back = function() {
    return this.ref + "->back()";
};

WDAPI.Driver.prototype.close = function() {
    return this.ref + "->close()";
};

WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
    return new WDAPI.Element(WDAPI.Driver.searchContext(locatorType, locator));
};

WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
    return new WDAPI.ElementList(WDAPI.Driver.searchContext(locatorType, locator));
};

WDAPI.Driver.prototype.getCurrentUrl = function() {
    return this.ref + "->url()";
};

WDAPI.Driver.prototype.get = function(url) {
    if (url.length > 1 && (url.substring(1, 8) === "http://" || url.substring(1, 9) === "https://")) { // url is quoted
        return this.ref + "->url(" + url + ")";
    } else {
        //return this.ref + "->url($this->baseUrl + " + url + ")";
        return this.ref + "->url(" + url + ")";
    }
};

WDAPI.Driver.prototype.getTitle = function() {
    return this.ref + "->title()";
};

WDAPI.Driver.prototype.getAlert = function() {
    return "close_alert_and_get_its_text()";
};

WDAPI.Driver.prototype.chooseOkOnNextConfirmation = function() {
    return "@accept_next_alert = true";
};

WDAPI.Driver.prototype.chooseCancelOnNextConfirmation = function() {
    return "@accept_next_alert = false";
};

WDAPI.Driver.prototype.refresh = function() {
    return this.ref + "->refresh()";
};

WDAPI.Element = function(ref) {
    this.ref = ref;
};

WDAPI.Element.prototype.clear = function() {
    return this.ref + "->clear()";
};

WDAPI.Element.prototype.click = function() {
    return this.ref + "->click()";
};

WDAPI.Element.prototype.clickAt = function() {
    return this.ref + "->click()";
};

WDAPI.Element.prototype.getAttribute = function(attributeName) {
    return this.ref + "->attribute(" + xlateArgument(attributeName) + ")";
};

WDAPI.Element.prototype.getText = function() {
    return this.ref + "->text()";
};

WDAPI.Element.prototype.isDisplayed = function() {
    return this.ref + "->displayed()";
};

WDAPI.Element.prototype.isSelected = function() {
    return this.ref + "->selected()";
};

WDAPI.Element.prototype.sendKeys = function(text) {
    return this.ref + "->keys(" + xlateArgument(text, 'args') + ")";
};

WDAPI.Element.prototype.submit = function() {
    return this.ref + "->submit()";
};

WDAPI.Element.prototype.select = function(selectLocator) {
//  if (selectLocator.type == 'index') {
//    return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:index, " + selectLocator.string + ")";
//  }
//  if (selectLocator.type == 'value') {
//    return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:value, " + xlateArgument(selectLocator.string) + ")";
//  }
//  return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:text, " + xlateArgument(selectLocator.string) + ")";
    return "$this->select(" + this.ref + ")->selectOptionByLabel(" + xlateArgument(selectLocator.string) + ")";
};

WDAPI.ElementList = function(ref) {
    this.ref = ref;
};

WDAPI.ElementList.prototype.getItem = function(index) {
    return this.ref + "[" + index + "]";
};

WDAPI.ElementList.prototype.getSize = function() {
    return this.ref + ".size";
};

WDAPI.ElementList.prototype.isEmpty = function() {
    return this.ref + ".empty?";
};


WDAPI.Utils = function() {
};

WDAPI.Utils.isElementPresent = function(how, what) {
    return WDAPI.Driver.searchContext(how, what) + "!=null  ? true : false";
};

WDAPI.Utils.isAlertPresent = function() {
    return "alert_present?";
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

SeleniumWebDriverAdaptor.prototype.clickAt = function(elementLocator) {
    var locator = this._elementLocator(this.rawArgs[0]);
    var driver = new WDAPI.Driver();
    return driver.findElement(locator.type, locator.string).click();
};

//$this->timeouts()->implicitWait(5000);
SeleniumWebDriverAdaptor.prototype.setSpeed = function() {
    return '$this->timeouts()->implicitWait(' + this.rawArgs[0] + ')';
};
