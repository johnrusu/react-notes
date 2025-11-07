import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

// mui
import { Box } from "@mui/material";

//mui icons
import GradeIcon from "@mui/icons-material/Grade";

// utils
import { isLightColor, hexToRgba, isNilOrEmpty } from "../utils";

// types
import type { DraggableNoteProps, DragItem } from "../types";

// constants
import { ITEM_TYPES } from "../constants";

export const DraggableNote: FC<DraggableNoteProps> = ({
  id,
  text,
  index,
  moveNote,
  className,
  color = "#FFFFFF",
  highlighted,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ITEM_TYPES.NOTE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveNote(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.NOTE,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  // Function to determine if a color is light or dark
  const textColor = isLightColor(color) ? "#000000" : "#ffffff";
  const rgbaColor: { r: number; g: number; b: number; a: number } | null =
    hexToRgba(textColor, 0.3);

  return (
    <Box
      ref={ref}
      style={{ background: color, opacity }}
      data-handler-id={handlerId}
      className={`relative ${className}`}
      gap={1}
    >
      {highlighted ? (
        <Box
          className="absolute top-2 right-2 flex p-2 h-3 items-center w-3 justify-center rounded-full"
          sx={{
            backgroundColor: `rgba(${rgbaColor?.r}, ${rgbaColor?.g}, ${rgbaColor?.b}, ${rgbaColor?.a})`,
          }}
        >
          <GradeIcon
            sx={{ color: "#ffffff", fontSize: 12, lineHeight: 12, height: 12 }}
          />
        </Box>
      ) : null}
      {!isNilOrEmpty(text) ? <Box color={textColor}>{text}</Box> : null}
    </Box>
  );
};
export default DraggableNote;
