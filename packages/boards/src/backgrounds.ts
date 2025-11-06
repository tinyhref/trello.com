import bricks from 'resources/images/backgrounds/bricks.png';
import canyonfull from 'resources/images/backgrounds/canyon/full.jpg';
import canyonlarge from 'resources/images/backgrounds/canyon/large.jpg';
import canyonmedium from 'resources/images/backgrounds/canyon/medium.jpg';
import canyonsmall from 'resources/images/backgrounds/canyon/small.jpg';
import cityfull from 'resources/images/backgrounds/city/full.jpg';
import citylarge from 'resources/images/backgrounds/city/large.jpg';
import citymedium from 'resources/images/backgrounds/city/medium.jpg';
import citysmall from 'resources/images/backgrounds/city/small.jpg';
import cosmosfull from 'resources/images/backgrounds/cosmos/full.jpg';
import cosmoslarge from 'resources/images/backgrounds/cosmos/large.jpg';
import cosmosmedium from 'resources/images/backgrounds/cosmos/medium.jpg';
import cosmossmall from 'resources/images/backgrounds/cosmos/small.jpg';
import dewfull from 'resources/images/backgrounds/dew/full.jpg';
import dewlarge from 'resources/images/backgrounds/dew/large.jpg';
import dewmedium from 'resources/images/backgrounds/dew/medium.jpg';
import dewsmall from 'resources/images/backgrounds/dew/small.jpg';
import hex from 'resources/images/backgrounds/hex.png';
import mountainfull from 'resources/images/backgrounds/mountain/full.jpg';
import mountainlarge from 'resources/images/backgrounds/mountain/large.jpg';
import mountainmedium from 'resources/images/backgrounds/mountain/medium.jpg';
import mountainsmall from 'resources/images/backgrounds/mountain/small.jpg';
import oceanfull from 'resources/images/backgrounds/ocean/full.jpg';
import oceanlarge from 'resources/images/backgrounds/ocean/large.jpg';
import oceanmedium from 'resources/images/backgrounds/ocean/medium.jpg';
import oceansmall from 'resources/images/backgrounds/ocean/small.jpg';
import orangeblur from 'resources/images/backgrounds/orange-blur.png';
import purpleblur from 'resources/images/backgrounds/purple-blur.png';
import purtywooddark from 'resources/images/backgrounds/purty_wood_dark.png';
import rainfull from 'resources/images/backgrounds/rain/full.jpg';
import rainlarge from 'resources/images/backgrounds/rain/large.jpg';
import rainmedium from 'resources/images/backgrounds/rain/medium.jpg';
import rainsmall from 'resources/images/backgrounds/rain/small.jpg';
import redsweater from 'resources/images/backgrounds/red-sweater.png';
import riverfull from 'resources/images/backgrounds/river/full.jpg';
import riverlarge from 'resources/images/backgrounds/river/large.jpg';
import rivermedium from 'resources/images/backgrounds/river/medium.jpg';
import riversmall from 'resources/images/backgrounds/river/small.jpg';
import snowbokehfull from 'resources/images/backgrounds/snow-bokeh/full.jpg';
import snowbokehlarge from 'resources/images/backgrounds/snow-bokeh/large.jpg';
import snowbokehmedium from 'resources/images/backgrounds/snow-bokeh/medium.jpg';
import snowbokehsmall from 'resources/images/backgrounds/snow-bokeh/small.jpg';
import subtleirongrip from 'resources/images/backgrounds/subtle-irongrip.png';
import wave from 'resources/images/backgrounds/wave.png';
import gradientalien from 'resources/images/gradients/gradient-alien.svg';
import gradientbubbledark from 'resources/images/gradients/gradient-bubble-dark.svg';
import gradientbubble from 'resources/images/gradients/gradient-bubble.svg';
import gradientcrystal from 'resources/images/gradients/gradient-crystal.svg';
import gradientearth from 'resources/images/gradients/gradient-earth.svg';
import gradientflower from 'resources/images/gradients/gradient-flower.svg';
import gradientocean from 'resources/images/gradients/gradient-ocean.svg';
import gradientpeach from 'resources/images/gradients/gradient-peach.svg';
import gradientrainbow from 'resources/images/gradients/gradient-rainbow.svg';
import gradientsnow from 'resources/images/gradients/gradient-snow.svg';
import gradientvolcano from 'resources/images/gradients/gradient-volcano.svg';

const ccLicense = 'http://creativecommons.org/licenses/by/2.0/deed.en';

type BackgroundPack = 'patterns' | 'photos' | 'unsplash';

type HexColor = `#${string}`;

interface Scaled {
  width: number;
  height: number;
  url: string;
}

interface Attribution {
  url: string;
  name: string;
  license: string;
}

export interface Background {
  id: string;
  type: 'default' | 'gradient' | 'premium';
  tile: boolean;
  brightness: 'dark' | 'light';
  version?: number;
}

interface PremiumBackground extends Background {
  type: 'premium';
  pack: BackgroundPack;
  attribution?: Attribution;
}

export interface ColorBackground extends Background {
  color: HexColor;
}

export interface GradientBackground extends Background {
  type: 'gradient';
  color: HexColor;
  bottomColor: HexColor;
  topColor: HexColor;
  emoji: string;
  fullSizeUrl: string;
}

export interface ModernGradientBackground extends GradientBackground {
  darkFullSizeUrl: string;
  darkColor: HexColor;
  version: number;
}

export interface PhotoBackground extends PremiumBackground {
  fullSizeUrl: string;
  scaled: Scaled[];
  bottomColor: HexColor;
  topColor: HexColor;
}

export interface PatternBackground extends PremiumBackground {
  fullSizeUrl: string;
  bottomColor: HexColor;
  topColor: HexColor;
}

export interface ColorBackgroundsType {
  [key: string]: ColorBackground;
}

export interface GradientBackgroundsType {
  [key: string]: GradientBackground | ModernGradientBackground;
}

export interface PhotoBackgroundsType {
  [key: string]: PhotoBackground;
}

export interface PatternBackgroundsType {
  [key: string]: PatternBackground;
}

export type BackgroundsType =
  | ColorBackground
  | GradientBackground
  | ModernGradientBackground
  | PatternBackground
  | PhotoBackground;

export const ColorBackgrounds: ColorBackgroundsType = {
  blue: {
    id: 'blue',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#0079BF',
  },

  orange: {
    id: 'orange',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#D29034',
  },

  green: {
    id: 'green',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#519839',
  },

  red: {
    id: 'red',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#B04632',
  },

  purple: {
    id: 'purple',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#89609E',
  },

  pink: {
    id: 'pink',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#CD5A91',
  },

  lime: {
    id: 'lime',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#4BBF6B',
  },

  sky: {
    id: 'sky',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#00AECC',
  },

  grey: {
    id: 'grey',
    type: 'default',
    tile: false,
    brightness: 'dark',
    color: '#838C91',
  },
};

export const GradientBackgrounds: GradientBackgroundsType = {
  'gradient-bubble': {
    id: 'gradient-bubble',
    type: 'gradient',
    version: 2.0,
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientbubble,
    darkFullSizeUrl: gradientbubbledark,
    color: '#DCEAFE',
    darkColor: '#172F53',
    bottomColor: '#CFE1FD',
    topColor: '#E9F2FE',
    emoji: '🫧',
  },

  'gradient-snow': {
    id: 'gradient-snow',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientsnow,
    color: '#228CD5',
    bottomColor: '#37B4C3',
    topColor: '#0C66E4',
    emoji: '❄️',
  },

  'gradient-ocean': {
    id: 'gradient-ocean',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientocean,
    color: '#0B50AF',
    bottomColor: '#09326C',
    topColor: '#0C66E4',
    emoji: '🌊',
  },

  'gradient-crystal': {
    id: 'gradient-crystal',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientcrystal,
    color: '#674284',
    bottomColor: '#CD519D',
    topColor: '#09326C',
    emoji: '🔮',
  },

  'gradient-rainbow': {
    id: 'gradient-rainbow',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientrainbow,
    color: '#A869C1',
    bottomColor: '#E774BB',
    topColor: '#6E5DC6',
    emoji: '🌈',
  },

  'gradient-peach': {
    id: 'gradient-peach',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientpeach,
    color: '#EF763A',
    bottomColor: '#FAA53D',
    topColor: '#E34935',
    emoji: '🍑',
  },

  'gradient-flower': {
    id: 'gradient-flower',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientflower,
    color: '#F488A6',
    bottomColor: '#F87462',
    topColor: '#E774BB',
    emoji: '🌸',
  },

  'gradient-earth': {
    id: 'gradient-earth',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientearth,
    color: '#3FA495',
    bottomColor: '#60C6D2',
    topColor: '#1F845A',
    emoji: '🌎',
  },

  'gradient-alien': {
    id: 'gradient-alien',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientalien,
    color: '#374866',
    bottomColor: '#172B4D',
    topColor: '#505F79',
    emoji: '👽',
  },

  'gradient-volcano': {
    id: 'gradient-volcano',
    type: 'gradient',
    tile: false,
    brightness: 'dark',
    fullSizeUrl: gradientvolcano,
    color: '#762A14',
    bottomColor: '#AE2A19',
    topColor: '#43290F',
    emoji: '🌋',
  },
};

export const PhotoBackgrounds: PhotoBackgroundsType = {
  mountain: {
    id: 'mountain',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'light',
    bottomColor: '#DFE8E7',
    topColor: '#DFE8E7',
    fullSizeUrl: mountainfull,
    scaled: [
      {
        width: 2400,
        height: 1696,
        url: mountainlarge,
      },
      {
        width: 1024,
        height: 724,
        url: mountainmedium,
      },
      {
        width: 320,
        height: 227,
        url: mountainsmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/62681247@N00/6575973407/',
      name: 'jqmj (Queralt)',
      license: ccLicense,
    },
  },

  cosmos: {
    id: 'cosmos',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#1D3454',
    topColor: '#1D3454',
    fullSizeUrl: cosmosfull,
    scaled: [
      {
        width: 2047,
        height: 1638,
        url: cosmoslarge,
      },
      {
        width: 1600,
        height: 1280,
        url: cosmosmedium,
      },
      {
        width: 320,
        height: 256,
        url: cosmossmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/gsfc/6945160410/',
      name: 'NASA Goddard Space Flight Center',
      license: ccLicense,
    },
  },

  rain: {
    id: 'rain',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#010E2E',
    topColor: '#010E2E',
    fullSizeUrl: rainfull,
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: rainlarge,
      },
      {
        width: 1024,
        height: 683,
        url: rainmedium,
      },
      {
        width: 320,
        height: 213,
        url: rainsmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/vinothchandar/5243641910/',
      name: 'Vinoth Chandar',
      license: ccLicense,
    },
  },

  dew: {
    id: 'dew',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'light',
    bottomColor: '#FBE4D4',
    topColor: '#FBE4D4',
    fullSizeUrl: dewfull,
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: dewlarge,
      },
      {
        width: 1024,
        height: 680,
        url: dewmedium,
      },
      {
        width: 320,
        height: 212,
        url: dewsmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/jenny-pics/5584430423/',
      name: 'Jenny Downing',
      license: ccLicense,
    },
  },

  'snow-bokeh': {
    id: 'snow-bokeh',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#605784',
    topColor: '#605784',
    fullSizeUrl: snowbokehfull,
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: snowbokehlarge,
      },
      {
        width: 1024,
        height: 681,
        url: snowbokehmedium,
      },
      {
        width: 320,
        height: 213,
        url: snowbokehsmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/tabor-roeder/5337595458/',
      name: 'Phil Roeder',
      license: ccLicense,
    },
  },

  city: {
    id: 'city',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#3B3B3B',
    topColor: '#3B3B3B',
    fullSizeUrl: cityfull,
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: citylarge,
      },
      {
        width: 1024,
        height: 680,
        url: citymedium,
      },
      {
        width: 320,
        height: 212,
        url: citysmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/nosha/2907855809/',
      name: 'Nathan Siemers',
      license: ccLicense,
    },
  },

  canyon: {
    id: 'canyon',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#F8B368',
    topColor: '#F8B368',
    fullSizeUrl: canyonfull,
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: canyonlarge,
      },
      {
        width: 1024,
        height: 681,
        url: canyonmedium,
      },
      {
        width: 320,
        height: 213,
        url: canyonsmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/wolfgangstaudt/2252688630/',
      name: 'Wolfgang Staudt',
      license: ccLicense,
    },
  },

  ocean: {
    id: 'ocean',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#2C457B',
    topColor: '#2C457B',
    fullSizeUrl: oceanfull,
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: oceanlarge,
      },
      {
        width: 1024,
        height: 683,
        url: oceanmedium,
      },
      {
        width: 320,
        height: 213,
        url: oceansmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/mattphipps/4635112852/',
      name: 'MattJP',
      license: ccLicense,
    },
  },

  river: {
    id: 'river',
    type: 'premium',
    pack: 'photos',
    tile: false,
    brightness: 'dark',
    bottomColor: '#AD9A89',
    topColor: '#AD9A89',
    fullSizeUrl: riverfull,
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: riverlarge,
      },
      {
        width: 1024,
        height: 683,
        url: rivermedium,
      },
      {
        width: 320,
        height: 213,
        url: riversmall,
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/22746515@N02/3114276532/',
      name: 'Bert Kaufmann',
      license: ccLicense,
    },
  },
};

export const PatternBackgrounds: PatternBackgroundsType = {
  purty_wood_dark: {
    id: 'purty_wood_dark',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#D09F59',
    topColor: '#D09F59',
    fullSizeUrl: purtywooddark,
    attribution: {
      url: 'http://subtlepatterns.com/purty-wood/',
      name: 'Richard Tabor',
      license: ccLicense,
    },
  },

  'subtle-irongrip': {
    id: 'subtle-irongrip',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#454545',
    topColor: '#454545',
    fullSizeUrl: subtleirongrip,
    attribution: {
      url: 'http://subtlepatterns.com/iron-grip/',
      name: 'Tony Kinard',
      license: ccLicense,
    },
  },

  'red-sweater': {
    id: 'red-sweater',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#623430',
    topColor: '#623430',
    fullSizeUrl: redsweater,
    attribution: {
      url: 'http://subtlepatterns.com/wild-oliva/',
      name: 'Badhon Ebrahim',
      license: ccLicense,
    },
  },

  hex: {
    id: 'hex',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#8AB362',
    topColor: '#8AB362',
    fullSizeUrl: hex,
  },

  wave: {
    id: 'wave',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#92A9B8',
    topColor: '#92A9B8',
    fullSizeUrl: wave,
  },

  bricks: {
    id: 'bricks',
    type: 'premium',
    pack: 'patterns',
    tile: true,
    brightness: 'dark',
    bottomColor: '#7F9FB1',
    topColor: '#7F9FB1',
    fullSizeUrl: bricks,
  },

  'purple-blur': {
    id: 'purple-blur',
    type: 'premium',
    pack: 'patterns',
    tile: false,
    brightness: 'dark',
    bottomColor: '#8B3EB1',
    topColor: '#8B3EB1',
    fullSizeUrl: purpleblur,
  },

  'orange-blur': {
    id: 'orange-blur',
    type: 'premium',
    pack: 'patterns',
    brightness: 'dark',
    tile: false,
    bottomColor: '#C04643',
    topColor: '#C04643',
    fullSizeUrl: orangeblur,
  },
};

export const Backgrounds = {
  ...ColorBackgrounds,
  ...GradientBackgrounds,
  ...PhotoBackgrounds,
  ...PatternBackgrounds,
};
