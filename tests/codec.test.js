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
  expect(decoded).toBe(instruction)

  const encoded = VTP.encodeInstruction(instruction)
  expect(encoded).toBe(encodedInstruction)
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
    amplitude: 0x3BA
  })
})

test('invalid instruction code yields error', () => {
  const invalidInstructionWord = 0xFE000000;
  const invalidInstruction = { "type": "foo" }

  expect(VTP.encodeInstruction(invalidInstruction)).toThrow()
  expect(VTP.decodeInstruction(invalidInstructionWord)).toThrow()
})
