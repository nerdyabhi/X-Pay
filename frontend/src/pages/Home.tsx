import { userContextAtom } from "@/store/atom/userContext"
import { useRecoilState } from "recoil"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/constants";

const Home = () => {
    const token = localStorage.getItem('token');
    const [user] = useRecoilState<any>(userContextAtom);
    const [email, setEmail] = useState(null);
    const [amount, setAmount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const sendMoneyHandler = async (e: any) => {
        e.preventDefault();
        console.log(email, amount, token);

        try {
            const response = await axios.post(
                API_URL + "/transaction/new",
                { reciever_email: email, amount: Number(amount) }, // Request body
                { headers: { Authorization: `Bearer ${token}` } } // Correct placement of headers
            );

            console.log(response);
            
        } catch (error: any) {
            setErrorMessage(error?.message);
        }

    }

    return (
        <>
            <h1 className="bg-red-200">{errorMessage}</h1>
            <h1>Hello {user?.name}</h1>
            <h1>Mail :  {user?.email}</h1>
            <h1>Your Balance : {user?.balance}</h1>

            <form className="border-red-400 flex flex-col w-full h-full py-2 space-y-4" action="#">
                <input onChange={(e: any) => setEmail(e.target.value)} className="border-2" type="text" placeholder="Enter Email" name="" id="" />
                <input onChange={(e: any) => setAmount(e.target.value)} className="border-2" type="number" placeholder="Enter Amount" />
                <Button onClick={(e) => sendMoneyHandler(e)}>Send Money</Button>
            </form>
        </>
    )
}

export default Home;