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

import { ErrorCode } from './error.js'
import { InstructionCode } from './instruction_types.js'


/**
 * Decodes a VTP binary instruction word
 * 
 * @param {Number} instruction The VTP instruction word to be decoded
 * @returns {Instruction} An object describing the decoded VTP instruction
 */
export function decodeInstruction(instruction) {
  const code = (instruction & 0xF0000000) >> 28

  switch (code) {
    case InstructionCode.INCREMENT_TIME:
      return { type: "IncrementTime", ...decodeParamsA(instruction, "timeOffset") }
    case InstructionCode.SET_AMPLITUDE:
      return { type: "SetAmplitude", ...decodeParamsB(instruction, "amplitude") }
    case InstructionCode.SET_FREQUENCY:
      return { type: "SetFrequency", ...decodeParamsB(instruction, "frequency") }
    default:
      throw { code: ErrorCode.INVALID_INSTRUCTION_CODE, message: "Invalid instruction code: " + code }
  }
}

/**
 * Encodes an Instruction object into its VTP binary representation
 *
 * @param {Instruction} instruction The instruction to be encoded
 * @returns {Number} The VTP binary representation of the given Instruction
 */
export function encodeInstruction(instruction) {
  const code = instructionTypeToCode(instruction.type)

  let result = code << 28

  if (code == InstructionCode.INCREMENT_TIME)
    result |= encodeParamsA(instruction, "timeOffset")
  else if (code == InstructionCode.SET_AMPLITUDE)
    result |= encodeParamsB(instruction, "amplitude")
  else if (code == InstructionCode.SET_FREQUENCY)
    result |= encodeParamsB(instruction, "frequency")
  else
    throw "This should not be reachable"

  return result
}

/**
 * Reads VTP Binary instruction words from an ArrayBuffer
 * 
 * @param {ArrayBuffer} buffer An ArrayBuffer containing VTP Binary instruction words, as big endian
 * @returns {Number[]} The instruction words represented by the given buffer
 */
export function readInstructionWords(buffer) {
  if (buffer.byteLength % 4 != 0)
    throw { code: ErrorCode.INVALID_BUFFER_LENGTH, message: "buffer length must be a multiple of 4 bytes" }
  
  const nInstructionWords = buffer.byteLength / 4
  const view = new DataView(buffer)

  let result = Array(nInstructionWords)
  for (let i=0; i < nInstructionWords; i++) {
    result[i] = view.getUint32(i*4, false) // VTP pattern files are big-endian
  }

  return result
}

/**
 * Writes VTP instruction words to an ArrayBuffer
 * 
 * @param {Number[]} instructions The VTP instruction words to be written
 * @returns {ArrayBuffer} An ArrayBuffer containing the binary representations of the given instructions, as big endian
 */
export function writeInstructionWords(instructionWords) {
  let result = new Uint8Array(instructionWords.length * 4)

  for (let i=0; i < instructionWords.length; i++) {
    const instruction = instructionWords[i]

    result[i*4]   = (instruction >> 24) & 0xFF
    result[i*4+1] = (instruction >> 16) & 0xFF
    result[i*4+2] = (instruction >> 8) & 0xFF
    result[i*4+3] = instruction & 0xFF
  }

  return result.buffer
}


function decodeParamsA(instruction, parameterAName) {
  let result = {}

  result[parameterAName] = instruction & 0x0FFFFFFF;

  return result;
}

function decodeParamsB(instruction, parameterAName) {
  let result = {
    channelSelect: (instruction & 0x0FF00000) >> 20,
    timeOffset: (instruction & 0x000FFC00) >> 10
  }

  result[parameterAName] = instruction & 0x000003FF;
  
  return result;
}

function encodeParamsA(instruction, parameterAName) {
  return instruction[parameterAName] & 0x0FFFFFFF
}

function encodeParamsB(instruction, parameterAName) {
  return (
    ((instruction.channelSelect & 0xFF) << 20) |
    ((instruction.timeOffset & 0x3FF) << 10) |
    (instruction[parameterAName] & 0x3FF)
  )
}

function instructionTypeToCode(instructionType) {
  switch (instructionType) {
    case "IncrementTime":
      return InstructionCode.INCREMENT_TIME
    case "SetAmplitude":
      return InstructionCode.SET_AMPLITUDE
    case "SetFrequency":
      return InstructionCode.SET_FREQUENCY
    default:
      throw { code: ErrorCode.INVALID_INSTRUCTION_TYPE, message: "Invalid instruction type: " + instructionType }
  }
}
