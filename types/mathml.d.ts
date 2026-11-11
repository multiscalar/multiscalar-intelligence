// MathML elements for JSX: the methodology section writes its equations in
// MathML, which browsers render natively. @types/react doesn't list them yet.
import "react";

type MathProps = React.HTMLAttributes<HTMLElement> & {
  display?: "block" | "inline";
  width?: string;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      math: MathProps;
      mrow: MathProps;
      mi: MathProps;
      mn: MathProps;
      mo: MathProps;
      msub: MathProps;
      msubsup: MathProps;
      mfrac: MathProps;
      munder: MathProps;
      mspace: MathProps;
    }
  }
}
