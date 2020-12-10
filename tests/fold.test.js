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
import { createAccumulator } from '../src/index.js'

/*
 * Corresponding VTP Assembly Code:
 *
 * freq ch* 234
 * amp ch* 123
 * freq ch2 345
 *
 * freq +50ms ch2 456
 * freq ch1 789
 *
 * time +2000ms
 * amp ch* 234
 * freq ch2 567
 */
const testdataWords = [
  0x100000ea, 0x2000007b, 0x10200159, 0x1020c9c8,
  0x10100315, 0x000007d0, 0x200000ea, 0x10200237
]

const testdataInstructions = testdataWords.map(VTP.decodeInstruction)

test('fold yields expected accumulation', () => {
  let accumulator = VTP.createAccumulator(3)

  VTP.fold(accumulator, testdataInstructions)

  expect(accumulator).toBe({
    channels: [
      { amplitude: 234, frequency: 789 },
      { amplitude: 234, frequency: 567 },
      { amplitude: 234, frequency: 234 }
    ],
    millisecondsElapsed: 2050
  })
})

test('foldUntil stops at the right time', () => {
  let accumulator = VTP.createAccumulator(3)

  let nProcessed = VTP.foldUntil(accumulator, testdataInstructions, 0)
  expect(nProcessed).toBe(3)
  expect(accumulator).toBe({
    channels: [
      { amplitude: 123, frequency: 234 },
      { amplitude: 123, frequency: 234 },
      { amplitude: 123, frequency: 234 }
    ],
    millisecondsElapsed: 0
  })

  nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(3), 10)
  expect(nProcessed).toBe(0)
  expect(accumulator).toBe({
    channels: [
      { amplitude: 123, frequency: 234 },
      { amplitude: 123, frequency: 234 },
      { amplitude: 123, frequency: 234 }
    ],
    millisecondsElapsed: 0
  })

  nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(3), 50)
  expect(nProcessed).toBe(2)
  expect(accumulator).toBe({
    channels: [
      { amplitude: 123, frequency: 789 },
      { amplitude: 123, frequency: 456 },
      { amplitude: 123, frequency: 234 }
    ],
    millisecondsElapsed: 50
  })

  nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(5), 2050)
  expect(nProcessed).toBe(3)
  expect(accumulator).toBe({
    channels: [
      { amplitude: 234, frequency: 789 },
      { amplitude: 234, frequency: 567 },
      { amplitude: 234, frequency: 234 }
    ],
    millisecondsElapsed: 2050
  })

  nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(8), 231195)
  expect(nProcessed).toBe(0)
  expect(accumulator).toBe({
    channels: [
      { amplitude: 234, frequency: 789 },
      { amplitude: 234, frequency: 567 },
      { amplitude: 234, frequency: 234 }
    ],
    millisecondsElapsed: 2050
  })
})

test('foldUntil past does nothing', () => {
  let accumulator = VTP.createAccumulator(3)

  VTP.foldUntil(accumulator, testdataInstructions, 0)
  VTP.foldUntil(accumulator, testdataInstructions, 50)
  VTP.foldUntil(accumulator, testdataInstructions, 5)

  expect(accumulator).toBe({
    channels: [
      { amplitude: 123, frequency: 789 },
      { amplitude: 123, frequency: 456 },
      { amplitude: 123, frequency: 234 }
    ],
    millisecondsElapsed: 50
  })
})

test('fold with no instructions does nothing', () => {
  let accumulator = {
    channels: [
      { amplitude: 2311, frequency: 1995 },
      { amplitude: 2311, frequency: 1995 },
      { amplitude: 2311, frequency: 1995 }
    ],
    millisecondsElapsed: 0
  }

  VTP.fold(accumulator, [])

  expect(accumulator).toBe({
    channels: [
      { amplitude: 2311, frequency: 1995 },
      { amplitude: 2311, frequency: 1995 },
      { amplitude: 2311, frequency: 1995 }
    ],
    millisecondsElapsed: 0
  })
})

test('fold with out-of-range channel yields error', () => {
  let accumulator = createAccumulator(3);

  try {
    VTP.foldSingle(accumulator, {
      type: "SetAmplitude", 
      channelSelect: 23,
      timeOffset: 0,
      amplitude: 123
    })
  }
  catch(err) {
    expect(err).toMatchObject({ code: VTP.ErrorCode.CHANNEL_OUT_OF_RANGE, message: expect.stringMatching(/.+/) })
  }
})
