import { media } from './media'

// DEMONSTRATION CONTENT ONLY. No entries represent company commissions.
export const projectCategories = ['All projects', 'Residential', 'Interiors', 'Outdoor living', 'Exterior finishes']
export const projects = [
  {
    slug: 'the-courtyard-residence', title: 'The Courtyard Residence', category: 'Residential',
    image: media.hero, alt: 'Modern white residence with expansive glazing and an outdoor swimming pool',
    description: 'Clean architectural lines, open spaces, and a seamless connection to the outdoors.',
    concept: 'This residential concept explores a home organised around light, movement, and a generous outdoor connection. A restrained exterior palette and expansive glazing create a calm architectural expression, while shaded transitional spaces offer a comfortable relationship between inside and out.',
    brief: 'An illustrative brief for a contemporary family residence with connected living spaces and a carefully composed exterior.',
    highlights: ['Open-plan living with a strong connection to the courtyard', 'A restrained palette of white render, glass, and natural textures', 'Coordinated structural and exterior finishing considerations'],
    gallery: [media.residence, media.interior], galleryAlts: ['Illustrative contemporary residential exterior', 'Illustrative light-filled neutral living interior'],
    services: ['general-building-contracting', 'painting', 'interlock-paving'],
  },
  {
    slug: 'a-study-in-calm', title: 'A Study in Calm', category: 'Interiors',
    image: media.interior, alt: 'Elegant neutral living room with soft natural textures and considered furnishings',
    description: 'Layered textures, soft light, and interior details that quietly make a difference.',
    concept: 'This interior concept brings together warm neutrals, tactile finishes, and simple forms. The emphasis is on a comfortable everyday space, where ceiling details, colour, artwork, and furnishings feel considered as part of the same composition.',
    brief: 'An illustrative living-room design direction focused on comfort, natural light, and harmonious finishes.',
    highlights: ['A cohesive palette of warm neutral tones', 'Ceiling and lighting details considered alongside the room layout', 'Artwork and decorative accents that complement the space'],
    gallery: [media.ceiling, media.painting], galleryAlts: ['Illustrative contemporary ceiling and interior finish', 'Illustrative warm painted interior'],
    services: ['artwork-and-interior-design', 'pop-ceiling-installation', 'painting'],
  },
  {
    slug: 'the-poolside-retreat', title: 'The Poolside Retreat', category: 'Outdoor living',
    image: media.pool, alt: 'Inviting outdoor swimming pool edged by a landscaped terrace',
    description: 'A considered pool and terrace concept, designed around moments of escape.',
    concept: 'This outdoor living concept combines a clearly defined pool with a comfortable surrounding terrace. It illustrates how pool proportions, material selection, lighting, and circulation can work together to create a relaxed, functional retreat.',
    brief: 'An illustrative pool and terrace direction for a residential property, with space to relax and entertain.',
    highlights: ['A balanced pool layout and practical terrace circulation', 'Pool finishes coordinated with the surrounding outdoor surfaces', 'Equipment, drainage, and maintenance considered within the brief'],
    gallery: [media.hero, media.paving], galleryAlts: ['Illustrative swimming pool beside a modern residence', 'Illustrative paved outdoor approach'],
    services: ['swimming-pool-construction', 'tiling', 'interlock-paving'],
  },
  {
    slug: 'the-modern-approach', title: 'The Modern Approach', category: 'Exterior finishes',
    image: media.stamped, alt: 'Contemporary house exterior with a beautifully composed approach and outdoor finishes',
    description: 'A welcoming arrival, shaped by paving, proportion, and material character.',
    concept: 'This exterior concept considers the arrival experience as part of the architecture. The paving palette, approach, edge details, and facade finishes are composed together to create an exterior that feels ordered and welcoming.',
    brief: 'An illustrative driveway and entrance treatment that complements contemporary residential architecture.',
    highlights: ['A coordinated paving pattern and exterior colour palette', 'Practical movement, access, and drainage considerations', 'Defined edges and thoughtfully finished transitions'],
    gallery: [media.paving, media.residence], galleryAlts: ['Illustrative contemporary outdoor paving', 'Illustrative modern residential facade'],
    services: ['interlock-paving', 'imported-stamped-interlock', 'painting'],
  },
  {
    slug: 'the-light-filled-home', title: 'The Light-filled Home', category: 'Residential',
    image: media.residence, alt: 'Contemporary home combining expansive windows with warm natural materials',
    description: 'Modern residential architecture with a warm and distinctly livable character.',
    concept: 'This home concept explores the relationship between generous windows, a simple structural rhythm, and a welcoming material palette. The focus is on useful spaces and coherent details that carry through from the exterior to the interior.',
    brief: 'An illustrative contemporary home direction with flexible living areas and coordinated interior finishing.',
    highlights: ['A clear architectural rhythm and generous daylight', 'Interior and exterior material choices considered together', 'Practical finishing details for everyday family use'],
    gallery: [media.architecture, media.interior], galleryAlts: ['Illustrative bright architectural interior', 'Illustrative contemporary family living space'],
    services: ['general-building-contracting', 'tiling', 'artwork-and-interior-design'],
  },
  {
    slug: 'the-refined-bathroom', title: 'The Refined Bathroom', category: 'Interiors',
    image: media.tiling, alt: 'Contemporary bathroom with carefully aligned tiles and a refined neutral palette',
    description: 'Precise surfaces and a restrained palette for a beautifully resolved space.',
    concept: 'This bathroom concept uses a concise material palette and careful alignment to create a calm, functional room. Tile layout, junctions, lighting, and fixture positions are considered together, with the practical demands of a wet area informing the details.',
    brief: 'An illustrative bathroom finishing direction with attention to tile layout and coordinated surface treatments.',
    highlights: ['Thoughtful tile setting-out and aligned joints', 'Wet-area preparation and practical surface selection', 'Simple, coordinated finishes and lighting'],
    gallery: [media.architecture, media.ceiling], galleryAlts: ['Illustrative architectural interior finish', 'Illustrative clean ceiling and interior lighting'],
    services: ['tiling', 'painting', 'pop-ceiling-installation'],
  },
]

export const getProject = (slug) => projects.find((project) => project.slug === slug)
