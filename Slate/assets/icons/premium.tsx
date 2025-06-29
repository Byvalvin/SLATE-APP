import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const premium: React.FC<SvgProps> = ({ color, ...props }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M16.7 18.98H7.30002C6.88002 18.98 6.41002 18.65 6.27002 18.25L2.13002 6.66999C1.54002 5.00999 2.23002 4.49999 3.65002 5.51999L7.55002 8.30999C8.20002 8.75999 8.94002 8.52999 9.22002 7.79999L10.98 3.10999C11.54 1.60999 12.47 1.60999 13.03 3.10999L14.79 7.79999C15.07 8.52999 15.81 8.75999 16.45 8.30999L20.11 5.69999C21.67 4.57999 22.42 5.14999 21.78 6.95999L17.74 18.27C17.59 18.65 17.12 18.98 16.7 18.98Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 22H17.5"
      stroke= {color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 14H14.5"
      stroke= {color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default premium;
