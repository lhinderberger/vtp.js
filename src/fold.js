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
import './instruction_types.js'


/**
 * This object represents the state of a vibrotactile display
 * after an arbitrary number of VTP instructions has been applied to it, for
 * the purpose of the fold algorithm
 * 
 * @typedef {Object} Accumulator
 * @property {ChannelState[]} channels Objects describing the current state of each channel
 * @property {Number} millisecondsElapsed Keeps track of time when applying VTP instructions during fold
 */

/**
 * This objects represents the state of a single channel / actuator of
 * a vibrotactile display after an arbitrary number of VTP instructions has
 * been applied to it, for the purpose of the fold algorithm
 * 
 * @typedef {Object} ChannelState
 * @property {Number} amplitude
 * @property {Number} frequency
 */


/**
 * Creates and initializes a new Accumulator
 * 
 * @param {Number} nChannels The number of channels / actuators that the vibrotactile display has
 * @returns {Accumulator}
 */
export function createAccumulator(nChannels) {
  return {
    channels: createChannels(nChannels),
    millisecondsElapsed: 0
  }
}


/**
 * Applies each given VTP instruction to the accumulator, one after another
 * 
 * This function modifies the accumulator in place and returns nothing.
 * 
 * @param {Accumulator} accumulator 
 * @param {Instruction[]} instructions 
 */
export function fold(accumulator, instructions) {
  instructions.map(instruction => foldSingle(accumulator, instruction))
}


/**
 * Applies a single VTP instruction to the accumulator
 * 
 * This function modifies the accumulator in place and returns nothing.
 * 
 * @param {Accumulator} accumulator 
 * @param {Instruction} instruction 
 */
export function foldSingle(accumulator, instruction) {
  if (instruction.type == "IncrementTime") {
    // millisecondsElapsed will be incremented below this if/else block
  }
  else if (instruction.type == "SetAmplitude") {
    setWithChannelSelect(accumulator, instruction, "amplitude")
  }
  else if (instruction.type == "SetFrequency") {
    setWithChannelSelect(accumulator, instruction, "frequency")
  }
  else {
    throw { code: ErrorCode.INVALID_INSTRUCTION_TYPE, message: "Invalid instruction type: " + instruction.type }
  }

  accumulator.millisecondsElapsed += instruction.timeOffset
}


/**
 * Folds VTP instructions, up until the given target time
 *
 * This function will apply as many VTP instructions from the given input as possible, until
 * the given target time (millisecondsElapsed of accumulator) would be exceeded by applying
 * the next instruction.
 *
 * It is useful for example for simulation purposes or for mapping VTP to a sampling-like interface,
 * by calling this function with uniformly increasing target times.
 * 
 * This function modifies the accumulator in place.
 * 
 * @param {Accumulator} accumulator 
 * @param {Instruction[]} instructions 
 * @param {Number} untilMs The target time in milliseconds.
 * @returns {Number} The number of instructions that were applied to the accumulator
 */
export function foldUntil(accumulator, instructions, untilMs) {
  let nProcessed = 0

  while (nProcessed < instructions.length && (accumulator.millisecondsElapsed + instructions[nProcessed].timeOffset) <= untilMs) {
    foldSingle(accumulator, instructions[nProcessed])
    nProcessed++
  }

  return nProcessed
}


function createChannels(nChannels) {
  let result = []

  for (let i=0; i < nChannels; i++) {
    result.push({ amplitude: 0, frequency: 0 })
  }

  return result
}

function setWithChannelSelect(accumulator, instruction, parameterName) {
  if (instruction.channelSelect == 0) {
    accumulator.channels.map(c => c[parameterName] = instruction[parameterName])
  }
  else {
    if (instruction.channelSelect > accumulator.channels.length)
      throw { code: ErrorCode.CHANNEL_OUT_OF_RANGE, message: "Channel out of range: " + instruction.channelSelect }
    
    accumulator.channels[instruction.channelSelect - 1][parameterName] = instruction[parameterName]
  }
}
