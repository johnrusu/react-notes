import React from "react";

import Lottie, { type LottieOptions } from "lottie-react";

import { pathOr } from "ramda";

// utils
import { isNilOrEmpty } from "../utils";

// types
import type { AnimationsLoaderProps } from "../types";

const AnimationsLoader: React.FC<AnimationsLoaderProps> = (
  props: AnimationsLoaderProps,
): React.ReactElement | null => {
  const DEFAULT_OPTIONS: LottieOptions = {
    animationData: undefined,
    loop: true,
    autoplay: true,
  };

  const options: LottieOptions = pathOr(DEFAULT_OPTIONS, ["options"], props);
  const renderCondition = !isNilOrEmpty(options);
  return isNilOrEmpty(renderCondition) ? null : <Lottie {...options} />;
};
export default AnimationsLoader;
