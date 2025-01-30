import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const Navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const result = await axios.post("http://localhost:3000/user/login", { email, password });
            if (result.status === 200) {
                localStorage.setItem('token', result?.data?.token);
                Navigate('/home');
            }
        } catch (err: any) {

            const emsg = err?.message || "Something went wrong";
            setErrorMsg(emsg);
        }

        setEmail(''); setPassword('');
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-500">
            <div className="w-full text-white max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center">Sign Up</h2>
                <form className="space-y-4">
                    {errorMsg && (
                        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                            {errorMsg}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-black  r rounded-lg hover:border-2 "
                        onClick={(e) => handleSubmit(e)}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
};


export default Login;