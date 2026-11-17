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
  imageCaption: photo ? 'Illustrative service reference · Stock photograph' : 'Service illustration · Design reference',
})

export const serviceMedia = {
  construction: entry('construction', null, constructionPreview,
    'Structural construction work and professionals working on a building site',
    'A strong foundation for your vision.'),
  pool: entry('swimming-pool', null, poolPreview,
    'Finished swimming pool with clear water and a carefully detailed poolside terrace',
    'Outdoor living, beautifully planned.'),
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
  interlock: entry('interlock-paving', null, interlockPreview,
    'Illustration of individual interlocking paving stones laid in a decorative geometric pattern',
    'A better approach to your property.'),
  stamped: entry('stamped-paving', null, stampedPreview,
    'Illustration of a textured ashlar stamped paving pattern with a contrasting border',
    'Pattern, texture, and a distinctive arrival.'),
  painting: entry('painting', null, paintingPreview,
    'Interior painting and professional wall finishing reference',
    'Fresh colour. Carefully finished.'),
}
