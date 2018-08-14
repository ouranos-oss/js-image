import {IIFDTagDefinition, IFDTagName, IFDGroup, IFDDataType} from './types'

// From https://raw.githubusercontent.com/hMatoba/piexifjs/master/piexif.js
// and exif-parser on npm

export const tags: IIFDTagDefinition[] = []

// TODO: fill in all IFDDataTypes with -1
const _tags: Array<[IFDTagName, number, IFDDataType, IFDGroup]> = [
  // From other sets
  ['InteropIndex', 1, -1, 1],
  ['InteropVersion', 2, -1, 1],
  ['ProcessingSoftware', 11, 2, 0],
  ['ImageWidth', 100, 4, 0],
  ['NewSubfileType', 254, 4, 0],
  ['SubfileType', 255, 3, 0],
  ['ImageWidth', 256, 4, 0],
  ['ImageHeight', 257, 4, 1],
  ['BitsPerSample', 258, 3, 0],
  ['Compression', 259, 3, 0],
  ['PhotometricInterpretation', 262, 3, 0],
  ['Thresholding', 263, -1, 1],
  ['Threshholding', 263, 3, 0],
  ['CellWidth', 264, 3, 0],
  ['CellLength', 265, 3, 0],
  ['FillOrder', 266, 3, 0],
  ['DocumentName', 269, 2, 0],
  ['ImageDescription', 270, 2, 0],
  ['Make', 271, 2, 0],
  ['Model', 272, 2, 0],
  ['StripOffsets', 273, 4, 0],
  ['Orientation', 274, 3, 0],
  ['SamplesPerPixel', 277, 3, 0],
  ['RowsPerStrip', 278, 4, 0],
  ['StripByteCounts', 279, 4, 0],
  ['MinSampleValue', 280, -1, 1],
  ['MaxSampleValue', 281, -1, 1],
  ['XResolution', 282, 5, 0],
  ['YResolution', 283, 5, 0],
  ['PlanarConfiguration', 284, 3, 0],
  ['PageName', 285, -1, 1],
  ['XPosition', 286, -1, 1],
  ['YPosition', 287, -1, 1],
  ['FreeOffsets', 288, -1, 1],
  ['FreeByteCounts', 289, -1, 1],
  ['GrayResponseUnit', 290, 3, 0],
  ['GrayResponseCurve', 291, 3, 0],
  ['T4Options', 292, 4, 0],
  ['T6Options', 293, 4, 0],
  ['ResolutionUnit', 296, 3, 0],
  ['PageNumber', 297, -1, 1],
  ['ColorResponseUnit', 300, -1, 1],
  ['TransferFunction', 301, 3, 0],
  ['Software', 305, 2, 0],
  ['ModifyDate', 306, -1, 1],
  ['DateTime', 306, 2, 0],
  ['Artist', 315, 2, 0],
  ['HostComputer', 316, 2, 0],
  ['Predictor', 317, 3, 0],
  ['WhitePoint', 318, 5, 0],
  ['PrimaryChromaticities', 319, 5, 0],
  ['ColorMap', 320, 3, 0],
  ['HalftoneHints', 321, 3, 0],
  ['TileWidth', 322, 3, 0],
  ['TileLength', 323, 3, 0],
  ['TileOffsets', 324, 3, 0],
  ['TileByteCounts', 325, 3, 0],
  ['BadFaxLines', 326, -1, 1],
  ['CleanFaxData', 327, -1, 1],
  ['ConsecutiveBadFaxLines', 328, -1, 1],
  ['SubIFD', 330, 4, 0],
  ['InkSet', 332, 3, 0],
  ['InkNames', 333, 2, 0],
  ['NumberOfInks', 334, 3, 0],
  ['NumberofInks', 334, -1, 1],
  ['DotRange', 336, 1, 0],
  ['TargetPrinter', 337, 2, 0],
  ['ExtraSamples', 338, 3, 0],
  ['SampleFormat', 339, 3, 0],
  ['SMinSampleValue', 340, 3, 0],
  ['SMaxSampleValue', 341, 3, 0],
  ['TransferRange', 342, 3, 0],
  ['ClipPath', 343, 1, 0],
  ['XClipPathUnits', 344, 4, 0],
  ['YClipPathUnits', 345, 4, 0],
  ['Indexed', 346, 3, 0],
  ['JPEGTables', 347, 7, 0],
  ['OPIProxy', 351, 3, 0],
  ['GlobalParametersIFD', 400, -1, 1],
  ['ProfileType', 401, -1, 1],
  ['FaxProfile', 402, -1, 1],
  ['CodingMethods', 403, -1, 1],
  ['VersionYear', 404, -1, 1],
  ['ModeNumber', 405, -1, 1],
  ['Decode', 433, -1, 1],
  ['DefaultImageColor', 434, -1, 1],
  ['T82Options', 435, -1, 1],
  ['JPEGProc', 512, 4, 0],
  ['JPEGInterchangeFormat', 513, 4, 0],
  ['ThumbnailOffset', 513, 4, 0],
  ['ThumbnailLength', 514, 4, 0],
  ['JPEGInterchangeFormatLength', 514, 4, 0],
  ['JPEGRestartInterval', 515, 3, 0],
  ['JPEGLosslessPredictors', 517, 3, 0],
  ['JPEGPointTransforms', 518, 3, 0],
  ['JPEGQTables', 519, 4, 0],
  ['JPEGDCTables', 520, 4, 0],
  ['JPEGACTables', 521, 4, 0],
  ['YCbCrCoefficients', 529, 5, 0],
  ['YCbCrSubSampling', 530, 3, 0],
  ['YCbCrPositioning', 531, 3, 0],
  ['ReferenceBlackWhite', 532, 5, 0],
  ['StripRowCounts', 559, -1, 1],
  ['ApplicationNotes', 700, -1, 1],
  ['XMLPacket', 700, 1, 0],
  ['USPTOMiscellaneous', 999, -1, 1],
  ['RelatedImageFileFormat', 4096, -1, 1],
  ['RelatedImageWidth', 4097, -1, 1],
  ['RelatedImageHeight', 4098, -1, 1],
  ['Rating', 18246, 3, 0],
  ['XP_DIP_XML', 18247, -1, 1],
  ['StitchInfo', 18248, -1, 1],
  ['RatingPercent', 18249, 3, 0],
  ['ImageID', 32781, 2, 0],
  ['WangTag1', 32931, -1, 1],
  ['WangAnnotation', 32932, -1, 1],
  ['WangTag3', 32933, -1, 1],
  ['WangTag4', 32934, -1, 1],
  ['Matteing', 32995, -1, 1],
  ['DataType', 32996, -1, 1],
  ['ImageDepth', 32997, -1, 1],
  ['TileDepth', 32998, -1, 1],
  ['Model2', 33405, -1, 1],
  ['CFARepeatPatternDim', 33421, 3, 0],
  ['CFAPattern2', 33422, -1, 1],
  ['CFAPattern', 33422, 1, 0],
  ['BatteryLevel', 33423, 5, 0],
  ['KodakIFD', 33424, -1, 1],
  ['Copyright', 33432, 2, 0],
  ['ExposureTime', 33434, 5, 0],
  ['FNumber', 33437, -1, 1],
  ['MDFileTag', 33445, -1, 1],
  ['MDScalePixel', 33446, -1, 1],
  ['MDColorTable', 33447, -1, 1],
  ['MDLabName', 33448, -1, 1],
  ['MDSampleInfo', 33449, -1, 1],
  ['MDPrepDate', 33450, -1, 1],
  ['MDPrepTime', 33451, -1, 1],
  ['MDFileUnits', 33452, -1, 1],
  ['PixelScale', 33550, -1, 1],
  ['AdventScale', 33589, -1, 1],
  ['AdventRevision', 33590, -1, 1],
  ['UIC1Tag', 33628, -1, 1],
  ['UIC2Tag', 33629, -1, 1],
  ['UIC3Tag', 33630, -1, 1],
  ['UIC4Tag', 33631, -1, 1],
  ['IPTC-NAA', 33723, -1, 1],
  ['IntergraphPacketData', 33918, -1, 1],
  ['IntergraphFlagRegisters', 33919, -1, 1],
  ['IntergraphMatrix', 33920, -1, 1],
  ['INGRReserved', 33921, -1, 1],
  ['ModelTiePoint', 33922, -1, 1],
  ['Site', 34016, -1, 1],
  ['ColorSequence', 34017, -1, 1],
  ['IT8Header', 34018, -1, 1],
  ['RasterPadding', 34019, -1, 1],
  ['BitsPerRunLength', 34020, -1, 1],
  ['BitsPerExtendedRunLength', 34021, -1, 1],
  ['ColorTable', 34022, -1, 1],
  ['ImageColorIndicator', 34023, -1, 1],
  ['BackgroundColorIndicator', 34024, -1, 1],
  ['ImageColorValue', 34025, -1, 1],
  ['BackgroundColorValue', 34026, -1, 1],
  ['PixelIntensityRange', 34027, -1, 1],
  ['TransparencyIndicator', 34028, -1, 1],
  ['ColorCharacterization', 34029, -1, 1],
  ['HCUsage', 34030, -1, 1],
  ['TrapIndicator', 34031, -1, 1],
  ['CMYKEquivalent', 34032, -1, 1],
  ['SEMInfo', 34118, -1, 1],
  ['AFCP_IPTC', 34152, -1, 1],
  ['PixelMagicJBIGOptions', 34232, -1, 1],
  ['ModelTransform', 34264, -1, 1],
  ['WB_GRGBLevels', 34306, -1, 1],
  ['LeafData', 34310, -1, 1],
  ['PhotoshopSettings', 34377, -1, 1],
  ['ImageResources', 34377, 1, 0],
  ['EXIFTag', 34665, 4, 0],
  ['EXIFOffset', 34665, -1, 1],
  ['InterColorProfile', 34675, 7, 0],
  ['ICC_Profile', 34675, -1, 1],
  ['TIFF_FXExtensions', 34687, -1, 1],
  ['MultiProfiles', 34688, -1, 1],
  ['SharedData', 34689, -1, 1],
  ['T88Options', 34690, -1, 1],
  ['ImageLayer', 34732, -1, 1],
  ['GeoTiffDirectory', 34735, -1, 1],
  ['GeoTiffDoubleParams', 34736, -1, 1],
  ['GeoTiffAsciiParams', 34737, -1, 1],
  ['ExposureProgram', 34850, -1, 1],
  ['SpectralSensitivity', 34852, -1, 1],
  ['GPSTag', 34853, 4, 0],
  ['GPSInfo', 34853, -1, 1],
  ['ISO', 34855, -1, 1],
  ['Opto-ElectricConvFactor', 34856, -1, 1],
  ['Interlace', 34857, 3, 0],
  ['TimeZoneOffset', 34858, 4, 0],
  ['SelfTimerMode', 34859, 3, 0],
  ['SensitivityType', 34864, -1, 1],
  ['StandardOutputSensitivity', 34865, -1, 1],
  ['RecommendedExposureIndex', 34866, -1, 1],
  ['ISOSpeed', 34867, -1, 1],
  ['ISOSpeedLatitudeyyy', 34868, -1, 1],
  ['ISOSpeedLatitudezzz', 34869, -1, 1],
  ['FaxRecvParams', 34908, -1, 1],
  ['FaxSubAddress', 34909, -1, 1],
  ['FaxRecvTime', 34910, -1, 1],
  ['LeafSubIFD', 34954, -1, 1],
  ['EXIFVersion', 36864, -1, 1],
  ['DateTimeOriginal', 36867, -1, 1],
  ['CreateDate', 36868, -1, 1],
  ['ComponentsConfiguration', 37121, -1, 1],
  ['CompressedBitsPerPixel', 37122, -1, 1],
  ['ShutterSpeedValue', 37377, -1, 1],
  ['ApertureValue', 37378, -1, 1],
  ['BrightnessValue', 37379, -1, 1],
  ['ExposureCompensation', 37380, -1, 1],
  ['MaxApertureValue', 37381, -1, 1],
  ['SubjectDistance', 37382, -1, 1],
  ['MeteringMode', 37383, -1, 1],
  ['LightSource', 37384, -1, 1],
  ['Flash', 37385, -1, 1],
  ['FocalLength', 37386, -1, 1],
  ['FlashEnergy', 37387, 5, 0],
  ['SpatialFrequencyResponse', 37388, 7, 0],
  ['Noise', 37389, 7, 0],
  ['FocalPlaneXResolution', 37390, 5, 0],
  ['FocalPlaneYResolution', 37391, 5, 0],
  ['FocalPlaneResolutionUnit', 37392, 3, 0],
  ['ImageNumber', 37393, 4, 0],
  ['SecurityClassification', 37394, 2, 0],
  ['ImageHistory', 37395, 2, 0],
  ['SubjectArea', 37396, -1, 1],
  ['ExposureIndex', 37397, 5, 0],
  ['TIFFEPStandardID', 37398, 1, 0],
  ['TIFF-EPStandardID', 37398, -1, 1],
  ['SensingMethod', 37399, 3, 0],
  ['CIP3DataFile', 37434, -1, 1],
  ['CIP3Sheet', 37435, -1, 1],
  ['CIP3Side', 37436, -1, 1],
  ['StoNits', 37439, -1, 1],
  ['MakerNote', 37500, -1, 1],
  ['UserComment', 37510, -1, 1],
  ['SubSecTime', 37520, -1, 1],
  ['SubSecTimeOriginal', 37521, -1, 1],
  ['SubSecTimeDigitized', 37522, -1, 1],
  ['MSDocumentText', 37679, -1, 1],
  ['MSPropertySetStorage', 37680, -1, 1],
  ['MSDocumentTextPosition', 37681, -1, 1],
  ['ImageSourceData', 37724, -1, 1],
  ['XPTitle', 40091, 1, 0],
  ['XPComment', 40092, 1, 0],
  ['XPAuthor', 40093, 1, 0],
  ['XPKeywords', 40094, 1, 0],
  ['XPSubject', 40095, 1, 0],
  ['FlashpixVersion', 40960, -1, 1],
  ['ColorSpace', 40961, -1, 1],
  ['EXIFImageWidth', 40962, -1, 1],
  ['EXIFImageHeight', 40963, -1, 1],
  ['RelatedSoundFile', 40964, -1, 1],
  ['InteropOffset', 40965, -1, 1],
  ['SubjectLocation', 41492, -1, 1],
  ['TIFF-EPStandardID', 41494, -1, 1],
  ['FileSource', 41728, -1, 1],
  ['SceneType', 41729, -1, 1],
  ['CustomRendered', 41985, -1, 1],
  ['ExposureMode', 41986, -1, 1],
  ['WhiteBalance', 41987, -1, 1],
  ['DigitalZoomRatio', 41988, -1, 1],
  ['FocalLengthIn35mmFormat', 41989, -1, 1],
  ['SceneCaptureType', 41990, -1, 1],
  ['GainControl', 41991, -1, 1],
  ['Contrast', 41992, -1, 1],
  ['Saturation', 41993, -1, 1],
  ['Sharpness', 41994, -1, 1],
  ['DeviceSettingDescription', 41995, -1, 1],
  ['SubjectDistanceRange', 41996, -1, 1],
  ['ImageUniqueID', 42016, -1, 1],
  ['OwnerName', 42032, -1, 1],
  ['SerialNumber', 42033, -1, 1],
  ['LensMake', 42035, -1, 1],
  ['LensModel', 42036, -1, 1],
  ['LensSerialNumber', 42037, -1, 1],
  ['GDALMetadata', 42112, -1, 1],
  ['GDALNoData', 42113, -1, 1],
  ['Gamma', 42240, -1, 1],
  ['ExpandSoftware', 44992, -1, 1],
  ['ExpandLens', 44993, -1, 1],
  ['ExpandFilm', 44994, -1, 1],
  ['ExpandFilterLens', 44995, -1, 1],
  ['ExpandScanner', 44996, -1, 1],
  ['ExpandFlashLamp', 44997, -1, 1],
  ['PixelFormat', 48129, -1, 1],
  ['Transformation', 48130, -1, 1],
  ['Uncompressed', 48131, -1, 1],
  ['ImageType', 48132, -1, 1],
  ['ImageHeight', 48257, -1, 1],
  ['WidthResolution', 48258, -1, 1],
  ['HeightResolution', 48259, -1, 1],
  ['ImageOffset', 48320, -1, 1],
  ['ImageByteCount', 48321, -1, 1],
  ['AlphaOffset', 48322, -1, 1],
  ['AlphaByteCount', 48323, -1, 1],
  ['ImageDataDiscard', 48324, -1, 1],
  ['AlphaDataDiscard', 48325, -1, 1],
  ['OceScanjobDesc', 50215, -1, 1],
  ['OceApplicationSelector', 50216, -1, 1],
  ['OceIDNumber', 50217, -1, 1],
  ['OceImageLogic', 50218, -1, 1],
  ['Annotations', 50255, -1, 1],
  ['PrintImageMatching', 50341, 7, 0],
  ['PrintIM', 50341, -1, 1],
  ['USPTOOriginalContentType', 50560, -1, 1],
  ['DNGVersion', 50706, 1, 0],
  ['DNGBackwardVersion', 50707, 1, 0],
  ['UniqueCameraModel', 50708, 2, 0],
  ['LocalizedCameraModel', 50709, 1, 0],
  ['CFAPlaneColor', 50710, 1, 0],
  ['CFALayout', 50711, 3, 0],
  ['LinearizationTable', 50712, 3, 0],
  ['BlackLevelRepeatDim', 50713, 3, 0],
  ['BlackLevel', 50714, 5, 0],
  ['BlackLevelDeltaH', 50715, 10, 0],
  ['BlackLevelDeltaV', 50716, 10, 0],
  ['WhiteLevel', 50717, 3, 0],
  ['DefaultScale', 50718, 5, 0],
  ['DefaultCropOrigin', 50719, 3, 0],
  ['DefaultCropSize', 50720, 3, 0],
  ['ColorMatrix1', 50721, 10, 0],
  ['ColorMatrix2', 50722, 10, 0],
  ['CameraCalibration1', 50723, 10, 0],
  ['CameraCalibration2', 50724, 10, 0],
  ['ReductionMatrix1', 50725, 10, 0],
  ['ReductionMatrix2', 50726, 10, 0],
  ['AnalogBalance', 50727, 5, 0],
  ['AsShotNeutral', 50728, 3, 0],
  ['AsShotWhiteXY', 50729, 5, 0],
  ['BaselineExposure', 50730, 10, 0],
  ['BaselineNoise', 50731, 5, 0],
  ['BaselineSharpness', 50732, 5, 0],
  ['BayerGreenSplit', 50733, 4, 0],
  ['LinearResponseLimit', 50734, 5, 0],
  ['CameraSerialNumber', 50735, 2, 0],
  ['LensInfo', 50736, 5, 0],
  ['DNGLensInfo', 50736, -1, 1],
  ['ChromaBlurRadius', 50737, 5, 0],
  ['AntiAliasStrength', 50738, 5, 0],
  ['ShadowScale', 50739, 10, 0],
  ['DNGPrivateData', 50740, 1, 0],
  ['MakerNoteSafety', 50741, 3, 0],
  ['RawImageSegmentation', 50752, -1, 1],
  ['CalibrationIlluminant1', 50778, 3, 0],
  ['CalibrationIlluminant2', 50779, 3, 0],
  ['BestQualityScale', 50780, 5, 0],
  ['RawDataUniqueID', 50781, 1, 0],
  ['AliasLayerMetadata', 50784, -1, 1],
  ['OriginalRawFileName', 50827, 1, 0],
  ['OriginalRawFileData', 50828, 7, 0],
  ['ActiveArea', 50829, 3, 0],
  ['MaskedAreas', 50830, 3, 0],
  ['AsShotICCProfile', 50831, 7, 0],
  ['AsShotPreProfileMatrix', 50832, 10, 0],
  ['CurrentICCProfile', 50833, 7, 0],
  ['CurrentPreProfileMatrix', 50834, 10, 0],
  ['ColorimetricReference', 50879, 3, 0],
  ['PanasonicTitle', 50898, -1, 1],
  ['PanasonicTitle2', 50899, -1, 1],
  ['CameraCalibrationSig', 50931, -1, 1],
  ['CameraCalibrationSignature', 50931, 1, 0],
  ['ProfileCalibrationSignature', 50932, 1, 0],
  ['ProfileCalibrationSig', 50932, -1, 1],
  ['ProfileIFD', 50933, -1, 1],
  ['AsShotProfileName', 50934, 1, 0],
  ['NoiseReductionApplied', 50935, 5, 0],
  ['ProfileName', 50936, 1, 0],
  ['ProfileHueSatMapDims', 50937, 4, 0],
  ['ProfileHueSatMapData1', 50938, 0, 0], // Unknown 'Float' datatype
  ['ProfileHueSatMapData2', 50939, 0, 0], // Unknown 'Float' datatype
  ['ProfileToneCurve', 50940, 0, 0], // Unknown 'Float' datatype
  ['ProfileEmbedPolicy', 50941, 4, 0],
  ['ProfileCopyright', 50942, 1, 0],
  ['ForwardMatrix1', 50964, 10, 0],
  ['ForwardMatrix2', 50965, 10, 0],
  ['PreviewApplicationName', 50966, 1, 0],
  ['PreviewApplicationVersion', 50967, 1, 0],
  ['PreviewSettingsName', 50968, 1, 0],
  ['PreviewSettingsDigest', 50969, 1, 0],
  ['PreviewColorSpace', 50970, 4, 0],
  ['PreviewDateTime', 50971, 2, 0],
  ['RawImageDigest', 50972, 7, 0],
  ['OriginalRawFileDigest', 50973, 7, 0],
  ['SubTileBlockSize', 50974, 4, 0],
  ['RowInterleaveFactor', 50975, 4, 0],
  ['ProfileLookTableDims', 50981, 4, 0],
  ['ProfileLookTableData', 50982, 0, 0], // Unknown 'Float' datatype
  ['OpcodeList1', 51008, 7, 0],
  ['OpcodeList2', 51009, 7, 0],
  ['OpcodeList3', 51022, 7, 0],
  ['NoiseProfile', 51041, -1, 1],
  ['TimeCodes', 51043, -1, 1],
  ['FrameRate', 51044, -1, 1],
  ['TStop', 51058, -1, 1],
  ['ReelName', 51081, -1, 1],
  ['OriginalDefaultFinalSize', 51089, -1, 1],
  ['OriginalBestQualitySize', 51090, -1, 1],
  ['OriginalDefaultCropSize', 51091, -1, 1],
  ['CameraLabel', 51105, -1, 1],
  ['ProfileHueSatMapEncoding', 51107, -1, 1],
  ['ProfileLookTableEncoding', 51108, -1, 1],
  ['BaselineExposureOffset', 51109, -1, 1],
  ['DefaultBlackRender', 51110, -1, 1],
  ['NewRawImageDigest', 51111, -1, 1],
  ['RawToPreviewGain', 51112, -1, 1],
  ['DefaultUserCrop', 51125, -1, 1],
  ['Padding', 59932, -1, 1],
  ['OffsetSchema', 59933, -1, 1],
  ['OwnerName', 65000, -1, 1],
  ['SerialNumber', 65001, -1, 1],
  ['Lens', 65002, -1, 1],
  ['KDC_IFD', 65024, -1, 1],
  ['RawFile', 65100, -1, 1],
  ['Converter', 65101, -1, 1],
  ['WhiteBalance', 65102, -1, 1],
  ['Exposure', 65105, -1, 1],
  ['Shadows', 65106, -1, 1],
  ['Brightness', 65107, -1, 1],
  ['Contrast', 65108, -1, 1],
  ['Saturation', 65109, -1, 1],
  ['Sharpness', 65110, -1, 1],
  ['Smoothness', 65111, -1, 1],
  ['MoireFilter', 65112, -1, 1],
  // GPS Tags
  ['GPSVersionID', 0, 1, 2],
  ['GPSLatitudeRef', 1, 2, 2],
  ['GPSLatitude', 2, 5, 2],
  ['GPSLongitudeRef', 3, 2, 2],
  ['GPSLongitude', 4, 5, 2],
  ['GPSAltitudeRef', 5, 1, 2],
  ['GPSAltitude', 6, 5, 2],
  ['GPSTimeStamp', 7, 5, 2],
  ['GPSSatellites', 8, 2, 2],
  ['GPSStatus', 9, 2, 2],
  ['GPSMeasureMode', 10, 2, 2],
  ['GPSDOP', 11, 5, 2],
  ['GPSSpeedRef', 12, 2, 2],
  ['GPSSpeed', 13, 5, 2],
  ['GPSTrackRef', 14, 2, 2],
  ['GPSTrack', 15, 5, 2],
  ['GPSImgDirectionRef', 16, 2, 2],
  ['GPSImgDirection', 17, 5, 2],
  ['GPSMapDatum', 18, 2, 2],
  ['GPSDestLatitudeRef', 19, 2, 2],
  ['GPSDestLatitude', 20, 5, 2],
  ['GPSDestLongitudeRef', 21, 2, 2],
  ['GPSDestLongitude', 22, 5, 2],
  ['GPSDestBearingRef', 23, 2, 2],
  ['GPSDestBearing', 24, 5, 2],
  ['GPSDestDistanceRef', 25, 2, 2],
  ['GPSDestDistance', 26, 5, 2],
  ['GPSProcessingMethod', 27, 7, 2],
  ['GPSAreaInformation', 28, 7, 2],
  ['GPSDateStamp', 29, 2, 2],
  ['GPSDifferential', 30, 3, 2],
  ['GPSHPositioningError', 31, 5, 2],
]

for (const [name, identifier, dataType, group] of _tags) {
  tags.push({name, identifier, dataType, group})
}