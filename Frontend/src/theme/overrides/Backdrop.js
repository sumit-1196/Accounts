import { alpha } from '@mui/material/styles';

export default function Backdrop(theme) {
  const varLow = alpha(theme.palette.grey[900], 0.48);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [
            `rgb(22,28,36)`,
            `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varLow} 100%)`
          ],
          '&.MuiBackdrop-invisible': {
            background: 'transparent'
          }
        }
      }
    }
  };
}
