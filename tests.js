/* global describe, it */

var assert = require("assert");
var manipulator = require("./index");
var list = manipulator.list;

function dummy (classList) {
    
    var attributes = {
        "class": classList || ""
    };
    
    return {
        setAttribute: function (name, value) { attributes[name] = value; },
        getAttribute: function (name) { return attributes[name]; }
    };
}

function expectThrow (fn, msg) {
    try {
        fn();
        assert(false, msg);
    }
    catch (e) {
        // ...
    }
}

function startsWithBa (str) {
    return !!str.match(/^ba/);
}

function not (fn) {
    return function () { return !fn.apply(null, arguments); };
} 

function longerThanThree (str) {
    return str.length > 3;
}

describe("list", function () {
    
    describe("list(classes)", function () {
        
        it("creates a class list wrapper given a string", function () {
            assert.equal(list("foo bar").toString(), "foo bar");
        });
        
        it("creates a class list wrapper given a DOM Element", function () {
            assert.equal(list(dummy("foo bar")).toString(), "foo bar");
        });
        
        it("accepts only objects and strings as input", function () {
            
            assert.equal(list("foo [bla] bawe23ur0u2!").toString(), "foo [bla] bawe23ur0u2!");
            assert.equal(list(dummy("foo bar")).toString(), "foo bar");
            
            [undefined, null, 0, 1, 2, 100, -50, /foo/, NaN, Infinity].forEach(function (input) {
                expectThrow(function () { list(input); }, "Must throw on: " + input);
            });
        });
    });
    
    describe(".add(name)", function () {
        
        it("adds a class name to the list", function () {
            assert.equal(list("foo bar").add("baz").toString(), "foo bar baz");
        });
        
        it("adds a class name to the list only once", function () {
            assert.equal(list("foo bar").add("baz").add("baz").toString(), "foo bar baz");
        });
        
        it("adds many class names to the list given a class string with spaces", function () {
            assert.equal(list("foo bar").add("baz nub").toString(), "foo bar baz nub");
        });
    });
    
    describe(".addMany(names)", function () {
        
        it("works for arrays as input", function () {
            assert.equal(list("foo").addMany(["bar", "baz", "nub"]).toString(), "foo bar baz nub");
        });
        
        it("works for class strings as input", function () {
            assert.equal(list("foo").addMany("bar baz nub").toString(), "foo bar baz nub");
        });
    });
    
    describe(".remove(name)", function () {
        
        it("removes a class name from the list", function () {
            assert.equal(list("foo bar baz").remove("bar").toString(), "foo baz");
        });
        
        it("removes many class names from the list given a class string with spaces", function () {
            assert.equal(list("foo bar baz").remove("foo baz").toString(), "bar");
        });
    });
    
    describe(".removeMany(names)", function () {
        
        it("removes class names from the list given an array of names", function () {
            assert.equal(list("foo bar baz").removeMany(["bar", "baz"]).toString(), "foo");
        });
        
        it("removes class names from the list given a class string with spaces", function () {
            assert.equal(list("foo bar baz").removeMany("bar baz").toString(), "foo");
        });
    });
    
    describe(".has(name)", function () {
        
        it("returns true when given an existing name, false otherwise", function () {
            assert.equal(list("foo bar baz").has("bar"), true);
            assert.equal(list("foo bar baz").has("nub"), false);
        });
        
        it("works for class strings with spaces as input as well", function () {
            assert.equal(list("foo bar baz").has("bar baz"), true);
            assert.equal(list("foo bar baz").has("nub bar"), false);
        });
    });
    
    describe(".hasAll(names)", function () {
        
        it("returns true when given only existing names, false otherwise", function () {
            assert.equal(list("foo bar baz").hasAll(["bar", "foo"]), true);
            assert.equal(list("foo bar baz").hasAll(["nub", "baz"]), false);
        });
        
        it("works for class strings as well", function () {
            assert.equal(list("foo bar baz").hasAll("bar foo"), true);
            assert.equal(list("foo bar baz").hasAll("nub baz"), false);
        });
    });
    
    describe(".hasSome(name)", function () {
        
        it("returns true when at least one name exists, false otherwise", function () {
            assert.equal(list("foo bar baz").hasSome(["bar", "foo"]), true);
            assert.equal(list("foo bar baz").hasSome(["nub", "baz"]), true);
            assert.equal(list("foo bar baz").hasSome(["nub", "biz"]), false);
        });
        
        it("works for class strings as well", function () {
            assert.equal(list("foo bar baz").hasSome("bar nub foo"), true);
            assert.equal(list("foo bar baz").hasSome("nub biz"), false);
        });
    });
    
    describe(".toggle(name)", function () {
        
        it("removes a name if it exists, adds it otherwise", function () {
            assert.equal(list("foo bar baz").toggle("bar").toString(), "foo baz");
            assert.equal(list("foo baz").toggle("bar").toString(), "foo baz bar");
        });
        
        it("works for class strings with spaces, too", function () {
            assert.equal(list("foo bar baz").toggle("bar foo").toString(), "baz");
            assert.equal(list("foo baz bar").toggle("baz nub").toString(), "foo bar nub");
        });
    });
    
    describe(".toggleMany(names)", function () {
        
        it("removes names if they exists, adds them otherwise", function () {
            assert.equal(list("foo bar baz").toggleMany(["bar", "baz"]).toString(), "foo");
            assert.equal(list("foo baz").toggleMany(["bar", "baz"]).toString(), "foo bar");
        });
        
        it("works for class strings with spaces, too", function () {
            assert.equal(list("foo bar baz").toggleMany("bar foo").toString(), "baz");
            assert.equal(list("foo baz bar").toggleMany("baz nub").toString(), "foo bar nub");
        });
    });
    
    describe(".clear()", function () {
        
        it("removes all names", function () {
            assert.equal(list("foo bar baz").clear().toString(), "");
            assert.equal(list("foo baz").clear().toString(), "");
        });
    });
    
    describe(".sort()", function () {
        
        it("must sort the names alphabetically", function () {
            assert.equal(list("foo bar baz").sort().toString(), "bar baz foo");
            assert.equal(list("b0 b1 a4 x10 y").sort().toString(), "a4 b0 b1 x10 y");
        });
    });
    
    describe(".filter(fn)", function () {
        
        it("must remove all names not matched by a given predicate function", function () {
            assert.equal(list("foo bar baz").filter(startsWithBa).toString(), "bar baz");
            assert.equal(list("footer bar mana").filter(not(longerThanThree)).toString(), "bar");
        });
    });
    
    describe(".apply()", function () {
        
        it("changes must only be written to the element on .apply()", function () {
            
            var el = dummy("foo bar baz");
            var l = list(el);
            
            l.remove("bar").add("nub");
            
            assert.equal(el.getAttribute("class"), "foo bar baz");
            
            l.apply();
            
            assert.equal(el.getAttribute("class"), "foo baz nub");
        });
    });
    
    describe(".copyTo(otherElement)", function () {
        
        it("must create a new class list wrapper with the same classes as the source", function () {
            
            var el = dummy();
            
            list("foo bar baz").remove("bar").add("nub").copyTo(el).apply();
            
            assert.equal(el.getAttribute("class"), "foo baz nub");
        });
    });
});
