import constructionPreview from '../assets/images/services/construction.svg?no-inline'
import poolPreview from '../assets/images/services/pool.svg?no-inline'
import ceilingPreview from '../assets/images/services/ceiling.svg?no-inline'
import interiorPreview from '../assets/images/services/interior.svg?no-inline'
import tilePreview from '../assets/images/services/tiling.svg?no-inline'
import interlockPreview from '../assets/images/services/interlock.svg?no-inline'
import stampedPreview from '../assets/images/services/stamped-paving.svg?no-inline'
import paintingPreview from '../assets/images/services/painting.svg?no-inline'
import ceilingPatternPreview from '../assets/images/services/ceiling-pattern.svg?no-inline'
import ceilingLightingPreview from '../assets/images/services/ceiling-lighting.svg?no-inline'

// Eleven B Site Sense project photographs (supplied by the company, cleaned and optimised to WebP).
import poolDeckPhoto from '../assets/images/projects/swimming-pool-tiled-deck.webp'
import poolJacuzziPhoto from '../assets/images/projects/pool-and-jacuzzi.webp'
import interlockDrivewayPhoto from '../assets/images/projects/paving-rainbow-driveway.webp'
import interlockYellowPhoto from '../assets/images/projects/interlock-paving-yellow.webp'
import stampedDarkPhoto from '../assets/images/projects/stamped-concrete-dark.webp'
import stampedGrassPhoto from '../assets/images/projects/duplex-grass-paving.webp'

// Illustrative stock photography (Unsplash licence) for the General Building page.
import buildResult from '../assets/images/construction/result-villa.webp'
import buildProcess from '../assets/images/construction/process-concrete-pour.webp'
import stepSite from '../assets/images/construction/step-site-materials.webp'
import stepFoundation from '../assets/images/construction/step-foundation-rebar.webp'
import stepStructure from '../assets/images/construction/step-structure-formwork.webp'

// Illustrative tiling photography.
import tileSelection from '../assets/images/tiling/step-tile-selection.webp'
import tileAdhesive from '../assets/images/tiling/step-adhesive.webp'
import tileLaying from '../assets/images/tiling/step-laying.webp'
import tileLiving from '../assets/images/tiling/step-finished-living.webp'
import tileHall from '../assets/images/tiling/result-hall.webp'
import tileBathroom from '../assets/images/tiling/gallery-bathroom.webp'

// Illustrative pool photography.
import poolResult from '../assets/images/pool/result-villa-pool.webp'
import poolProcess from '../assets/images/pool/process-rendering.webp'
import poolDig from '../assets/images/pool/step-excavation.webp'
import poolShell from '../assets/images/pool/step-structure.webp'
import poolMosaic from '../assets/images/pool/step-mosaic.webp'
import poolCurved from '../assets/images/pool/gallery-curved-mosaic.webp'

const PROJECT_CAPTION = 'Eleven B Site Sense project'

// Each service uses a locally bundled, subject-specific design illustration.
// Replace null photo entries only with approved, visually verified photographs.
const entry = (subject, photo, preview, alt, overviewTitle, imagePosition = '50% 50%') => ({
  mediaSubject: subject,
  image: photo || preview,
  photoConfigured: Boolean(photo),
  fallbackSrc: preview,
  fallbackLabel: `${subject.replaceAll('-', ' ')} illustration`,
  fallbackAlt: `${subject.replaceAll('-', ' ')} service illustration. This is a labelled visual preview, not a company project photograph.`,
  alt,
  overviewTitle,
  imagePosition,
  imageCaption: photo ? PROJECT_CAPTION : 'Service illustration · Design reference',
})

export const serviceMedia = {
  construction: {
    ...entry('construction', buildResult, constructionPreview,
      'Finished modern villa with timber cladding, glass balconies and a swimming pool',
      'A strong foundation for your vision.', '50% 55%'),
    imageCaption: 'Illustrative image',
    processImage: buildProcess,
    processAlt: 'Builders levelling a freshly poured concrete slab over steel reinforcement',
    processSteps: [
      { label: 'Site & materials', text: 'Site prepared, materials sourced and the build set out to the agreed plan.', image: stepSite, alt: 'Workers turning a pile of granite chippings on a building site' },
      { label: 'Foundation', text: 'Steel reinforcement and foundations laid to the drawings and site conditions.', image: stepFoundation, alt: 'Builders fixing formwork beside steel reinforcement in a foundation trench' },
      { label: 'Structure', text: 'Columns and slabs cast in stages, with progress updates at each milestone.', image: stepStructure, alt: 'Workers assembling column formwork and scaffolding on a building site' },
      { label: 'Finish & handover', text: 'Finishes completed, the work inspected, and your building handed over.', image: buildResult, alt: 'Finished modern villa with a swimming pool' },
    ],
  },
  pool: {
    ...entry('swimming-pool', poolResult, poolPreview,
      'Modern white two-storey villa with a large blue-tiled swimming pool',
      'Outdoor living, beautifully planned.', '50% 60%'),
    imageCaption: 'Illustrative image',
    processImage: poolProcess,
    processAlt: 'Workers rendering the concrete floor and walls of a pool shell',
    processSteps: [
      { label: 'Excavation', text: 'Pool set out on site and dug to the agreed shape, size and depth.', image: poolDig, alt: 'Freshly excavated rectangular pool pit in red earth beside a house' },
      { label: 'Structure & plumbing', text: 'Reinforced concrete shell cast, with inlets, lights and steps built in.', image: poolShell, alt: 'Rendered concrete pool shell with built-in steps and wall fittings' },
      { label: 'Waterproofing & tiling', text: 'Shell waterproofed, then finished in mosaic tiles with neat lines and edges.', image: poolMosaic, alt: 'Empty pool finished in blue mosaic tiles with tiled steps' },
      { label: 'Fill & handover', text: 'Pool filled, equipment tested and the poolside finished, ready to swim.', image: poolDeckPhoto, alt: 'Finished Eleven B Site Sense swimming pool with a tiled poolside deck' },
    ],
    galleryTitle: 'Pools, finished to enjoy.',
    galleryDescription: 'Eleven B Site Sense projects alongside illustrative examples.',
    gallery: [
      { image: poolJacuzziPhoto, alt: 'Tiled swimming pool with an adjoining circular jacuzzi, built by Eleven B Site Sense', fallbackSrc: poolPreview, fallbackLabel: 'Swimming pool illustration', position: '50% 50%', title: 'Pool with built-in jacuzzi', description: 'Mosaic-tiled pool finished with a circular jacuzzi and seating step.', caption: PROJECT_CAPTION },
      { image: poolCurved, alt: 'Curved swimming pool finished in blue mosaic tiles with a tiled seating step', fallbackSrc: poolPreview, fallbackLabel: 'Swimming pool illustration', position: '50% 60%', title: 'Curved mosaic pool', description: 'Blue mosaic tiles with a contrasting border and built-in seat.', caption: 'Illustrative image' },
    ],
  },
  ceiling: {
    ...entry('pop-ceiling', null, ceilingPreview,
      'Decorative ceiling and lighting within a finished luxury interior',
      'Look up. See the difference.', '50% 5%'),
    fallbackLabel: 'P.O.P. ceiling illustration',
    galleryTitle: 'Ceilings, considered in every detail.',
    gallery: [
      { image: ceilingPatternPreview, alt: 'Interior ceiling design reference', fallbackSrc: ceilingPatternPreview, fallbackLabel: 'Decorative ceiling pattern', fallbackAlt: 'Illustration of decorative coffered gypsum ceiling panels with recessed lights', position: '50% 0%', title: 'Decorative ceiling patterns', description: 'Balanced profiles and carefully composed plaster details.' },
      { image: ceilingLightingPreview, alt: 'Interior ceiling and lighting reference', fallbackSrc: ceilingLightingPreview, fallbackLabel: 'Cove lighting detail', fallbackAlt: 'Close-up illustration of a stepped POP ceiling with concealed cove lighting and recessed spotlights', position: '50% 0%', title: 'Recessed & cove lighting', description: 'Lighting planned into the ceiling, rather than added at the end.' },
    ],
  },
  interior: entry('interior-design', null, interiorPreview,
    'Styled living interior with considered furnishings, colours, and decorative accents',
    'A space with your signature.'),
  tiling: {
    ...entry('tiling', tileHall, tilePreview,
      'Bright hall finished with large white marble-effect floor tiles and a P.O.P. ceiling',
      'Precision in every surface.', '50% 60%'),
    imageCaption: 'Illustrative image',
    processImage: tileLaying,
    processAlt: 'Tiler levelling a large floor tile on fresh adhesive with a spirit level beside him',
    processSteps: [
      { label: 'Tile selection', text: 'Tile type, size, finish and slip resistance chosen to suit the room and your budget.', image: tileSelection, alt: 'Display rack of floor tile samples in different colours and finishes' },
      { label: 'Surface preparation', text: 'Floor levelled and adhesive spread evenly so every tile beds down firmly.', image: tileAdhesive, alt: 'Tile adhesive spread with a notched trowel beside newly laid marble-effect tiles and levelling clips' },
      { label: 'Laying & setting', text: 'Tiles set out, laid and levelled for straight lines and balanced cuts.', image: tileLaying, alt: 'Tiler levelling a large floor tile with a spirit level' },
      { label: 'Grouting & finish', text: 'Joints grouted, edges finished and the floor cleaned, ready to use.', image: tileLiving, alt: 'Finished living room with large polished grey marble-effect floor tiles' },
    ],
    galleryTitle: 'Floors and walls, finished well.',
    galleryDescription: 'Illustrative examples of finished tiling.',
    gallery: [
      { image: tileBathroom, alt: 'Bathroom finished with white and gold marble-effect wall and floor tiles', fallbackSrc: tilePreview, fallbackLabel: 'Tiling illustration', position: '50% 55%', title: 'Wall-to-floor bathroom tiling', description: 'Matching marble-effect tiles across walls and floor for a seamless finish.', caption: 'Illustrative image' },
      { image: tileLiving, alt: 'Living room with large grey marble-effect floor tiles', fallbackSrc: tilePreview, fallbackLabel: 'Tiling illustration', position: '50% 70%', title: 'Large-format living room floor', description: 'Large tiles with tight joints for a clean, open look.', caption: 'Illustrative image' },
    ],
  },
  // A house exterior is not a paving photograph. Leave these photo sources
  // unset until an approved, verifiable paving photograph is available.
  // Replace null with an imported local photo or a verified photo URL.
  interlock: {
    ...entry('interlock-paving', interlockDrivewayPhoto, interlockPreview,
      'Curved multi-coloured interlock paving driveway laid by Eleven B Site Sense',
      'A better approach to your property.', '50% 55%'),
    galleryTitle: 'Interlock paving, laid with care.',
    galleryDescription: 'Photographs from Eleven B Site Sense paving projects.',
    gallery: [
      { image: interlockYellowPhoto, alt: 'Paved compound with contrasting yellow and red interlock bands, by Eleven B Site Sense', fallbackSrc: interlockPreview, fallbackLabel: 'Interlock paving illustration', position: '50% 50%', title: 'Patterned compound paving', description: 'Contrasting bands that define the space and guide movement.', caption: PROJECT_CAPTION },
    ],
  },
  stamped: {
    ...entry('stamped-paving', stampedDarkPhoto, stampedPreview,
      'Dark textured stamped concrete floor with a slate pattern, by Eleven B Site Sense',
      'Pattern, texture, and a distinctive arrival.', '50% 50%'),
    galleryTitle: 'Stamped finishes, built to last.',
    galleryDescription: 'Photographs from Eleven B Site Sense stamped paving projects.',
    gallery: [
      { image: stampedGrassPhoto, alt: 'Stamped concrete slabs separated by grass strips in front of a modern duplex, by Eleven B Site Sense', fallbackSrc: stampedPreview, fallbackLabel: 'Stamped paving illustration', position: '50% 70%', title: 'Stamped slabs with grass joints', description: 'A modern arrival where textured slabs meet soft green lines.', caption: PROJECT_CAPTION },
    ],
  },
  painting: entry('painting', null, paintingPreview,
    'Interior painting and professional wall finishing reference',
    'Fresh colour. Carefully finished.'),
}
