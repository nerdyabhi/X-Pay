import { userContextAtom } from "@/store/atom/userContext";
import axios from "axios";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { API_URL } from "@/utils/constants";

const HomePageGuard = ({ children }: { children: ReactNode }) => {
    const Navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useRecoilState(userContextAtom);


    useEffect(() => {
        if (!token) {
            console.log("No Token Found !");
            Navigate('/login');
        }
    }, [token])

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response: any = await axios.get(API_URL + '/user/profile', {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });

                console.log(response);

                if (response.status === 200) {
                    console.log(response.data.user);

                    setUser(response?.data?.user)
                }
                else {
                    console.log("User Not found");
                    Navigate('/login');
                }
            } catch (err) {
                console.log("Error Signing in ", err);
                Navigate('/login');
            }

        }
        getProfile();
    }, [token])

    return (
        <>
            {children}
        </>
    )
}

export default HomePageGuard;