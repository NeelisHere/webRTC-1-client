import { Box, Button } from "@chakra-ui/react"
import { Outlet, useNavigate } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Layout = () => {
    const navigate = useNavigate()
    return (
        <Box
            // border={'2px solid red'}
            h={'100vh'}
            w={'100vw'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Button 
                leftIcon={<ArrowBackIcon />} 
                onClick={()=> navigate('/home')}
            >
                Home
            </Button>
            
            <Outlet />
        </Box>
    )
}

export default Layout
