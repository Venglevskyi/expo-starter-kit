export type BackgroundGradient = readonly [string, string, ...string[]];

export type Colors = {
  background: { primary: string; gradient: BackgroundGradient };
  surface: { default: string; subtle: string };
  text: { primary: string; secondary: string; muted: string; placeholder: string; inverse: string };
  border: { default: string; subtle: string };
  brand: { default: string; dark: string; light: string };
  action: { default: string; hover: string; light: string };
  accent: { default: string; dark: string; mid: string; light: string };
  tag: {
    green: { bg: string; text: string };
    burgundy: { bg: string; text: string };
    blue: { bg: string; text: string };
    dark: { bg: string; text: string };
  };
  icon: { default: string; muted: string; inverse: string };
  star: string;
  button: {
    primaryBg: string;
    primaryText: string;
    secondaryBorder: string;
    secondaryText: string;
    neutralBg: string;
    neutralText: string;
    iconBg: string;
  };
  appleButton: { backgroundColor: string; text: string; borderColor: string };
  googleButton: {
    light: { bg: string; text: string; border: string };
    neutral: { bg: string; text: string; border: string };
  };
  shadow: string;
};
