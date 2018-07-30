// tslint:disable
import {ImageData} from '../image-data'
import {bilinear} from '../transforms/resize'

const DCT_COEFFICIENT = 1 / Math.sqrt(2)

function getDCTCoefficient(index: number): number {
  return index === 0 ? DCT_COEFFICIENT : 1
}

function hexToBinary(hex: string): string {
  // TODO: update ES types to use padStart
  return (parseInt(hex, 16).toString(2) as any).padStart(64, '0')
}

export function toHexString(binaryString: string): string {
  return binaryString
    .match(/.{8}/gm)!
    .map(s => parseInt(s, 2).toString(16))
    .join('')
}

export function toBinaryString(arrayOrString: string | Uint8Array): string {
  if (typeof arrayOrString === 'string') {
    if (/^(0|1)+$/.test(arrayOrString)) return arrayOrString
    if (/^[a-f0-9]+$/.test(arrayOrString)) return hexToBinary(arrayOrString)
    throw new Error(`Invalid conversion toBinaryString: ${arrayOrString}`)
  }

  return toBits(arrayOrString).join('')
}

export function toBits(array: Uint8Array): number[] {
  const bits = []
  for (var i = 0; i < array.length; i++) {
    const byte = array[i]
    for (var k = 7; k >= 0; k--) {
      bits.push((byte >> k) & 1)
    }
  }
  return bits
}

export function computeDCT(
  imageData: ImageData,
  xOffset: number = 0,
  yOffset: number = 0,
): number[] {
  const size = Math.min(imageData.width, 32)
  const output = []

  for (var v = 0; v < size; v++) {
    for (var u = 0; u < size; u++) {
      var value = 0
      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
          const du = ((i + 1 / 2) / size) * u * Math.PI
          const dv = ((j + 1 / 2) / size) * v * Math.PI
          value += Math.cos(du) * Math.cos(dv) * imageData.data[(j + yOffset) * size + i + xOffset]
        }
      }

      value *= (getDCTCoefficient(u) * getDCTCoefficient(v)) / 4
      output[v * size + u] = value
    }
  }

  return output
}

export function reduceDCT(dct: number[], size: number = 8): number[] {
  const originalSize = Math.sqrt(dct.length)
  const output = []

  for (var j = 0; j < size; j++) {
    for (var i = 0; i < size; i++) {
      output[j * size + i] = dct[j * originalSize + i]
    }
  }

  return output
}

export function averageAndThreshold(input: number[]): string {
  var sum = 0
  for (var i = 1; i < input.length; i++) {
    sum += input[i]
  }

  var average = sum / (input.length - 1)
  var output = []
  for (var i = 0; i < input.length; i++) {
    output[i] = input[i] > average ? 1 : 0
  }

  return output.join('')
}

/**
 * Heavily based on the method described in http://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html
 */
export function phash(imageData: ImageData, hashSize?: number): string {
  hashSize = hashSize || 64
  if (!Number.isInteger(Math.sqrt(hashSize / 64))) {
    throw new Error('Hash size must be a square-multiple of 64')
  }

  const thumbnailWidth = (hashSize / 64) * 32

  let thumbnail = imageData
  if (
    imageData.width !== thumbnailWidth ||
    imageData.height !== thumbnailWidth ||
    imageData.format !== ImageData.GREYSCALE
  ) {
    const colorThumbnail = bilinear(imageData, {width: thumbnailWidth, height: thumbnailWidth})
    thumbnail = ImageData.toGreyscale(colorThumbnail)
  }

  const hashes: string[] = []

  const numHashesToCompute = hashSize / 64
  const numHashesPerRow = Math.sqrt(numHashesToCompute)
  for (let i = 0; i < numHashesToCompute; i++) {
    const xOffset = (i % numHashesPerRow) * 32
    const yOffset = Math.floor(i / numHashesPerRow) * 32
    const fullDCT = computeDCT(thumbnail, xOffset, yOffset)
    const partialDCT = reduceDCT(fullDCT)
    hashes.push(averageAndThreshold(partialDCT))
  }

  return hashes.join('')
}

export function hammingDistance(hashA: string | Uint8Array, hashB: string | Uint8Array) {
  const stringA = toBinaryString(hashA)
  const stringB = toBinaryString(hashB)

  let distance = 0
  for (let i = 0; i < stringA.length; i++) {
    if (stringA[i] !== stringB[i]) {
      distance++
    }
  }

  return distance
}
