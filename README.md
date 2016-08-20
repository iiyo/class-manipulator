# class-manipulator

Chainable class list API for manipulating a DOM Element's classes or a class string.

## Installation

    npm install class-manipulator

## Usage

Add class "foo", remove "bar", add or remove "baz", then apply the changes to the element:

```javascript
list(document.querySelector(".myDiv")).add("foo").remove("bar").toggle("baz").apply();
```

Note how the DOM isn't changed until you call `.apply()`. The `class` attribute is only
ever read once no matter how many changes you make to the list.

You can also create a class list wrapper not associated with any element:

```javascript
list("foo bar baz").add("nub").remove("bar").toString(); // "foo baz nub"
```

You can copy a class list to another element like this:

```javascript
list("foo bar baz").copyTo(someElement).apply();
```

You can also sort and filter a class list:

```javascript
function threeCharsLong (str) {
    return str.length === 3;
}

list("foo apple bar baz").filter(threeCharsLong).sort().toString(); // "bar baz foo"
```

For a full reference of the API, see `docs/index.html`. You can also take a look at the
tests at `tests.js` to find out what else you can do with the API.

## Development

If you want to contribute, do so by making a pull request on GitHub. Make sure you do
the following:

 * Update the source code docs if you make changes to the API.
 * Run the test to make sure you didn't break anything.
 * Add new tests if you add new things to the API.
 * Use ESLint on the code and correct any errors reported.

### Running tests

If you don't have it yet, install Mocha:

    npm install -g Mocha

Run the tests:

    mocha tests.js

### Updating the docs

You need to have docco installed to update the documentation:

    npm install -g docco

To update the docs, run:

    docco index.js
