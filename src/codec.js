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

import './instruction_types.js'


/**
 * Decodes a VTP binary instruction word
 * 
 * @param {Number} instruction The VTP instruction word to be decoded
 * @returns {Instruction} An object describing the decoded VTP instruction
 */
export function decodeInstruction(instruction) {
  throw "Not implemented!"
}


/**
 * Encodes an Instruction object into its VTP binary representation
 *
 * @param {Instruction} instruction The instruction to be encoded
 * @returns {Number} The VTP binary representation of the given Instruction
 */
export function encodeInstruction(instruction) {
  throw "Not implemented!"
}


/**
 * Calculates the time offset of a given VTP instruction
 * 
 * @param {Instruction} instruction  The instruction of which the time offset shall be calculated
 * @returns {Number} The instruction's time offset in milliseconds. If the instruction doesn't support an offset, this returns 0.
 */
export function getTimeOffset(instruction) {
  throw "Not implemented!"
}
