import React from "react";
import { pathOr } from "ramda";

// mui
import { Box } from "@mui/material";

// types
import type { FooterProps } from "../types";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "../utils";

const Footer: React.FC<FooterProps> = (
  props: FooterProps,
): React.ReactElement | null => {
  const children = pathOr([], ["children"], props);

  return isArrayNotEmpty(children) || !isNilOrEmpty(children) ? (
    <Box className="footer">{children}</Box>
  ) : null;
};

export default Footer;
