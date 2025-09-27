import Footer from "../components/Footer"
import Topbar from "../components/Topbar"
import Home from "../pages/Home"
const MainLayout = () => {
    return (
        <div>
            <Topbar />
           <Home />
            <Footer />
        </div>
    )
}

export default MainLayout