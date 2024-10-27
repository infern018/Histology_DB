import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider
import CssBaseline from "@mui/material/CssBaseline"; // To reset CSS
import theme from "./theme"; // Import the custom theme

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<ThemeProvider theme={theme}>
				<CssBaseline /> {/* Ensures consistent baseline styling */}
				<App />
			</ThemeProvider>
		</PersistGate>
	</Provider>
);
