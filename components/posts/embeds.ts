import type { ComponentType } from "react";
import CompressDemo from "@/components/CompressDemo";
import ErdosProblemList from "./ErdosProblemList";

// Interactive or structured artifacts rendered after a post's body.
export const POST_EMBEDS: Record<string, ComponentType> = {
  "six-more-erdos-problems": ErdosProblemList,
  "satellite-compression": CompressDemo,
};
