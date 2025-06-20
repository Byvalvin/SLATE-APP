import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const Diary: React.FC<SvgProps> = ({ color, ...props }) => (
  <Svg
    width={18}
    height={23}
    viewBox="0 0 18 23"
    fill="none"
    {...props}
  >
    <Path
      d="M1 19.9C1 18.7402 1.85961 17.8 2.92 17.8H17V17.8C17 20.1196 15.1196 22 12.8 22H2.92C1.85961 22 1 21.0598 1 19.9ZM1 19.9V6C1 3.23857 3.23858 1 6 1H12C14.7614 1 17 3.23857 17 6V17.7918M5.8 11.5H12.2M5 8H13"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Diary;
