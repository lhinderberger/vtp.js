# vtp.js
A port of [libvtp](https://github.com/lhinderberger/libvtp) to JavaScript

## Summary
TODO

## Usage
TODO

## Running the unit tests
To run the unit tests, use

```bash
npm test
```

When opening the project in an IDE, you might have to adjust your Jest test plugin to
use the `npm test` command, as it currently supplies additional parameters to node
for being able to test ES6 modules.

Once full ES6 Module support is available and enabled in Node by default, that should
no longer be necessary.

## Building the Documentation
You can generate the API documentation for the JavaScript interface using the JSDoc tool
and the `jsdoc-conf.json` file at the root of the source tree.

Simply run

```bash
jsdoc -c jsdoc-config.json
```

and the API documentation for the JavaScript interface should appear in `build/doc`.

**Warning:** Please note that the generated documentation will contain parts of
whatever template you choose (or what is set up by default in your JSDoc tool),
thus additional licensing terms may apply to the generated documentation files.

## Copyright
vtp.js is (C) 2020 Lucas Hinderberger

It is licensed under the Apache Licence Version 2.0.
For details, please refer to the [LICENCE](./LICENSE) file and
the [NOTICE](./NOTICE) file.

## Contact
The repository of vtp.js can be found at https://github.com/lhinderberger/vtp.js

You're welcome to file bug reports, other issues and pull requests there.

You can also contact the author via email at mail@lhinderberger.com

