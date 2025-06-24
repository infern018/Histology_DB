import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import BiotechIcon from "@mui/icons-material/Biotech";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { logout } from "../../redux/reducers/authSlice";
import { COLORS } from "../../theme";
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  return (
    <>
      <AppBar sx={{ boxShadow: "none", position: "sticky", top: 0 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: COLORS.neutral800,
            backgroundColor: theme.palette.background.default,
            padding: "0.5rem 1rem !important",
            minHeight: "auto !important",
            height: "auto",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiotechIcon
              sx={{ fontSize: 30, color: theme.palette.text.primary }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              MiMe
            </Typography>
          </Link>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {user && user.username !== "anyone" ? (
              <>
                <Button
                  component={Link}
                  to={`/user/${user.username}`}
                  state={{ user: user }}
                  variant="text"
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "4px 8px",
                    minHeight: "auto",
                  }}
                >
                  {user.username}
                </Button>
                {user.isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    variant="text"
                    sx={{
                      "color": theme.palette.info.main,
                      "textTransform": "none",
                      "fontSize": "1rem",
                      "padding": "4px 8px",
                      "minHeight": "auto",
                      "fontWeight": "bold",
                      "&:hover": {
                        backgroundColor: "rgba(96, 165, 250, 0.1)",
                        color: theme.palette.info.light,
                      },
                    }}
                  >
                    Admin Panel
                  </Button>
                )}
                {/* <Button
                  variant="text"
                  onClick={() => setOpen(true)}
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "4px 8px",
                    minHeight: "auto",
                  }}
                >
                  Logout
                </Button> */}
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "4px 8px",
                    minHeight: "auto",
                  }}
                >
                  Log in
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "4px 8px",
                    minHeight: "auto",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <Button
              variant="text"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                color: theme.palette.text.primary,
                padding: "4px 8px",
                minHeight: "auto",
              }}
            >
              <MenuIcon />
            </Button>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{
                  p: 2,
                  width: 250,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                {user ? (
                  <>
                    <MenuItem
                      component={Link}
                      to={`/collection/create`}
                      onClick={toggleDrawer(false)}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Create Collection
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={`/user/${user.username}`}
                      state={{ user: user }}
                      onClick={toggleDrawer(false)}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {user.username}
                    </MenuItem>
                    {user.isAdmin && (
                      <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={toggleDrawer(false)}
                        sx={{
                          "color": theme.palette.info.main,
                          "fontWeight": "bold",
                          "&:hover": {
                            backgroundColor: "rgba(96, 165, 250, 0.1)",
                          },
                        }}
                      >
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        toggleDrawer(false)();
                        setOpen(true);
                      }}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      component={Link}
                      to={`/login`}
                      onClick={toggleDrawer(false)}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Log in
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Leaving so soon...
        </DialogTitle>
        <DialogContent sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to log out? Any unsaved changes may be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            sx={{ color: theme.palette.text.primary }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
