import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  breakpoints: {
    values: {
      break1: 384, // Custom breakpoint at 384px
    },
  },
  components: {
    // MuiFilledInput: {
    //   styleOverrides: {
    //     root: {
    //       color: '#fff',
    //       backgroundColor: '#26282b',
    //       '&:hover': {
    //         backgroundColor: 'rgb(53,53,53)',
    //       },
    //       '&.Mui-focused': {
    //         backgroundColor: '#26282b',
    //       },
    //       '&:before': {
    //         borderBottomColor: '#bebfc0',
    //       },
    //       '&:hover:not(.Mui-disabled):before': {
    //         borderBottomColor: '#bebfc0',
    //       },
    //       '&:after': {
    //         borderBottomColor: 'deepskyblue',
    //       },
    //     },
    //     input: {
    //       color: '#fff',
    //     },
    //   },
    // },
    // MuiInput: {
    //   styleOverrides: {
    //     root: {
    //       color: '#fff',
    //       '&:before': {
    //         borderBottomColor: '#bebfc0',
    //       },
    //       '&:hover:not(.Mui-disabled):before': {
    //         borderBottomColor: '#bebfc0',
    //       },
    //       '&:after': {
    //         borderBottomColor: 'white',
    //       },
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: 'rgb(255,255,255,0.7)',
    //       '&.Mui-focused': {
    //         color: 'deepskyblue',
    //       },
    //     },
    //   },
    // },
    // MuiInputAdornment: {
    //   styleOverrides: {
    //     root: {
    //       color: '#fff',
    //     },
    //   },
    // },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '14px',
          transition: 'color 0.3s ease, background-color 0.3s ease',
          '&:not(.MuiChip-ignore):not(.MuiChip-active)': {
            borderRadius: '10px',
            // color: 'white',
            // backgroundColor: 'rgba(0,0,0,0.4)',
            // '&:hover': {
            //   backgroundColor: 'rgba(0,0,0,0.2)',
            // },
          },
          '&.MuiChip-active': {
            borderRadius: '10px',
            color: 'rgba(0,0,0,0.9)',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#ffffffdd',
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          position: 'absolute',
          top: 0,
          right: 1,
          // color: 'rgba(255, 255, 255, 0.7)', // Color when not focused
          '&.Mui-focused:not(.Mui-error)': {
            color: 'deepskyblue',
          },
        },
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       '--IconButton-hoverBg': 'rgba(0, 0, 0, 0.2)',
    //     },
    //   },
    // },
  },
});

export default theme;
