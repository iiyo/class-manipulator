//
// # class-manipulator
//
// A chainable wrapper API for manipulating a DOM Element's classes or class strings.
//

/* global module */

//
// ## Public API
//

//
// **list(element) / list(classString)**
//
// Creates a chainable API for manipulating an element's list of classes. No changes
// are made to the DOM Element unless `.apply()` is called.
//
//     DOMElement|string -> object
//

function list (element) {
    
    element = typeof element === "object" ? element : dummy(element);
    
    var classes = parse(element), controls;
    
//
// **.apply()**
//
// Applies class list to the source element.
//
//     void -> object
//
    
    function apply () {
        element.setAttribute("class", toString());
        return controls;
    }
    
//
// **.add(name)**
//
// Adds a class to the element's list of class names.
//
//     string -> object
//
    
    function add (name) {
        
        if (hasSpaces(name)) {
            return addMany(classStringToArray(name));
        }
        
        if (!has(name)) {
            classes.push(name);
        }
        
        return controls;
    }
    
//
// **.addMany(names)**
//
// Adds many classes to the list at once.
//
//     [string] -> object
//
    
    function addMany (newClasses) {
        
        if (!Array.isArray(newClasses)) {
            return add(newClasses);
        }
        
        newClasses.forEach(add);
        
        return controls;
    }
    
//
// **.has(name)**
//
// Checks whether a class is in the element's list of class names.
//
//     string -> boolean
//
    
    function has (name) {
        
        if (hasSpaces(name)) {
            return hasAll(name);
        }
        
        return classes.indexOf(name) >= 0;
    }
    
//
// **.hasSome(names)**
//
// Checks whether the list contains at least one of the supplied classes.
//
//     [string] -> boolean
//
    
    function hasSome (names) {
        return Array.isArray(names) ?
            names.some(has) :
            hasSome(classStringToArray(names));
    }
    
//
// **.hasAll(names)**
//
// Checks whether the list contains all of the supplied classes.
//
//     [string] -> boolean
//
    
    function hasAll (names) {
        return Array.isArray(names) ?
            names.every(has) :
            hasAll(classStringToArray(names));
    }
    
//
// **.remove(name)**
//
// Removes a class from the element's list of class names.
//
//     string -> object
//
    
    function remove (name) {
        
        if (hasSpaces(name)) {
            return removeMany(classStringToArray(name));
        }
        
        if (has(name)) {
            classes.splice(classes.indexOf(name), 1);
        }
        
        return controls;
    }
    
//
// **.removeMany(names)**
//
// Removes many classes from the list at once.
//
//     [string] -> object
//
    
    function removeMany (toRemove) {
        
        if (!Array.isArray(toRemove)) {
            return remove(toRemove);
        }
        
        toRemove.forEach(remove);
        
        return controls;
    }
    
//
// **.toggle(name)**
//
// Removes a class from the class list when it's present or adds it to the list when it's not.
//
//     string -> object
//
    
    function toggle (name) {
        
        if (hasSpaces(name)) {
            return toggleMany(classStringToArray(name));
        }
        
        return (has(name) ? remove(name) : add(name));
    }
    
//
// **.toggleMany(names)**
//
// Toggles many classes at once.
//
//     [string] -> object
//
    
    function toggleMany (names) {
        
        if (Array.isArray(names)) {
            names.forEach(toggle);
            return controls;
        }
        
        return toggleMany(classStringToArray(names));
    }
    
//
// **.toArray()**
//
// Creates an array containing all of the list's class names.
//
//     void -> [string]
//
    
    function toArray () {
        return classes.slice();
    }
    
//
// **.toString()**
//
// Returns a string containing all the classes in the list separated by a space character.
//
    
    function toString () {
        return classes.join(" ");
    }
    
//
// **.copyTo(otherElement)**
//
// Creates a new empty list for another element and copies the source element's class list to it.
//
//     DOM Element -> object
//
    
    function copyTo (otherElement) {
        return list(otherElement).clear().addMany(classes);
    }
    
//
// **.clear()**
//
// Removes all classes from the list.
//
//     void -> object
//
    
    function clear () {
        classes.length = 0;
        return controls;
    }
    
//
// **.filter(fn)**
//
// Removes those class names from the list that fail a predicate test function.
//
//     (string -> number -> object -> boolean) -> object
//
    
    function filter (fn) {
        
        classes.forEach(function (name, i) {
            if (!fn(name, i, controls)) {
                remove(name);
            }
        });
        
        return controls;
    }
    
//
// **.sort([fn])**
//
// Sorts the names in place. A custom sort function can be applied optionally. It must have
// the same signature as JS Array.prototype.sort() callbacks.
//
//     void|function -> object
//
    
    function sort (fn) {
        classes.sort(fn);
        return controls;
    }
    
//
// **.size()**
//
// Returns the number of classes in the list.
//
//     void -> number
//
    
    function size () {
        return classes.length;
    }
    
    controls = {
        add: add,
        addMany: addMany,
        has: has,
        hasSome: hasSome,
        hasAll: hasAll,
        remove: remove,
        removeMany: removeMany,
        toggle: toggle,
        toggleMany: toggleMany,
        apply: apply,
        clear: clear,
        copyTo: copyTo,
        toArray: toArray,
        toString: toString,
        filter: filter,
        sort: sort,
        size: size
    };
    
    return controls;
}

//
// **add(element, name)**
//
// Adds a class to a DOM Element.
//
//    DOM Element -> string -> object
//

function add (element, name) {
    return list(element).add(name).apply();
}

//
// **remove(element, name)**
//
// Removes a class from a DOM Element.
//
//     DOM Element -> string -> object
//

function remove (element, name) {
    return list(element).remove(name).apply();
}

//
// **toggle(element, name)**
//
// Removes a class from a DOM Element when it has the class or adds it when the element doesn't
// have it.
//
//     DOMElement -> string -> object
//

function toggle (element, name) {
    return list(element).toggle(name).apply();
}

//
// **has(element, name)**
//
// Checks whether a DOM Element has a class.
//
//     DOMElement -> string -> boolean
//

function has (element, name) {
    return list(element).has(name);
}

//
// ## Exported functions
//

module.exports = {
    add: add,
    remove: remove,
    toggle: toggle,
    has: has,
    list: list
};


//
// ## Private functions
//

//
// Extracts the class names from a DOM Element and returns them in an array.
//
//     DOMElement -> [string]
//

function parse (element) {
    return classStringToArray(element.getAttribute("class") || "");
}

//
//     string -> [string]
//

function classStringToArray (classString) {
    return ("" + classString).replace(/\s+/, " ").trim().split(" ").filter(stringNotEmpty);
}

//
//     string -> boolean
//

function stringNotEmpty (str) {
    return str !== "";
}

//
//     string -> boolean
//

function hasSpaces (str) {
    return !!str.match(/\s/);
}

//
// Creates a dummy DOMElement for when we don't have an actual one for a list.
//
//     string -> object
//

function dummy (classList) {
    
    if (typeof classList !== "string") {
        throw new Error("Function list() expects an object or string as its argument.");
    }
    
    var attributes = {
        "class": "" + classStringToArray(classList).join(" ")
    };
    
    return {
        setAttribute: function (name, value) { attributes[name] = value; },
        getAttribute: function (name) { return attributes[name]; }
    };
}
