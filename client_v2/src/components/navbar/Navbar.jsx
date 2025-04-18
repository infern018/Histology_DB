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
					bgcolor: "#242424",
					borderBottom: "1px solid",
					borderColor: "grey.800",
				}}>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingX: 2,
					}}>
					<Link
						to="/"
						style={{
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}>
						<BiotechIcon sx={{ fontSize: 30, color: "grey.100" }} />
						<Typography
							variant="h6"
							sx={{
								fontWeight: "bold",
								color: "grey.100",
							}}>
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
										color: "grey.100",
										textTransform: "none",
										fontSize: "1rem",
										"&:hover": {
											textDecoration: "underline",
										},
									}}>
									{user.username}
								</Button>
								<Button
									variant="text"
									onClick={() => setOpen(true)}
									sx={{
										color: "grey.100",
										textTransform: "none",
										fontSize: "1rem",
										"&:hover": {
											textDecoration: "underline",
										},
									}}>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									component={Link}
									to="/login"
									variant="text"
									sx={{
										color: "grey.100",
										textTransform: "none",
										fontSize: "1rem",
										"&:hover": {
											textDecoration: "underline",
										},
									}}>
									Log in
								</Button>
							</>
						)}
					</Box>
					<Box sx={{ display: { xs: "flex", md: "none" } }}>
						<Button
							variant="text"
							aria-label="menu"
							onClick={toggleDrawer(true)}
							sx={{ color: "grey.100" }}>
							<MenuIcon />
						</Button>
						<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
							<Box sx={{ p: 2, width: 250, backgroundColor: "grey.900" }}>
								{user ? (
									<>
										<MenuItem
											component={Link}
											to={`/collection/create`}
											onClick={toggleDrawer(false)}
											sx={{ color: "grey.100" }}>
											Create Collection
										</MenuItem>
										<MenuItem
											component={Link}
											to={`/user/${user.username}`}
											state={{ user: user }}
											onClick={toggleDrawer(false)}
											sx={{ color: "grey.100" }}>
											{user.username}
										</MenuItem>
										<MenuItem
											onClick={() => {
												toggleDrawer(false)();
												setOpen(true);
											}}
											sx={{ color: "grey.100" }}>
											Logout
										</MenuItem>
									</>
								) : (
									<>
										<MenuItem
											component={Link}
											to={`/login`}
											onClick={toggleDrawer(false)}
											sx={{ color: "grey.100" }}>
											Log in
										</MenuItem>
										<MenuItem
											component={Link}
											to={`/signup`}
											onClick={toggleDrawer(false)}
											sx={{ color: "grey.100" }}>
											Sign up
										</MenuItem>
									</>
								)}
							</Box>
						</Drawer>
					</Box>
				</Toolbar>
			</AppBar>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle sx={{ bgcolor: "grey.900", color: "grey.100" }}>Leaving so soon...</DialogTitle>
				<DialogContent sx={{ bgcolor: "grey.900" }}>
					<Typography sx={{ color: "grey.100" }}>
						Are you sure you want to log out? Any unsaved changes may be lost.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ bgcolor: "grey.900" }}>
					<Button onClick={() => setOpen(false)} sx={{ color: "grey.500" }}>
						Cancel
					</Button>
					<Button onClick={handleLogout} sx={{ color: "grey.100" }}>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Navbar;
