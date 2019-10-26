monkeyPatchConsoleWarn()
import * as tf from '@tensorflow/tfjs-node'
import * as path from 'path'
import * as _ from 'lodash'

import {IAnnotatedImageData} from '../image-data'
import {ISceneAnalysisEntry} from '../types'
import {SharpImage} from '../sharp-image'
import {instrumentation} from '../instrumentation'

const SCENE_MAP = [
  'airfield',
  'airplaneCabin',
  'airportTerminal',
  'alcove',
  'alley',
  'amphitheater',
  'amusementArcade',
  'amusementPark',
  'outdoorApartmentBuilding',
  'aquarium',
  'aqueduct',
  'arcade',
  'arch',
  'archaelogicalExcavation',
  'archive',
  'hockeyArena',
  'performanceArena',
  'rodeoArena',
  'armyBase',
  'artGallery',
  'artSchool',
  'artStudio',
  'artistsLoft',
  'assemblyLine',
  'outdoorAthleticField',
  'publicAtrium',
  'attic',
  'auditorium',
  'autoFactory',
  'autoShowroom',
  'badlands',
  'shopBakery',
  'exteriorBalcony',
  'interiorBalcony',
  'ballPit',
  'ballroom',
  'bambooForest',
  'bankVault',
  'banquetHall',
  'bar',
  'barn',
  'barndoor',
  'baseballField',
  'basement',
  'indoorBasketballCourt',
  'bathroom',
  'indoorBazaar',
  'outdoorBazaar',
  'beach',
  'beachHouse',
  'beautySalon',
  'bedchamber',
  'bedroom',
  'beerGarden',
  'beerHall',
  'berth',
  'biologyLaboratory',
  'boardwalk',
  'boatDeck',
  'boathouse',
  'bookstore',
  'indoorBooth',
  'botanicalGarden',
  'indoorBowWindow',
  'bowlingAlley',
  'boxingRing',
  'bridge',
  'buildingFacade',
  'bullring',
  'burialChamber',
  'busInterior',
  'indoorBusStation',
  'butcherShop',
  'butte',
  'outdoorCabin',
  'cafeteria',
  'campsite',
  'campus',
  'naturalCanal',
  'urbanCanal',
  'candyStore',
  'canyon',
  'carInterior',
  'carrousel',
  'castle',
  'catacomb',
  'cemetery',
  'chalet',
  'chemistryLab',
  'childsRoom',
  'indoorChurch',
  'outdoorChurch',
  'classroom',
  'cleanRoom',
  'cliff',
  'closet',
  'clothingStore',
  'coast',
  'cockpit',
  'coffeeShop',
  'computerRoom',
  'conferenceCenter',
  'conferenceRoom',
  'constructionSite',
  'cornField',
  'corral',
  'corridor',
  'cottage',
  'courthouse',
  'courtyard',
  'creek',
  'crevasse',
  'crosswalk',
  'dam',
  'delicatessen',
  'departmentStore',
  'sandDesert',
  'vegetationDesert',
  'desertRoad',
  'outdoorDiner',
  'diningHall',
  'diningRoom',
  'discotheque',
  'outdoorDoorway',
  'dormRoom',
  'downtown',
  'dressingRoom',
  'driveway',
  'drugstore',
  'doorElevator',
  'elevatorLobby',
  'elevatorShaft',
  'embassy',
  'engineRoom',
  'entranceHall',
  'indoorEscalator',
  'excavation',
  'fabricStore',
  'farm',
  'fastfoodRestaurant',
  'cultivatedField',
  'wildField',
  'fieldRoad',
  'fireEscape',
  'fireStation',
  'fishpond',
  'indoorFleaMarket',
  'indoorFloristShop',
  'foodCourt',
  'footballField',
  'broadleafForest',
  'forestPath',
  'forestRoad',
  'formalGarden',
  'fountain',
  'galley',
  'indoorGarage',
  'outdoorGarage',
  'gasStation',
  'exteriorGazebo',
  'indoorGeneralStore',
  'outdoorGeneralStore',
  'giftShop',
  'glacier',
  'golfCourse',
  'indoorGreenhouse',
  'outdoorGreenhouse',
  'grotto',
  'indoorGymnasium',
  'indoorHangar',
  'outdoorHangar',
  'harbor',
  'hardwareStore',
  'hayfield',
  'heliport',
  'highway',
  'homeOffice',
  'homeTheater',
  'hospital',
  'hospitalRoom',
  'hotSpring',
  'outdoorHotel',
  'hotelRoom',
  'house',
  'outdoorHuntingLodge',
  'iceCreamParlor',
  'iceFloe',
  'iceShelf',
  'indoorIceSkatingRink',
  'outdoorIceSkatingRink',
  'iceberg',
  'igloo',
  'industrialArea',
  'outdoorInn',
  'islet',
  'indoorJacuzzi',
  'jailCell',
  'japaneseGarden',
  'jewelryShop',
  'junkyard',
  'kasbah',
  'outdoorKennel',
  'kindergardenClassroom',
  'kitchen',
  'lagoon',
  'naturalLake',
  'landfill',
  'landingDeck',
  'laundromat',
  'lawn',
  'lectureRoom',
  'legislativeChamber',
  'indoorLibrary',
  'outdoorLibrary',
  'lighthouse',
  'livingRoom',
  'loadingDock',
  'lobby',
  'lockChamber',
  'lockerRoom',
  'mansion',
  'manufacturedHome',
  'indoorMarket',
  'outdoorMarket',
  'marsh',
  'martialArtsGym',
  'mausoleum',
  'medina',
  'mezzanine',
  'waterMoat',
  'outdoorMosque',
  'motel',
  'mountain',
  'mountainPath',
  'mountainSnowy',
  'indoorMovieTheater',
  'indoorMuseum',
  'outdoorMuseum',
  'musicStudio',
  'naturalHistoryMuseum',
  'nursery',
  'nursingHome',
  'oastHouse',
  'ocean',
  'office',
  'officeBuilding',
  'officeCubicles',
  'oilrig',
  'operatingRoom',
  'orchard',
  'orchestraPit',
  'pagoda',
  'palace',
  'pantry',
  'park',
  'indoorParkingGarage',
  'outdoorParkingGarage',
  'parkingLot',
  'pasture',
  'patio',
  'pavilion',
  'petShop',
  'pharmacy',
  'phoneBooth',
  'physicsLaboratory',
  'picnicArea',
  'pier',
  'pizzeria',
  'playground',
  'playroom',
  'plaza',
  'pond',
  'porch',
  'promenade',
  'indoorPub',
  'racecourse',
  'raceway',
  'raft',
  'railroadTrack',
  'rainforest',
  'reception',
  'recreationRoom',
  'repairShop',
  'residentialNeighborhood',
  'restaurant',
  'restaurantKitchen',
  'restaurantPatio',
  'ricePaddy',
  'river',
  'rockArch',
  'roofGarden',
  'ropeBridge',
  'ruin',
  'runway',
  'sandbox',
  'sauna',
  'schoolhouse',
  'scienceMuseum',
  'serverRoom',
  'shed',
  'shoeShop',
  'shopfront',
  'indoorShoppingMall',
  'shower',
  'skiResort',
  'skiSlope',
  'sky',
  'skyscraper',
  'slum',
  'snowfield',
  'soccerField',
  'stable',
  'baseballStadium',
  'footballStadium',
  'soccerStadium',
  'indoorStage',
  'outdoorStage',
  'staircase',
  'storageRoom',
  'street',
  'platformSubwayStation',
  'supermarket',
  'sushiBar',
  'swamp',
  'swimmingHole',
  'indoorSwimmingPool',
  'outdoorSwimmingPool',
  'outdoorSynagogue',
  'televisionRoom',
  'televisionStudio',
  'asianTemple',
  'throneRoom',
  'ticketBooth',
  'topiaryGarden',
  'tower',
  'toyshop',
  'trainInterior',
  'platformTrainStation',
  'treeFarm',
  'treeHouse',
  'trench',
  'tundra',
  'oceanDeepUnderwater',
  'utilityRoom',
  'valley',
  'vegetableGarden',
  'veterinariansOffice',
  'viaduct',
  'village',
  'vineyard',
  'volcano',
  'outdoorVolleyballCourt',
  'waitingRoom',
  'waterPark',
  'waterTower',
  'waterfall',
  'wateringHole',
  'wave',
  'wetBar',
  'wheatField',
  'windFarm',
  'windmill',
  'yard',
  'youthHostel',
  'zenGarden',
]

const SCENE_CONFIDENCE_THRESHOLD = 0.03

let scenesModel: tf.GraphModel | undefined

async function initializeIfNecessary_(): Promise<void> {
  if (scenesModel) return

  const modelDir = path.join(__dirname, '../../data/beta-models')

  const scenesModelPath = path.join(modelDir, 'scenes-model/model.json')
  scenesModel = await tf.loadGraphModel(`file://${scenesModelPath}`)
}

/**
 * Tensorflow spams console.warn unnecessarily, so we'll patch console.warn to ignore messages from them.
 */
function monkeyPatchConsoleWarn(): void {
  const globalUnsafe = global as any
  if (globalUnsafe.__console_warn__) return

  process.env.TF_CPP_MIN_LOG_LEVEL = '2'

  /* tslint:disable no-console */
  const consoleWarn = console.warn
  console.warn = (...args: any[]) => {
    const stack = new Error().stack || ''
    if (stack.includes('tensorflow')) return
    consoleWarn(...args)
  }

  globalUnsafe.__console_warn__ = consoleWarn
}

async function runScenesModel(imageData: IAnnotatedImageData): Promise<ISceneAnalysisEntry[]> {
  const normalizedImageData = await SharpImage.from(imageData)
    .resize(224, 224, {fit: 'fill'})
    .normalize()
    .raw()
    .toBuffer({resolveWithObject: true})

  const tensorInputArray = new Float32Array(normalizedImageData.data.length)
  for (let i = 0; i < normalizedImageData.data.length; i++) {
    tensorInputArray[i] = normalizedImageData.data[i]
  }

  const imageTensor = tf.tensor4d(tensorInputArray, [1, 224, 224, 3])
  const prediction = scenesModel!.predict(imageTensor) as tf.Tensor
  const data = await prediction.data()

  return [...data]
    .map((confidence, idx) => ({confidence, scene: SCENE_MAP[idx]}))
    .filter(entry => entry.confidence >= SCENE_CONFIDENCE_THRESHOLD)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

const initializeIfNecessary = instrumentation.wrapMethod(
  'scenes.initializeIfNecessary',
  initializeIfNecessary_,
)

export async function detectScene(imageData: IAnnotatedImageData): Promise<ISceneAnalysisEntry[]> {
  await initializeIfNecessary()
  return runScenesModel(imageData)
}