import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import BiotechIcon from "@mui/icons-material/Biotech"; // Import the BiotechIcon
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { logout } from "../../redux/reducers/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              fontFamily: "Roboto, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)",
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
                sx={{ fontSize: 40, color: "rgba(5, 146, 225, 0.8)" }}
              />
              <span
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "rgba(5, 146, 246, 0.8)",
                }}
              >
                MiMe
              </span>
            </Link>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {user ? (
                <>
                  <Button
                    component={Link}
                    to={`/user/${user.username}`}
                    state={{ user: user }}
                    variant="text"
                  >
                    {user.username}
                  </Button>
                  <Button variant="text" onClick={() => setOpen(true)}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to={`/login`} variant="text">
                    Log in
                  </Button>
                  <Button component={Link} to={`/signup`} variant="contained">
                    Sign up
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </Button>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
                  {user ? (
                    <>
                      <MenuItem
                        component={Link}
                        to={`/collection/create`}
                        onClick={toggleDrawer(false)}
                      >
                        +
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to={`/user/${user.username}`}
                        state={{ user: user }}
                        onClick={toggleDrawer(false)}
                      >
                        {user.username}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          toggleDrawer(false)();
                          setOpen(true);
                        }}
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
                      >
                        Log in
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to={`/signup`}
                        onClick={toggleDrawer(false)}
                      >
                        Sign up
                      </MenuItem>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Leaving so soon...</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to log out? Any unsaved changes may be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
