// import { useMediaQuery, useTheme } from "@mui/material";

// export const isSmallScreen = () => {
//   const theme = useTheme();
//   return useMediaQuery(theme.breakpoints.down("sm"));
// };

// import { useTheme, useMediaQuery } from "@mui/material";

// export const useIsSmallScreen = (): boolean => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   return isSmallScreen;
// };

import { useMediaQuery } from "@mui/material";

export const useIsSmallScreen = (): boolean => {
    return useMediaQuery("(max-width:599px)"); 
};
