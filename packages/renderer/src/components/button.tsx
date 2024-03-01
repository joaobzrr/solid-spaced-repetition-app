import { JSX, Component } from "solid-js";
import { Button as KobalteButton } from "@kobalte/core";

type ButtonProps = KobalteButton.ButtonRootProps & {
  children?: JSX.Element;
}

export const Button: Component<ButtonProps> = (props) => {
  return (
    <KobalteButton.Root {...props} />
  );
}
