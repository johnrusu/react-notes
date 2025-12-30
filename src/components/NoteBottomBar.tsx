import React, { useState } from "react";

// mui
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";

// mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";

// types
interface NoteBottomBarProps {
  textColor: string;
  menuItems: React.ReactNode[];
}

const NoteBottomBar: React.FC<NoteBottomBarProps> = ({
  textColor,
  menuItems,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "transparent",
        boxShadow: "0px -1px 3px rgba(0, 0, 0, 0.08)",
        position: "absolute",
        inset: "auto 0 0 auto",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          size="small"
          sx={{ color: textColor }}
          onClick={handleClick}
          aria-label="note options"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{ display: { xs: "block" } }}
        >
          {menuItems.map((menuItem, index) => (
            <MenuItem key={`note-menu-item-${index}`} className="menu-item">
              {React.cloneElement(
                menuItem as React.ReactElement,
                {
                  onClick: handleClose,
                } as any,
              )}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NoteBottomBar;
