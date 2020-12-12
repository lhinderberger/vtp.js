/*
 * Copyright 2020 Lucas Hinderberger
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as VTP from '../src/index.js'

function testCodec(encodedInstruction, instruction) {
  const decoded = VTP.decodeInstruction(encodedInstruction)
  expect(decoded).toStrictEqual(instruction)

  const encoded = VTP.encodeInstruction(instruction)
  expect(encoded).toStrictEqual(encodedInstruction)
}


test('increment time can be en/decoded', () => {
  testCodec(0x056789AB, { type: "IncrementTime", timeOffset: 0x56789AB })
  testCodec(0x0CCCCCCD, { type: "IncrementTime", timeOffset: 0xCCCCCCD })
})


test('set amplitude can be en/decoded', () => {
  testCodec(0x2AACCD6B, {
    type: "SetAmplitude",
    channelSelect: 0xAA,
    timeOffset: 0x333,
    amplitude: 0x16B
  })
})

test('set frequency can be en/decoded', () => {
  testCodec(0x1AC56BBA, {
    type: "SetFrequency",
    channelSelect: 0xAC,
    timeOffset: 0x15A,
    frequency: 0x3BA
  })
})

test('invalid instruction code yields error', () => {
  const invalidInstructionWord = 0xFE000000;
  
  try {
    VTP.decodeInstruction(invalidInstructionWord)
  }
  catch(err) {
    expect(err).toMatchObject({ code: VTP.ErrorCode.INVALID_INSTRUCTION_CODE, message: expect.stringMatching(/.+/) })
  }
})

test('encoding invalid instruction type yields error', () => {
  const invalidInstruction = { "type": "foo" }

  try {
    VTP.encodeInstruction(invalidInstruction)
  }
  catch(err) {
    expect(err).toMatchObject({ code: VTP.ErrorCode.INVALID_INSTRUCTION_TYPE, message: expect.stringMatching(/.+/) })
  }
})

test('instruction words can be read/written to/from bytes', () => {
  const fileContents = new Uint8Array([
    0x10, 0x00, 0x00, 0xEA, 0x20, 0x00, 0x00, 0x7B, 0x10, 0x20, 0x01, 0x59,
    0x10, 0x20, 0xC9, 0xC8, 0x10, 0x10, 0x03, 0x15, 0x00, 0x00, 0x07, 0xD0,
    0x20, 0x00, 0x00, 0xEA, 0x10, 0x20, 0x02, 0x37
  ])

  const fileContentsWords = [
    0x100000ea, 0x2000007b, 0x10200159, 0x1020c9c8,
    0x10100315, 0x000007d0, 0x200000ea, 0x10200237
  ]


  const wordsRead = VTP.readInstructionWords(fileContents.buffer)
  const bytesWritten = VTP.writeInstructionWords(fileContentsWords)

  expect(wordsRead).toStrictEqual(fileContentsWords)
  expect(new Uint8Array(bytesWritten)).toStrictEqual(fileContents)
})

test('readInstructionWords detects incorrectly sized buffer', () => {
  try {
    VTP.readInstructionWords(new ArrayBuffer(7))
  }
  catch(err) {
    expect(err).toMatchObject({ code: VTP.ErrorCode.INVALID_BUFFER_LENGTH, message: expect.stringMatching(/.+/) })
  }
})
