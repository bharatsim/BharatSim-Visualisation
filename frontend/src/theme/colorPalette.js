const colors = {
  primaryColorScale: {
    800: '#282154',
    700: '#392F75',
    600: '#493C97',
    500: '#594ab7',
    400: '#7769C5',
    200: '#B4ABDF',
    100: '#D2CDEB',
    50: '#F0EEF9',
  },
  grayScale: {
    800: '#343A40',
    700: '#4a4f55',
    600: '#61666b',
    500: '#797d82',
    400: '#929599',
    300: '#abaeb2',
    200: '#c5c7cb',
    100: '#e0e1e4',
    50: '#fbfcfe',
  },
  button: {
    borderColor: '#694ED6',
    color: '#FFFFFF',
  },
  tab: { color: '#694ED6' },
  borderColor: '#694ED6',

  textLight: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.8)',
    disabled: 'rgba(255, 255, 255, 0.6)',
  },
};

const muiColorPalette = {
  type: 'light',
  primary: {
    main: '#282154',
    light: '#413288',
    dark: '#535DA8',
  },
  secondary: {
    main: '#494949',
    light: '#757575',
    dark: '#A4A4A4',
  },
  error: {
    dark: '#C31E0E',
    main: '#FD583A',
    light: '#FF8B66',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    light: '#0F74D5',
    main: '#2593FC',
    dark: '#70D2FF',
  },
  success: {
    light: '#9EED7E',
    main: '#57C22D',
    dark: '#579B21',
  },
  text: {
    primary: '#343A40',
    secondary: 'rgba(52, 58, 64, 0.64)',
    disabled: 'rgba(52, 58, 64, 0.38)',
  },
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    hoverOpacity: 0.04,
    selected: 'rgba(0, 0, 0, 0.08)',
    selectedOpacity: 0.08,
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(0, 0, 0, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
  grey: colors.grayScale,
  divider: 'rgba(0, 0, 0, 0.12)',
  background: {
    paper: '#fff',
    default: '#fafafa',
  },
};
const chartColorsPallet = [
  ['#88C1F7', '#1E3FD8', '#A85DA0', '#F37943', '#21C694', '#F7C75C'],
  ['#62CEFF', '#EC3237', '#FAA847', '#21C694', '#1E3FD8', '#C962BE'],
  [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba',
  ],
  ['#58595b'],
];

export { muiColorPalette, colors, chartColorsPallet };
