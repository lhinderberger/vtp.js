# vtp.js
A port of [libvtp](https://github.com/lhinderberger/libvtp) to JavaScript

## Summary
vtp.js is a library for encoding and decoding vibrotactile patterns using
the (in-development) VTP format.

It is a port of the C library libvtp to JavaScript, with its API adapted to
closer match JavaScript's capabilities and conventions.

Specification drafts can be found in the `doc/` subdirectory of the original
[libvtp repository](https://github.com/lhinderberger/libvtp).

The library contains the following modules:

- **`codec`**
  provides an abstraction layer for reading/writing VTP Binary files
- **`fold`**
  provides a fold algorithm to accumulate the effects of multiple
  VTP instructions, e.g. for the purpose of simulation or mapping VTP to
  a sampling-like interface

The CLI tools of the original libvtp were not ported to JavaScript.

## Usage
### Installation
vtp.js is distributed in two distinct ways:

- As an NPM package (ES6 modules), especially for use with bundlers and/or
  transpilers like webpack and babel.
- As a pre-bundled UMD module, usable in browsers and Node.js without a prior
  transpilation / bundling step.

#### NPM Module
To install the vtp.js NPM module, execute

```
npm install --save vtp.js
```

Please note that the vtp.js NPM module is an ES6 module, so this will require
either transpilation or a modern Node.js runtime with support for ES6 modules
enabled.

If you're using a development stack that's based on webpack and babel, like
for example vue-cli, this is the version for you.

#### Pre-built vtp.js (UMD distribution)
To install the pre-built vtp.js UMD module, you can either

- Download a vtp.js UMD release from GitHub (releases page)
- or build the UMD module yourself by running `npm run build` in the source tree

This version can be included using a HTML `<script>` tag or by using `require()`
in Node, without needing prior transpilation / bundling.

Note that when including this version via a `<script>` tag, the vtp.js API
will be available over the global `VTP` object, to prevent namespace collisions.

### API Documentation
The source code of vtp.js is annotated in the JSDoc format.

You can use any JSDoc-compatible tool to generate your own API documentation.

An online version of the API Documentation is available under
https://github.com/lhinderberger/vtp.js/wiki

### Examples
#### Decoding a single VTP Binary instruction
```javascript
const instruction = VTP.decodeInstruction(0x2AACCD6B)
```

After that, `instruction` contains:

```javascript
{
  type: "SetAmplitude",
  channelSelect: 0xAA,
  timeOffset: 0x333,
  amplitude: 0x16B
}
```

#### Encoding a single VTP instruction
```javascript
const instruction = {
  type: "SetFrequency",
  channelSelect: 0xAC,
  timeOffset: 0x15A,
  frequency: 0x3BA
}

const encodedInstruction = VTP.encodeInstruction(instruction)
```

After that, `encodedInstruction` contains `0x1AC56BBA`

#### Complex example: Decoding a VTP Binary file in a website
This example decodes a VTP Binary file and prints an explanation of its contents
to the console.

```html
<script src="vtp.js"></script>

<script type="text/javascript">
  function fetchVTPFile() {
    // In the real world, this function could e.g. fetch a VTP Binary file
    // from a server.
    // In this example, we'll simply return a hard-coded ArrayBuffer
    return new Uint8Array([
      0x10, 0x00, 0x00, 0xEA, 0x20, 0x00, 0x00, 0x7B, 0x10, 0x20, 0x01, 0x59,
      0x10, 0x20, 0xC9, 0xC8, 0x10, 0x10, 0x03, 0x15, 0x00, 0x00, 0x07, 0xD0,
      0x20, 0x00, 0x00, 0xEA, 0x10, 0x20, 0x02, 0x37
    ]).buffer
  }

  function swapEndianness(i) {
    return 
  }

  const vtpBinaryFile = fetchVTPFile()

  VTP.readInstructionWords(vtpBinaryFile)
    .map(VTP.decodeInstruction)
    .map(console.log)

</script>
```


## Versioning and Compatibility
Versioning of vtp.js follows the [Semantic Versioning](https://semver.org)
convention.

vtp.js keeps a changelog in [RELEASES.md](./RELEASES.md)

Until 1.0.0, any substantial changes to the library (breaking and non-breaking)
will trigger an increase of the minor version, while bug fixes and similar minor
improvements may trigger an increase of the patch version.

vtp.js releases will strive to match the core feature set of the corresponding
minor version of libvtp. While the major and minor versions of vtp.js and libvtp
will be in sync with one another, the patch versions are allowed to diverge.

This means that during initial development, minor versions of vtp.js should be
compatible with one another, as well as with libvtp's corresponding minor
version (e.g vtp.js 0.3.1 and libvtp 0.3.5), but you should excercise caution
when migrating between minor versions.

## Running the unit tests
To run the unit tests, use

```bash
npm test
```

When opening the project in an IDE, you might have to adjust your Jest test
plugin to use the `npm test` command, as it currently supplies additional
parameters to node for being able to test ES6 modules.

Once full ES6 Module support is available and enabled in Node and Jest by
default, that should no longer be necessary.

## Copyright
vtp.js is (C) 2020 Lucas Hinderberger

It is licensed under the Apache Licence Version 2.0.
For details, please refer to the [LICENCE](./LICENSE) file and
the [NOTICE](./NOTICE) file.

## Contact
The repository of vtp.js can be found at https://github.com/lhinderberger/vtp.js

You're welcome to file bug reports, other issues and pull requests there.

You can also contact the author via email at mail@lhinderberger.com
