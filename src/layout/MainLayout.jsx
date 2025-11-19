import { Outlet } from "react-router"
import Footer from "../components/Footer"
import Topbar from "../components/Topbar"

const MainLayout = () => {
    return (
        <div>
            <Topbar />
           {/* <Home /> */}
           <Outlet/>
            <Footer />
        </div>
    )
}

export default MainLayout