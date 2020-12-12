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

import expect from 'expect.js'

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

describe('fold', () => {
  it('can create a proper size accumulator', () => {
    let accumulator = VTP.createAccumulator(4)

    expect(accumulator).to.eql({
      channels: [
        { amplitude: 0, frequency: 0 }, { amplitude: 0, frequency: 0 },
        { amplitude: 0, frequency: 0 }, { amplitude: 0, frequency: 0 }
      ],
      millisecondsElapsed: 0
    })
  })

  it('yields the expected accumulation', () => {
    let accumulator = VTP.createAccumulator(3)

    VTP.fold(accumulator, testdataInstructions)

    expect(accumulator).to.eql({
      channels: [
        { amplitude: 234, frequency: 789 },
        { amplitude: 234, frequency: 567 },
        { amplitude: 234, frequency: 234 }
      ],
      millisecondsElapsed: 2050
    })
  })

  it('stops at the right time (foldUntil)', () => {
    let accumulator = VTP.createAccumulator(3)

    let nProcessed = VTP.foldUntil(accumulator, testdataInstructions, 0)
    expect(nProcessed).to.eql(3)
    expect(accumulator).to.eql({
      channels: [
        { amplitude: 123, frequency: 234 },
        { amplitude: 123, frequency: 345 },
        { amplitude: 123, frequency: 234 }
      ],
      millisecondsElapsed: 0
    })

    nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(3), 10)
    expect(nProcessed).to.eql(0)
    expect(accumulator).to.eql({
      channels: [
        { amplitude: 123, frequency: 234 },
        { amplitude: 123, frequency: 345 },
        { amplitude: 123, frequency: 234 }
      ],
      millisecondsElapsed: 0
    })

    nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(3), 50)
    expect(nProcessed).to.eql(2)
    expect(accumulator).to.eql({
      channels: [
        { amplitude: 123, frequency: 789 },
        { amplitude: 123, frequency: 456 },
        { amplitude: 123, frequency: 234 }
      ],
      millisecondsElapsed: 50
    })

    nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(5), 2050)
    expect(nProcessed).to.eql(3)
    expect(accumulator).to.eql({
      channels: [
        { amplitude: 234, frequency: 789 },
        { amplitude: 234, frequency: 567 },
        { amplitude: 234, frequency: 234 }
      ],
      millisecondsElapsed: 2050
    })

    nProcessed = VTP.foldUntil(accumulator, testdataInstructions.slice(8), 231195)
    expect(nProcessed).to.eql(0)
    expect(accumulator).to.eql({
      channels: [
        { amplitude: 234, frequency: 789 },
        { amplitude: 234, frequency: 567 },
        { amplitude: 234, frequency: 234 }
      ],
      millisecondsElapsed: 2050
    })
  })

  it('does nothing when folding until the past', () => {
    let accumulator = VTP.createAccumulator(3)

    VTP.foldUntil(accumulator, testdataInstructions, 0)
    VTP.foldUntil(accumulator, testdataInstructions, 50)
    VTP.foldUntil(accumulator, testdataInstructions, 5)

    expect(accumulator).to.eql({
      channels: [
        { amplitude: 123, frequency: 789 },
        { amplitude: 123, frequency: 456 },
        { amplitude: 123, frequency: 234 }
      ],
      millisecondsElapsed: 50
    })
  })

  it('yields error when input contains invalid instruction type', () => {
    let accumulator = createAccumulator(3);

    try {
      VTP.foldSingle(accumulator, {
        type: "FooBar", 
        channelSelect: 0,
        timeOffset: 0,
        amplitude: 123
      })
    }
    catch(err) {
      expect(err.code).to.eql(VTP.ErrorCode.INVALID_INSTRUCTION_TYPE)
    }
  })

  it('does nothing on empty input', () => {
    let accumulator = {
      channels: [
        { amplitude: 2311, frequency: 1995 },
        { amplitude: 2311, frequency: 1995 },
        { amplitude: 2311, frequency: 1995 }
      ],
      millisecondsElapsed: 0
    }

    VTP.fold(accumulator, [])

    expect(accumulator).to.eql({
      channels: [
        { amplitude: 2311, frequency: 1995 },
        { amplitude: 2311, frequency: 1995 },
        { amplitude: 2311, frequency: 1995 }
      ],
      millisecondsElapsed: 0
    })
  })

  it('yields error when encountering out-of-range channel', () => {
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
      expect(err.code).to.eql(VTP.ErrorCode.CHANNEL_OUT_OF_RANGE)
    }
  })
})
