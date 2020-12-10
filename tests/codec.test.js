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

test('increment time can be decoded', () => {
  const encoded = 0x056789AB
  const decoded = VTP.decodeInstruction(encoded)

  expect(decoded).toBe({ type: "IncrementTime", timeOffset: 0x56789AB })
})

test.todo('increment time can be encoded')
test.todo('set amplitude can be decoded')
test.todo('set amplitude can be encoded')
test.todo('set frequency can be decoded')
test.todo('set frequency can be encoded')
test.todo('invalid instruction code yields error')
test.todo('array can be decoded')
test.todo('array can be encoded')