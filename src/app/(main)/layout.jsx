import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const layout = ({children}) => {
    return (
        <div>
            <Navbar/>
            <div className="mt-16">{children}</div>
            <Footer/>
        </div>
    );
};

export default layout;