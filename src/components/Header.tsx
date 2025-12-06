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
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// mui icons
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

//mui icons
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

// components
import Image from "./Image";

// icons
import faviconImg from "@/assets/favicons/favicon-32x32.png";

// types
import type { IHeader } from "../types";

// constants
import { NOTES_LABELS, ROUTER_PATHS, SETTINGS_PATHS } from "../constants";

// auth0
import { useAuth0 } from "@auth0/auth0-react";
import { isNilOrEmpty } from "@/utils";

const getIcon = (defaultIcon: string) => {
  const ICON_SWITCH: { [key: string]: React.ComponentType } = {
    home: HomeFilledIcon,
    about: InfoIcon,
    logout: LogoutIcon,
    settings: SettingsIcon,
    dashboard: DashboardIcon,
    person: PersonIcon,
  };
  const IconComponent = ICON_SWITCH[defaultIcon];
  if (!IconComponent) {
    console.warn(`Unknown icon: ${defaultIcon}`);
    return null;
  }
  return React.createElement(IconComponent);
};

const LoginSection = ({
  onLoginClick,
  onLogoutClick,
}: {
  onLoginClick: () => void;
  onLogoutClick: () => void;
}): React.ReactElement => {
  const { user, isAuthenticated = false } = useAuth0();
  const src = pathOr("", ["picture"], user);
  const alt = pathOr("", ["name"], user);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return !isAuthenticated ? (
    <Button
      startIcon={<LoginIcon />}
      className="auth0-button"
      onClick={() => {
        onLoginClick();
      }}
    >
      <span>{NOTES_LABELS.login}</span>
    </Button>
  ) : (
    <>
      <IconButton
        className="auth0-button"
        onClick={handleOpenUserMenu}
        aria-label="Open user menu"
      >
        <Image
          src={src}
          alt={alt}
          fallbackIcon={<AccountCircleIcon fontSize="large" />}
          className="user-avatar"
        />
      </IconButton>
      <Menu
        sx={{ mt: "40px" }}
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
          const path = settingPath?.path;
          const name = settingPath?.name;
          const icon = getIcon(settingPath?.icon || "");
          const method = settingPath?.method || undefined;
          switch (method) {
            case "logout":
              return (
                <MenuItem
                  className="menu-item"
                  key={`${path}-${settingKey}`}
                  onClick={() => {
                    handleCloseUserMenu();
                    onLogoutClick();
                  }}
                >
                  {!isNilOrEmpty(icon) ? (
                    <ListItemIcon>{icon}</ListItemIcon>
                  ) : null}
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              );
            default:
              break;
          }

          return (
            <MenuItem
              key={`${path}-${settingKey}`}
              onClick={handleCloseUserMenu}
              className="menu-item"
            >
              {!isNilOrEmpty(path) ? (
                <NavLink
                  key={settingKey}
                  to={path}
                  className={({ isActive }) =>
                    ` nav-link flex flex-row cursor-pointer items-center ${isActive ? "active" : ""}`
                  }
                >
                  {!isNilOrEmpty(icon) ? (
                    <ListItemIcon>{icon}</ListItemIcon>
                  ) : null}
                  <ListItemText>{name}</ListItemText>
                </NavLink>
              ) : (
                <Box
                  key={settingKey}
                  {...(typeof method === "function" ? { onClick: method } : {})}
                  className="nav-link cursor-pointer flex flex-row items-center"
                >
                  {!isNilOrEmpty(icon) ? (
                    <ListItemIcon>{icon}</ListItemIcon>
                  ) : null}
                  <ListItemText>{name}</ListItemText>
                </Box>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

// Header component
const Header: React.FC<IHeader> = (props: IHeader): React.ReactElement => {
  const onLoginClick = pathOr(() => {}, ["onLoginClick"], props);
  const onLogoutClick = pathOr(() => {}, ["onLogoutClick"], props);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container className="min-w-full">
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
              <span className="ml-2 text-lg font-semibold">
                {NOTES_LABELS.title}
              </span>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="Open navigation menu"
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
                sx={{ display: { xs: "block", md: "none" }, minWidth: "250px" }}
              >
                {ROUTER_PATHS.map((router, key) => {
                  const path = router.path;
                  const defaultIcon = router.icon;
                  const name = router.name;
                  const icon = getIcon(defaultIcon);

                  return (
                    <MenuItem
                      className="menu-item"
                      key={path}
                      onClick={handleCloseNavMenu}
                    >
                      <NavLink
                        key={key}
                        to={path}
                        className={({ isActive }) =>
                          `nav-link flex flex-row ${isActive ? "active" : ""}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        {!isNilOrEmpty(icon) ? (
                          <ListItemIcon>{icon}</ListItemIcon>
                        ) : null}
                        <ListItemText>{name}</ListItemText>
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
                <span className="ml-2 text-lg font-semibold">
                  {NOTES_LABELS.title}
                </span>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {ROUTER_PATHS.map((router, key) => {
                const path = router.path;
                const defaultIcon = router.icon;
                const name = router.name;
                const icon = getIcon(defaultIcon);
                return (
                  <NavLink
                    key={key}
                    to={path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Button startIcon={icon}>{name}</Button>
                  </NavLink>
                );
              })}
            </Box>
          </Box>
          <LoginSection
            onLoginClick={onLoginClick}
            onLogoutClick={onLogoutClick}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
