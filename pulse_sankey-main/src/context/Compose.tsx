import * as React from "react";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

interface Props {
  providers: Array<FunctionComponent<PropsWithChildren<{}>>>;
  children: ReactNode;
}

export const Compose = ({ children, providers }: Props) => (
  <>
    {providers.reduceRight(
      (a, B) => (
        <B>{a}</B>
      ),
      children,
    )}
  </>
);
