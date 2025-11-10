import { dimensionsCalculation, getBottomSpace } from '../utils';

export default {
  headerHeight: dimensionsCalculation(80),
  tabBarHeight: dimensionsCalculation(55 + getBottomSpace()),
  // url: 'http://196.25.70.10/services/',
  // url: 'https://qudspaints.bloom-jo.com/services/',
  url: 'https://port.qudspaints.com/services/',
  googleApiKey: 'AIzaSyDuRevX7os_7tLijEPRfV-qG0DECgF6rfc',

  userTypesList: [
    { type: 'User', id: 0 },
    { type: 'Painter', id: 1 },
    { type: 'Tiler', id: 2 },
  ],
  userTypes: {
    0: 'User',
    1: 'Painter',
    2: 'Tiler',
  },
};
