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

/**
 * @typedef {InstIncrementTime|InstSetAmplitude|InstSetFrequency} Instruction
 */

/**
 * @typedef {Object} InstIncrementTime
 * @property {String} type - Is always "IncrementTime"
 * @property {Number} timeOffset
 */

/**
 * @typedef {Object} InstSetAmplitude
 * @property {String} type - Is always "SetAmplitude"
 * @property {Number} channelSelect
 * @property {Number} timeOffset
 * @property {Number} amplitude
 */

 /**
 * @typedef {Object} InstSetFrequency
 * @property {String} type - Is always "SetFrequency"
 * @property {Number} channelSelect
 * @property {Number} timeOffset
 * @property {Number} frequency
 */

export const InstructionCode = {
  INCREMENT_TIME: 0,
  SET_FREQUENCY: 1,
  SET_AMPLITUDE: 2
}
