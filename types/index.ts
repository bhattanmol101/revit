import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Error = {
  code: number;
  message: string | undefined;
};

export type PageState = {
  disabled: boolean;
  loading: boolean;
  success: boolean;
  error: Error | null;
};
