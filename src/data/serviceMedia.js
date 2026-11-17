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
import { media } from './media'

// Service images are deliberately independent of the architectural portfolio.
// Each service has its own subject-specific offline preview. No service falls
// back to the shared house illustration. Stock photos are illustrative only.
const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`
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
  imageCaption: 'Illustrative service reference · Stock photograph',
})

export const serviceMedia = {
  construction: entry('construction', media.construction, constructionPreview,
    'Structural construction work and professionals working on a building site',
    'A strong foundation for your vision.'),
  pool: entry('swimming-pool', media.pool, poolPreview,
    'Finished swimming pool with clear water and a carefully detailed poolside terrace',
    'Outdoor living, beautifully planned.'),
  ceiling: {
    ...entry('pop-ceiling', pexels(1643383), ceilingPreview,
      'Decorative ceiling and lighting within a finished luxury interior',
      'Look up. See the difference.', '50% 5%'),
    fallbackLabel: 'P.O.P. ceiling illustration',
    galleryTitle: 'Ceilings, considered in every detail.',
    gallery: [
      { image: pexels(1457847), alt: 'Interior ceiling design reference', fallbackSrc: ceilingPatternPreview, fallbackLabel: 'Decorative ceiling pattern', fallbackAlt: 'Illustration of decorative coffered gypsum ceiling panels with recessed lights', position: '50% 0%', title: 'Decorative ceiling patterns', description: 'Balanced profiles and carefully composed plaster details.' },
      { image: media.ceiling, alt: 'Interior ceiling and lighting reference', fallbackSrc: ceilingLightingPreview, fallbackLabel: 'Cove lighting detail', fallbackAlt: 'Close-up illustration of a stepped POP ceiling with concealed cove lighting and recessed spotlights', position: '50% 0%', title: 'Recessed & cove lighting', description: 'Lighting planned into the ceiling, rather than added at the end.' },
    ],
  },
  interior: entry('interior-design', media.interior, interiorPreview,
    'Styled living interior with considered furnishings, colours, and decorative accents',
    'A space with your signature.'),
  tiling: entry('tiling', media.tiling, tilePreview,
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
  painting: entry('painting', pexels(5691622), paintingPreview,
    'Interior painting and professional wall finishing reference',
    'Fresh colour. Carefully finished.'),
}
