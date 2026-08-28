import {
  closestCorners,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import type { CollisionDetection } from "@dnd-kit/core";

import { STATUS_ORDER } from "@/config";
import type { TaskStatus } from "@/types";

export function readStatus(
  data: Record<string, unknown> | null | undefined,
): TaskStatus | null {
  if (!data) {
    return null;
  }
  return STATUS_ORDER.find((status) => status === data.status) ?? null;
}

export const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  const rectCollisions = rectIntersection(args);
  if (rectCollisions.length > 0) {
    return rectCollisions;
  }
  return closestCorners(args);
};
