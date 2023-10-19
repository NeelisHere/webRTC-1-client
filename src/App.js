import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import SocketProvider from './providers/Socket';
import Home from './pages/Home';
import Room from './pages/Room';


const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "room/:roomId",
		element: <Room />,
	},
])

const App = () => {
	return (
		<SocketProvider>
			<ChakraProvider>
				<RouterProvider router={router} />
			</ChakraProvider>
		</SocketProvider>
	);
}

export default App;
