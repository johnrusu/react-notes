import React from "react";
import { NavLink } from "react-router-dom";

// ramda
import { pathOr } from "ramda";

// mui
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

// mui icons
import MenuIcon from "@mui/icons-material/Menu";

//mui icons
import LoginIcon from "@mui/icons-material/Login";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import InfoIcon from "@mui/icons-material/Info";

// icons
import faviconImg from "@/assets/favicons/favicon-32x32.png";

// types
import type { IHeader } from "../types";

// constants
import { NOTES_LABELS, ROUTER_PATHS, SETTINGS_PATHS } from "../constants";
const Header: React.FC<IHeader> = (props: IHeader): React.ReactElement => {
  const onLoginClick = pathOr(() => {}, ["onLoginClick"], props);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    onLoginClick();
  };

  const getIcon = (defaultIcon: string) => {
    console.log("Default Icon:", defaultIcon); // Debugging line
    const ICON_SWITCH: { [key: string]: React.ReactElement } = {
      home: <HomeFilledIcon className={"text-white"} />,
      about: <InfoIcon className={"text-white"} />,
    };
    return ICON_SWITCH[defaultIcon];
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ flexGrow: 0 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <img src={faviconImg} alt={NOTES_LABELS.title} />
                <span className="text-white ml-2 text-lg font-semibold">
                  {NOTES_LABELS.title}
                </span>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {ROUTER_PATHS.map((router, key) => {
                    const path = router.PATH;
                    const defaultIcon = router.ICON;
                    const name = router.NAME;
                    return (
                      <MenuItem key={path} onClick={handleCloseNavMenu}>
                        <NavLink
                          key={key}
                          to={path}
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                          }
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            color="inherit"
                            startIcon={getIcon(defaultIcon)}
                          >
                            {name}
                          </Button>
                        </NavLink>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={faviconImg} alt={NOTES_LABELS.title} />
                  <span className="text-white ml-2 text-lg font-semibold">
                    {NOTES_LABELS.title}
                  </span>
                </Box>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {ROUTER_PATHS.map((router, key) => {
                  const path = router.PATH;
                  const defaultIcon = router.ICON;
                  const name = router.NAME;
                  return (
                    <NavLink
                      key={key}
                      to={path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      style={{ textDecoration: "none" }}
                    >
                      <Button color="inherit" startIcon={getIcon(defaultIcon)}>
                        {name}
                      </Button>
                    </NavLink>
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button
                startIcon={<LoginIcon className="text-white" />}
                className="auth0-button"
                onClick={(event) => {
                  handleLogin();
                  handleOpenUserMenu(event);
                }}
              >
                <span className="text-white">{NOTES_LABELS.login}</span>
              </Button>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {SETTINGS_PATHS.map((settingPath, settingKey) => {
                  const path = settingPath?.PATH;
                  const name = settingPath?.NAME;
                  const icon = settingPath?.ICON;

                  return (
                    <MenuItem
                      key={`${path}-${settingKey}`}
                      onClick={handleCloseUserMenu}
                    >
                      <NavLink
                        key={settingKey}
                        to={path}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active" : ""}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Button color="inherit" startIcon={getIcon(icon)}>
                          {name}
                        </Button>
                      </NavLink>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default Header;
