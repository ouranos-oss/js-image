/* tslint:disable */
import {IAnnotatedImageData, ImageData, IProximityAdjustment} from '../image-data'
import {MapPixelFn, IToneOptions, ColorChannel, Colorspace} from '../types'

function validateCurvesInput(curve?: number[][]): number[][] {
  if (!curve) throw new Error('curve is not defined')

  let lastEntry = -Infinity
  for (const entry of curve) {
    if (entry.length !== 2) throw new Error(`curve entry ${JSON.stringify(entry)} is not a tuple`)
    if (entry[0] <= lastEntry) throw new Error('curve entry is not ascending')
    if (entry[0] < 0 || entry[0] > 255) throw new Error(`invalid curve entry input ${entry[0]}`)
    if (entry[1] < 0 || entry[1] > 255) throw new Error(`invalid curve entry input ${entry[0]}`)
  }

  if (!curve.length || curve[0][0] !== 0) curve = [[0, 0], ...curve]
  if (curve[curve.length - 1][0] !== 255) curve = [...curve, [255, 255]]
  return curve
}

export function contrast(options: IToneOptions): MapPixelFn {
  return pixel => {
    if (pixel.colorspace !== Colorspace.YCbCr) return pixel.values

    const [y, cb, cr] = pixel.values
    const delta = y - 128
    const yPrime = delta * options.contrast! + y
    return [yPrime, cb, cr]
  }
}

/**
 * Use monotonic cubic interpolation to map lightness values according to the provided curve.
 * @see https://en.wikipedia.org/wiki/Monotone_cubic_interpolation#Example_implementation
 * @param options
 */
export function curves(unsafeCurve: number[][]): MapPixelFn {
  const curve = validateCurvesInput(unsafeCurve)

  const xDiffs: number[] = []
  const yDiffs: number[] = []
  const slopes: number[] = []
  for (let i = 0; i < curve.length - 1; i++) {
    const [x0, y0] = curve[i]
    const [x1, y1] = curve[i + 1]
    const dx = x1 - x0
    const dy = y1 - y0

    xDiffs.push(dx)
    yDiffs.push(dy)
    slopes.push(dy / dx)
  }

  const firstDegreeCoefficients: number[] = []

  // Beyond the known points, the interpolation is a continued straight line
  firstDegreeCoefficients.push(slopes[0])
  // Between the known points, we use a fancy equation combining the slopes and dx of the current and next intervals
  for (let i = 0; i < slopes.length - 1; i++) {
    const slope0 = slopes[i]
    const slope1 = slopes[i + 1]
    if (slope0 * slope1 <= 0) {
      // If slope changes direction, use 0
      firstDegreeCoefficients.push(0)
    } else {
      const dx0 = xDiffs[i]
      const dx1 = xDiffs[i + 1]
      const dxTotal = dx0 + dx1
      firstDegreeCoefficients.push(
        (3 * dxTotal) / ((dxTotal + dx1) / slope0 + (dxTotal + dx0) / slope1),
      )
    }
  }
  // Continue the straight line beyond the known points
  firstDegreeCoefficients.push(slopes[slopes.length - 1])

  const secondDegreeCoefficients: number[] = []
  const thirdDegreeCoefficients: number[] = []
  // Use our math magic to fill in the 2nd and 3rd degree coefficients, only need n - 1 of them since beyond the points its straight line
  for (let i = 0; i < firstDegreeCoefficients.length - 1; i++) {
    const firstDegreeCoefficient0 = firstDegreeCoefficients[i]
    const firstDegreeCoefficient1 = firstDegreeCoefficients[i + 1]
    const slope = slopes[i]
    const dxInverse = 1 / xDiffs[i]
    const magicNumber = firstDegreeCoefficient0 + firstDegreeCoefficient1 - 2 * slope
    secondDegreeCoefficients.push((slope - firstDegreeCoefficient0 - magicNumber) * dxInverse)
    thirdDegreeCoefficients.push(magicNumber * dxInverse * dxInverse)
  }

  const mapLuma = (input: number) => {
    const distances = curve.map(entry => (entry[0] > input ? Infinity : input - entry[0]))
    const minDistance = Math.min(...distances)
    const closestIndex = curve.findIndex(entry => input - entry[0] === minDistance)
    const [xBase, yBase] = curve[closestIndex]
    const xDiff = input - xBase

    const c1 = firstDegreeCoefficients[closestIndex]
    const c2 = secondDegreeCoefficients[closestIndex]
    const c3 = thirdDegreeCoefficients[closestIndex]

    if (xDiff === 0) return yBase
    if (closestIndex >= secondDegreeCoefficients.length) return yBase + c1 * xDiff
    return yBase + c1 * xDiff + c2 * xDiff * xDiff + c3 * xDiff * xDiff * xDiff
  }

  return pixel => {
    if (pixel.colorspace !== Colorspace.YCbCr) return pixel.values
    const [y, cb, cr] = pixel.values
    return [mapLuma(y), cb, cr]
  }
}

function generateIdentityCurvesPoints(numPoints: number): number[][] {
  const curves: number[][] = []
  const increment = 255 / (numPoints - 1)
  for (let i = 0; i < numPoints; i++) {
    const value = Math.round(i * increment)
    curves.push([value, value])
  }

  return curves
}

function convertToneToCurves(options: IToneOptions): number[][] {
  let hasAdjustment = false
  const cosine0 = Math.PI / 2
  const curves = generateIdentityCurvesPoints(32)

  function adjustCurvesTargetPoints(target: number, range: number, adjustment: number) {
    for (let i = 0; i < curves.length; i++) {
      const [x, y] = curves[i]
      const distanceRatio = Math.abs(target - x) / range
      if (distanceRatio >= 1) continue

      hasAdjustment = true
      const cosDistance = Math.cos(distanceRatio * cosine0)
      curves[i][1] = Math.min(255, Math.max(0, Math.round(y + adjustment * cosDistance)))
    }
  }

  if (options.whites) adjustCurvesTargetPoints(256, 32, options.whites)
  if (options.highlights) adjustCurvesTargetPoints(192, 64, options.highlights)
  if (options.midtones) adjustCurvesTargetPoints(128, 128, options.midtones)
  if (options.shadows) adjustCurvesTargetPoints(64, 64, options.shadows)
  if (options.blacks) adjustCurvesTargetPoints(0, 32, options.blacks)

  if (!hasAdjustment) return []
  return curves
}

export function tone(imageData: IAnnotatedImageData, options: IToneOptions): IAnnotatedImageData {
  const {colorspace} = imageData
  // Convert the image to YCbCr colorspace to just operate on luma channel
  imageData = ImageData.toYCbCr(imageData)

  const mappings: MapPixelFn[] = []
  const toneAsCurves = convertToneToCurves(options)

  if (toneAsCurves.length) mappings.push(curves(toneAsCurves))
  if (options.contrast) mappings.push(contrast(options))
  if (options.curve) mappings.push(curves(options.curve))

  if (mappings.length) imageData = ImageData.mapPixels(imageData, mappings)
  return ImageData.toColorspace(imageData, colorspace)
}
