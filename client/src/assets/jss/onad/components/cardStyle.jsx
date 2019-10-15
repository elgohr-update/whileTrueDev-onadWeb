import {
  blackColor,
  whiteColor,
  hexToRgb,
} from '../../onad';

const cardStyle = {
  card: {
    border: '0',
    marginBottom: '30px',
    marginTop: '30px',
    color: `rgba(${hexToRgb(blackColor)}, 0.87)`,
    background: whiteColor,
    width: '100%',
    boxShadow: `0 1px 4px 0 rgba(${hexToRgb(blackColor)}, 0.14)`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem',
  },
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none',
  },
  cardProfile: {
    marginTop: '20px',
    textAlign: 'center',
  },
  cardChart: {
    '& p': {
      marginTop: '0px',
      paddingTop: '0px',
    },
  },
};

export default cardStyle;
