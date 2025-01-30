import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const LandingPage: React.FC = () => {
    return (
        <div className="flex  h-[100vh] flex-col items-center justify-center gap-2">
            <h1>xPay : Baap ki kamai Udaye yahan</h1>
           <Link  to='/signup'><Button>Signup</Button></Link>
           <Link  to='/signin'><Button>Signup</Button></Link>
        </div>
    )
}

export default LandingPage;