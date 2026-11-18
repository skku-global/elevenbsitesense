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
    ...entry('swimming-pool', poolDeckPhoto, poolPreview,
      'Finished Eleven B Site Sense swimming pool with blue tiles and a wood-effect tiled poolside deck',
      'Outdoor living, beautifully planned.', '50% 60%'),
    galleryTitle: 'Pools we have delivered.',
    galleryDescription: 'Photographs from Eleven B Site Sense pool projects.',
    gallery: [
      { image: poolJacuzziPhoto, alt: 'Tiled swimming pool with an adjoining circular jacuzzi, built by Eleven B Site Sense', fallbackSrc: poolPreview, fallbackLabel: 'Swimming pool illustration', position: '50% 50%', title: 'Pool with built-in jacuzzi', description: 'Mosaic-tiled pool finished with a circular jacuzzi and seating step.', caption: PROJECT_CAPTION },
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
  tiling: entry('tiling', null, tilePreview,
    'Carefully finished bathroom floor and wall tiles with aligned joints',
    'Precision in every surface.'),
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
