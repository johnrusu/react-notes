import React, { useEffect, useState } from "react";

import { is, pathOr } from "ramda";

// utils
import { checkImage, isNilOrEmpty } from "../utils";

// types
interface ImageProps {
  src: string;
  alt: string;
  fallbackIcon: React.ReactElement | null;
  className?: string;
}

const Image = (props: ImageProps): React.ReactElement | null => {
  const src = pathOr("", ["src"], props);
  const className = pathOr("", ["className"], props);
  const alt = pathOr("", ["alt"], props);
  const fallbackIcon = pathOr<React.ReactElement | null>(
    null,
    ["fallbackIcon"],
    props,
  );

  const [asyncImage, setAsyncImage] = useState<null | HTMLImageElement>(null);

  useEffect(() => {
    checkImage(src)
      .then((image) => {
        setAsyncImage(image);
      })
      .catch(() => {
        setAsyncImage(null);
      });
  }, [src]);

  return !isNilOrEmpty(asyncImage) && asyncImage && is(Object, asyncImage) ? (
    <img
      src={asyncImage.src}
      alt={alt}
      crossOrigin="anonymous"
      className={className}
    />
  ) : !isNilOrEmpty(fallbackIcon) ? (
    fallbackIcon
  ) : null;
};

export default Image;
