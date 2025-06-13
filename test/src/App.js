import React from "react";
import {
	Container,
	Typography,
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import TaskList from "./components/TaskList";

// Create a simple theme
const theme = createTheme({
	palette: {
		mode: "light", // or 'dark'
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container maxWidth="md">
				<Typography
					variant="h3"
					component="h1"
					gutterBottom
					align="center"
					sx={{ mt: 4, mb: 2 }}
				>
					Task Manager
				</Typography>
				<TaskList />
			</Container>
		</ThemeProvider>
	);
}

export default App;
