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

// Illustrative P.O.P. ceiling photography.
import ceilBoards from '../assets/images/ceiling/step-boards.webp'
import ceilFraming from '../assets/images/ceiling/step-framing.webp'
import ceilPlaster from '../assets/images/ceiling/step-plastering.webp'
import ceilLounge from '../assets/images/ceiling/step-finished-lounge.webp'
import ceilProcess from '../assets/images/ceiling/process-lighting.webp'
import ceilResult from '../assets/images/ceiling/result-living.webp'
import ceilBedroom from '../assets/images/ceiling/gallery-bedroom.webp'
import ceilCove from '../assets/images/ceiling/gallery-cove.webp'

// Illustrative interlock photography.
import lockMaterials from '../assets/images/interlock/step-materials.webp'
import lockLaying from '../assets/images/interlock/step-laying.webp'
import lockCompaction from '../assets/images/interlock/step-compaction.webp'
import lockResult from '../assets/images/interlock/result-driveway.webp'

// Illustrative painting photography.
import paintMaterials from '../assets/images/painting/step-materials.webp'
import paintExterior from '../assets/images/painting/process-exterior.webp'
import paintPrep from '../assets/images/painting/step-prep.webp'
import paintFinish from '../assets/images/painting/step-finish.webp'
import paintResult from '../assets/images/painting/result-living.webp'

// Illustrative interior photography.
import intMood from '../assets/images/interior/step-moodboard.webp'
import intFabrics from '../assets/images/interior/step-fabrics.webp'
import intPanels from '../assets/images/interior/step-panels.webp'
import intFinished from '../assets/images/interior/step-finished.webp'
import intResult from '../assets/images/interior/result-lounge.webp'
import intBedroom from '../assets/images/interior/gallery-bedroom.webp'
import intWall from '../assets/images/interior/gallery-wall-finishes.webp'

// Illustrative stamped concrete photography.
import stPour from '../assets/images/stamped/step-pour.webp'
import stPattern from '../assets/images/stamped/step-pattern.webp'
import stSeal from '../assets/images/stamped/step-sealing.webp'
import stFinished from '../assets/images/stamped/step-finished.webp'
import stResult from '../assets/images/stamped/result-compound.webp'
import stDriveway from '../assets/images/stamped/gallery-driveway.webp'

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
    stepAspect: '3 / 4',
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
    ...entry('pop-ceiling', ceilResult, ceilingPreview,
      'Living room with a layered P.O.P. ceiling, warm cove lighting and recessed spotlights',
      'Look up. See the difference.', '50% 30%'),
    fallbackLabel: 'P.O.P. ceiling illustration',
    imageCaption: 'Illustrative image',
    processImage: ceilProcess,
    processAlt: 'Ceiling installers working beneath a stepped P.O.P. ceiling with LED cove lighting',
    stepAspect: '3 / 4',
    processSteps: [
      { label: 'Materials', text: 'Quality boards, plaster and fixings chosen for a strong, crack-free ceiling.', image: ceilBoards, alt: 'Stack of moisture-resistant plasterboard sheets ready for installation' },
      { label: 'Framing', text: 'Metal frame set out and fixed level to carry the design and the lighting.', image: ceilFraming, alt: 'Installers fixing a metal ceiling frame to a concrete slab' },
      { label: 'Boarding & plastering', text: 'Boards fixed, joints plastered and profiles shaped to the agreed design.', image: ceilPlaster, alt: 'Worker on a wooden scaffold finishing a stepped ceiling with LED strips' },
      { label: 'Lighting & finish', text: 'Cove lights and spotlights fitted, then a smooth painted finish.', image: ceilLounge, alt: 'Large lounge with a layered ceiling, cove lighting and a pendant chandelier' },
    ],
    galleryTitle: 'Ceilings, considered in every detail.',
    galleryDescription: 'Illustrative examples of finished P.O.P. ceilings.',
    gallery: [
      { image: ceilBedroom, alt: 'Bedroom with a floating P.O.P. ceiling panel and soft cove lighting', fallbackSrc: ceilingPatternPreview, fallbackLabel: 'Decorative ceiling pattern', position: '50% 12%', title: 'Floating bedroom ceiling', description: 'A simple raised panel with hidden lighting around the edge.', caption: 'Illustrative image' },
      { image: ceilCove, alt: 'Living room ceiling with warm cove lighting and recessed spotlights', fallbackSrc: ceilingLightingPreview, fallbackLabel: 'Cove lighting detail', position: '50% 40%', title: 'Recessed & cove lighting', description: 'Lighting planned into the ceiling, rather than added at the end.', caption: 'Illustrative image' },
    ],
  },
  interior: {
    ...entry('interior-design', intResult, interiorPreview,
      'Lounge with a lit P.O.P. ceiling, cream sofas, pale blue armchairs and a patterned rug',
      'A space with your signature.', '50% 50%'),
    imageCaption: 'Illustrative image',
    processImage: intPanels,
    processAlt: 'Bedroom feature wall finished with wood and black fluted panels and wall lights',
    processSteps: [
      { label: 'Concept & moodboard', text: 'Your style, colours and finishes brought together on one board before any work begins.', image: intMood, alt: 'Interior moodboard with marble, brass fittings, cabinet samples and colour swatches' },
      { label: 'Materials & samples', text: 'Fabrics, wall finishes and furnishings chosen and approved with you.', image: intFabrics, alt: 'Hand holding a fan of upholstery fabric samples in many colours' },
      { label: 'Installation & styling', text: 'Wall panels, lighting, furniture and artwork installed and arranged to the plan.', image: intPanels, alt: 'Bedroom with wood and fluted feature panels, wall lights and an upholstered bed' },
      { label: 'Finished space', text: 'Every detail checked and your space handed over, ready to live in.', image: intFinished, alt: 'Finished living and dining area with grey sofas, marble floor and lit ceiling' },
    ],
    galleryTitle: 'Interiors with a signature.',
    galleryDescription: 'Illustrative examples of finished interiors.',
    gallery: [
      { image: intBedroom, alt: 'Bedroom with a brown upholstered bed, fluted wall panel, round mirror and ring pendant light', fallbackSrc: interiorPreview, fallbackLabel: 'Interior illustration', position: '50% 50%', title: 'Warm, modern bedroom', description: 'Soft browns, a fluted feature wall and statement lighting.', caption: 'Illustrative image' },
      { image: intWall, alt: 'Rolls of marble-effect wall finishes in white, gold and blue', fallbackSrc: interiorPreview, fallbackLabel: 'Interior illustration', position: '50% 50%', title: 'Decorative wall finishes', description: 'Marble-effect and patterned finishes to give walls character.', caption: 'Illustrative image' },
    ],
  },
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
    ...entry('interlock-paving', lockResult, interlockPreview,
      'Driveway paved in red and grey interlock blocks leading to a gated modern home',
      'A better approach to your property.', '50% 55%'),
    imageCaption: 'Illustrative image',
    processImage: lockLaying,
    processAlt: 'Paving crew laying grey interlock blocks over a levelled sand bed',
    processSteps: [
      { label: 'Materials', text: 'Interlock blocks chosen for shape, colour and strength to suit foot or vehicle traffic.', image: lockMaterials, alt: 'Stacks of curved grey interlock paving blocks on site' },
      { label: 'Base & laying', text: 'Ground levelled and compacted, then blocks laid to the agreed pattern and borders.', image: lockLaying, alt: 'Workers laying interlock blocks onto a prepared sand base' },
      { label: 'Compaction & jointing', text: 'Paving compacted and joints filled with sand so every block locks firmly in place.', image: lockCompaction, alt: 'Worker running a plate compactor over red and white interlock paving' },
      { label: 'Finished surface', text: 'Edges finished and the area cleaned, ready for cars and everyday use.', image: interlockDrivewayPhoto, alt: 'Curved multi-coloured interlock driveway laid by Eleven B Site Sense' },
    ],
    galleryTitle: 'Interlock paving, laid with care.',
    galleryDescription: 'Eleven B Site Sense projects alongside illustrative examples.',
    gallery: [
      { image: interlockDrivewayPhoto, alt: 'Curved multi-coloured interlock paving driveway laid by Eleven B Site Sense', fallbackSrc: interlockPreview, fallbackLabel: 'Interlock paving illustration', position: '50% 50%', title: 'Rainbow driveway path', description: 'A curved path of coloured bands leading to the gate.', caption: PROJECT_CAPTION },
      { image: interlockYellowPhoto, alt: 'Paved compound with contrasting yellow and red interlock bands, by Eleven B Site Sense', fallbackSrc: interlockPreview, fallbackLabel: 'Interlock paving illustration', position: '50% 50%', title: 'Patterned compound paving', description: 'Contrasting bands that define the space and guide movement.', caption: PROJECT_CAPTION },
    ],
  },
  stamped: {
    ...entry('stamped-paving', stResult, stampedPreview,
      'Compound finished in grey stamped concrete with terracotta borders and a central circle',
      'Pattern, texture, and a distinctive arrival.', '50% 50%'),
    imageCaption: 'Illustrative image',
    processImage: stSeal,
    processAlt: 'Worker rolling sealer over freshly coloured stamped concrete',
    processSteps: [
      { label: 'Base & concrete pour', text: 'Ground prepared, edges set out and concrete poured and levelled to the right depth.', image: stPour, alt: 'Crew levelling freshly poured concrete with a screed board' },
      { label: 'Colour & stamping', text: 'Colour applied and patterns pressed into the concrete while it is still workable.', image: stPattern, alt: 'Freshly stamped red fan-pattern walkway with a dark stamped border' },
      { label: 'Sealing', text: 'Surface cleaned and sealed to deepen the colour and protect it from wear and weather.', image: stSeal, alt: 'Worker rolling sealer over grey and red stamped concrete' },
      { label: 'Finished surface', text: 'Edges finished and the area handed over, ready for cars and everyday use.', image: stFinished, alt: 'Compound finished in glossy red stamped concrete with a decorative circle' },
    ],
    galleryTitle: 'Stamped finishes, built to last.',
    galleryDescription: 'Eleven B Site Sense projects alongside illustrative examples.',
    gallery: [
      { image: stampedDarkPhoto, alt: 'Dark textured stamped concrete floor with a slate pattern, by Eleven B Site Sense', fallbackSrc: stampedPreview, fallbackLabel: 'Stamped concrete illustration', position: '50% 50%', title: 'Dark slate-pattern finish', description: 'A deep, textured stamped surface with a natural stone look.', caption: PROJECT_CAPTION },
      { image: stDriveway, alt: 'Curved driveway in stamped flagstone-pattern concrete beside a lawn', fallbackSrc: stampedPreview, fallbackLabel: 'Stamped concrete illustration', position: '50% 50%', title: 'Flagstone-pattern driveway', description: 'Stamped concrete with the look of natural stone, in one durable slab.', caption: 'Illustrative image' },
      { image: stampedGrassPhoto, alt: 'Stamped concrete slabs separated by grass strips in front of a modern duplex, by Eleven B Site Sense', fallbackSrc: stampedPreview, fallbackLabel: 'Stamped paving illustration', position: '50% 70%', title: 'Stamped slabs with grass joints', description: 'A modern arrival where textured slabs meet soft green lines.', caption: PROJECT_CAPTION },
    ],
  },
  painting: {
    ...entry('painting', paintResult, paintingPreview,
      'Living room with a deep teal feature wall, light grey walls and styled furniture',
      'Fresh colour. Carefully finished.', '50% 40%'),
    imageCaption: 'Illustrative image',
    processImage: paintExterior,
    processAlt: 'Painters finishing the exterior walls and metal gate of a newly built bungalow',
    processSteps: [
      { label: 'Paint & materials', text: 'Quality paints chosen for the room, surface and finish, from emulsion to gloss.', image: paintMaterials, alt: 'Buckets and tins of interior and gloss paint ready for the job' },
      { label: 'Preparation & skimming', text: 'Flaking paint removed, cracks filled and walls skimmed smooth before priming.', image: paintPrep, alt: 'Roller applying fresh white paint beside a wall with peeling old paint' },
      { label: 'Painting', text: 'Primer and top coats applied evenly inside and out, with clean lines at edges and corners.', image: paintExterior, alt: 'Painters rolling exterior walls and painting the gate of a new bungalow' },
      { label: 'Final finish', text: 'Touch-ups done, the room cleaned and your space handed back ready to use.', image: paintFinish, alt: 'Freshly painted grey room with a lit ceiling and light wooden floor' },
    ],
    galleryTitle: 'Colour, carefully finished.',
    galleryDescription: 'Illustrative examples of finished painting.',
    gallery: [
      { image: paintResult, alt: 'Living room with a deep teal feature wall', fallbackSrc: paintingPreview, fallbackLabel: 'Painting illustration', position: '50% 50%', title: 'Feature wall in deep teal', description: 'One bold wall to give the room character, balanced by soft grey.', caption: 'Illustrative image' },
      { image: paintFinish, alt: 'Empty room painted in two shades of grey', fallbackSrc: paintingPreview, fallbackLabel: 'Painting illustration', position: '50% 50%', title: 'Two-tone grey finish', description: 'Darker and lighter greys used together for depth and calm.', caption: 'Illustrative image' },
    ],
  },
}
