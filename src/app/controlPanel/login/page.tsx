'use client';
import React, {useEffect, useState} from "react";
import { LoginApi } from './components/utils/utils';
import { useRouter } from "next/navigation";
import LoginCard from "./components/LoginCard";

//types
import { ChangePasswordForm, LoginForm } from './components/utils/types.js';
import ChangePasswordCard from "./components/ChangePasswordCard";

export default function Home() {
    const [loggedUser, setLoggedUser] = useState(null);
    const api = new LoginApi('users');
    useEffect(() => {
        if(localStorage.getItem('token')) {
            router.push('/controlPanel');
        }
      }, []);
    
    const router = useRouter();
    const loginUser = async (values: LoginForm) => {
        const result = await api.login(values);
        if ( result.user.status === 'CREATED' ) {
            setLoggedUser(result.user);
            return;
        }
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('permissions', JSON.stringify(result.permissions));
        router.push('/controlPanel');
    }

    const changePassword = async (values: ChangePasswordForm) => {
        try {
            await api.resetPassword(loggedUser.id, values);
            setLoggedUser(null);
        } catch (error) {
            console.log(error);
        } finally {

        }
        
    }

    return (
        <div className="">
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        Prolab admin
                    </a>
                    {
                        !loggedUser ?
                        (
                            <LoginCard  loginFunction={loginUser} />
                        ) :
                        (
                            <ChangePasswordCard  isChangePassword={false} changePassword={changePassword} />
                        )
                    }
                    
                </div>
            </section>
        </div>
    );
}
