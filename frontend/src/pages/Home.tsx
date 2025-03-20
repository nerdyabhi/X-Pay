import { userContextAtom } from "@/store/atom/userContext"
import { useRecoilState } from "recoil"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/constants";

const Home = () => {
    const token = localStorage.getItem('token');
    const [user] = useRecoilState<any>(userContextAtom);
    const [email, setEmail] = useState(null);
    const [amount, setAmount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [transactionHistory, setTransactionHistory] = useState([]);
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

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                const response = await axios.get(API_URL + "/transaction/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response);

                setTransactionHistory(response?.data?.data);
            } catch (error) {
                console.error('Failed to fetch transaction history:', error);
            }
        };
        fetchTransactionHistory();
    }, [])



    return (
        <>
            <h1 className="bg-red-200">{errorMessage}</h1>
            <h1>Hello {user?.name}</h1>
            <h1>Mail :  {user?.email}</h1>
            <h1>Your Balance : {user?.balance}</h1>

            {transactionHistory &&
                <div className="py-4">
                    <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
                    <div className="border rounded-lg">
                        {transactionHistory.map((transaction: any) => (
                            <div
                                key={transaction.trans_id}
                                className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium">Transaction #{transaction.trans_id}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(transaction.transaction_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${user?.id === transaction.sender_id ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                        {user?.id === transaction.sender_id ? '-' : '+'}
                                        ₹{parseFloat(transaction.amount).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {user?.id === transaction.sender_id ? 'Sent' : 'Received'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }

            <form className="border-red-400 flex flex-col w-full h-full py-2 space-y-4" action="#">
                <input onChange={(e: any) => setEmail(e.target.value)} className="border-2" type="text" placeholder="Enter Email" name="" id="" />
                <input onChange={(e: any) => setAmount(e.target.value)} className="border-2" type="number" placeholder="Enter Amount" />
                <Button onClick={(e) => sendMoneyHandler(e)}>Send Money</Button>
            </form>
        </>
    )
}

export default Home;