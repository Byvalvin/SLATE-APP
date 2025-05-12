import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const progress = ({ color, ...props }: SvgProps)  => (
  <Svg
    width={22}
    height={23}
    viewBox="0 0 22 23"
    fill="none"
    //xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16 22V15.875M18.5002 14.125V22M20.9999 21.9999L21 11.5M1 15.875C1 19.2577 3.61167 22 6.83333 22C10.055 22 12.6667 19.2577 12.6667 15.875C12.6667 12.4923 10.055 9.75 6.83333 9.75M1 15.875C1 12.4923 3.61167 9.75 6.83333 9.75M1 15.875H4.61111C5.83841 15.875 6.83333 14.8303 6.83333 13.5417V9.75M2.66667 4.5H19.3333C20.2538 4.5 21 3.7165 21 2.75C21 1.7835 20.2538 1 19.3333 1H2.66667C1.74619 1 1 1.7835 1 2.75C1 3.7165 1.74619 4.5 2.66667 4.5Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default progress;
