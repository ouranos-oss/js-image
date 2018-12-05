import {IFD} from '../decoder/ifd'
import {getFriendlyName} from '../utils/tags'
import {Reader} from '../utils/reader'
import {TIFFEncoder} from '../encoder/tiff-encoder'
import {JPEGDecoder} from './jpeg-decoder'
import {
  LITTLE_ENDIAN_MARKER,
  BIG_ENDIAN_MARKER,
  IGenericMetadata,
  IFDTag,
  IIFDOffset,
  IBufferLike,
  Endian,
  IReader,
  IIFD,
  IJPEGOptions,
} from '../utils/types'
import {createLogger} from '../utils/log'

const log = createLogger('decoder')

interface IThumbnailLocation {
  ifd: IIFD
  offset: number
  length: number
}

export class TIFFDecoder {
  private readonly _reader: IReader
  private _ifds: IIFD[]
  private _cachedMetadata: IGenericMetadata
  private _cachedJPEG: IBufferLike

  public constructor(buffer: IBufferLike) {
    this._reader = new Reader(buffer)
  }

  private _readAndValidateHeader(): void {
    this._reader.seek(0)
    const byteOrder = this._reader.read(2)
    if (byteOrder === LITTLE_ENDIAN_MARKER) {
      log('interpreting as little endian')
      this._reader.setEndianess(Endian.Little)
    } else if (byteOrder === BIG_ENDIAN_MARKER) {
      log('interpreting as big endian')
      this._reader.setEndianess(Endian.Big)
    } else {
      throw new Error('Unrecognized format')
    }

    const version = this._reader.read(2)
    if (version !== 42) {
      throw new Error(`Unrecognized format: ${version.toString(16)}`)
    }
  }

  private _readIFDs(): void {
    if (this._ifds) {
      return
    }

    this._ifds = []

    const ifdOffsets: IIFDOffset[] = [{offset: this._reader.read(4)}]
    while (ifdOffsets.length) {
      const ifdOffset = ifdOffsets.shift()!
      if (this._ifds.some(ifd => ifd.offset === ifdOffset.offset)) {
        continue
      }

      log(`reading IFD at ${ifdOffset.offset}`)
      const ifd = IFD.read(this._reader, ifdOffset)
      this._ifds.push(ifd)

      const suboffsets = ifd.getSubIFDOffsets(this._reader)
      log(`IFD has ${suboffsets.length} child(ren)`)
      suboffsets.forEach(offset => ifdOffsets.push({offset, parent: ifd}))
      if (ifd.nextIFDOffset) {
        ifdOffsets.push({offset: ifd.nextIFDOffset, parent: ifd.parent})
      }
    }
  }

  private _readLargestJPEGThumbnail(): IBufferLike | undefined {
    let maxResolutionJPEG: IThumbnailLocation | undefined
    this._ifds.forEach(ifd => {
      const offsetEntry = ifd.entries.find(entry => entry.tag === IFDTag.ThumbnailOffset)
      const lengthEntry = ifd.entries.find(entry => entry.tag === IFDTag.ThumbnailLength)
      if (!offsetEntry || !lengthEntry) {
        return
      }

      const offset = offsetEntry.getValue(this._reader) as number
      const length = lengthEntry.getValue(this._reader) as number

      if (!maxResolutionJPEG || length > maxResolutionJPEG.length) {
        maxResolutionJPEG = {offset, length, ifd}
      }
    })

    if (!maxResolutionJPEG) {
      return undefined
    }

    this._reader.seek(maxResolutionJPEG.offset)
    return this._reader.readAsBuffer(maxResolutionJPEG.length)
  }

  private _readStripOffsetsAsJPEG(): IBufferLike | undefined {
    let maxResolutionJPEG: IThumbnailLocation | undefined
    this._ifds.forEach(ifd => {
      const compressionEntry = ifd.entries.find(entry => entry.tag === IFDTag.Compression)
      const stripOffsetsEntry = ifd.entries.find(entry => entry.tag === IFDTag.StripOffsets)
      const stripBytesEntry = ifd.entries.find(entry => entry.tag === IFDTag.StripByteCounts)
      if (!compressionEntry || !stripOffsetsEntry || !stripBytesEntry) return

      const compression = compressionEntry.getValue(this._reader) as number
      // From EXIF and DNG specs, 6 and 7 signal JPEG-compressed data
      // https://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/EXIF.html#Compression
      if (compression !== 6 && compression !== 7) return

      const offset = stripOffsetsEntry.getValue(this._reader) as number
      const length = stripBytesEntry.getValue(this._reader) as number

      // TODO: throw if there's more than one strip
      if (!maxResolutionJPEG || length > maxResolutionJPEG.length) {
        maxResolutionJPEG = {offset, length, ifd}
      }
    })

    if (!maxResolutionJPEG) {
      return undefined
    }

    this._reader.seek(maxResolutionJPEG.offset)
    return this._reader.readAsBuffer(maxResolutionJPEG.length)
  }

  private _readLargestJPEG(): IBufferLike {
    const maxResolutionJPEG = this._readLargestJPEGThumbnail() || this._readStripOffsetsAsJPEG()
    if (!maxResolutionJPEG) {
      throw new Error('Could not find thumbnail or read StripOffsets IFDs')
    }
    return maxResolutionJPEG
  }

  public extractJPEG(options: IJPEGOptions = {}): IBufferLike {
    if (this._cachedJPEG) return this._cachedJPEG.slice()

    this._readAndValidateHeader()
    this._readIFDs()

    const jpeg = this._readLargestJPEG()
    if (options.skipMetadata) return jpeg

    const metadata = this.extractMetadata()
    const metadataBuffer = TIFFEncoder.encode(metadata)

    this._cachedJPEG = JPEGDecoder.injectMetadata(jpeg, metadataBuffer)
    return this._cachedJPEG.slice()
  }

  public extractMetadata(): IGenericMetadata {
    if (this._cachedMetadata) return {...this._cachedMetadata}

    this._readAndValidateHeader()
    this._readIFDs()

    const exifTags: IGenericMetadata = {}
    const tags: IGenericMetadata = {}
    this._ifds.forEach(ifd => {
      const target = ifd.isEXIF ? exifTags : tags
      ifd.entries.forEach(entry => {
        const name = getFriendlyName(entry.tag)
        const value = entry.getValue(this._reader)
        log.verbose(`evaluated ${name} (${entry.tag} - ${entry.dataType}) as ${value}`)
        target[name] = value
      })
    })

    this._cachedMetadata = {...tags, ...exifTags}
    return {...this._cachedMetadata}
  }
}
