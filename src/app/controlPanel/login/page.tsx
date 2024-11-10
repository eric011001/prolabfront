"use client";
import React, { useEffect, useState } from "react";
import { LoginApi } from "./components/utils/utils";
import { useRouter } from "next/navigation";
import LoginCard from "./components/LoginCard";
import { Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";

//types
import { ChangePasswordForm, LoginForm } from "./components/utils/types.js";
import ChangePasswordCard from "./components/ChangePasswordCard";

type User = {
  name: string;
  id: string;
};

export default function Home() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const api = new LoginApi("users");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/controlPanel");
    }
  }, []);

  const router = useRouter();
  const loginUser = async (values: LoginForm) => {
    try {
      setIsActionProcessing(true);
      const result = await api.login(values);
      if (result.user.status === "CREATED") {
        setLoggedUser(result.user);
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("permissions", JSON.stringify(result.permissions));
      router.push("/controlPanel");
    } catch (error) {
      if(typeof error === 'string') {
        setError(error);
      }
    } finally {
        setIsActionProcessing(false);
    }
  };

  const changePassword = async (values: ChangePasswordForm) => {
    try {
    setIsActionProcessing(true);
      if (loggedUser) {
        await api.resetPassword(loggedUser?.id, values);
        setLoggedUser(null);
      }
      throw Error("No disponible");
    } catch (error) {
        if(typeof error === 'string') {
            setError(error);
        }
    } finally {
        setIsActionProcessing(false);
    }
  };

  return (
    <div className="">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            Prolab admin
          </a>
          {!loggedUser ? (
            <LoginCard disabledLoginButton={isActionProcessing} loginFunction={loginUser} />
          ) : (
            <ChangePasswordCard
              isChangePassword={false}
              disabledLoginButton={isActionProcessing}
              changePassword={changePassword}
            />
          )}
        </div>
        {error && (
          <Toast className="fixed top-5 right-5">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              {error}
            </div>
            <Toast.Toggle />
          </Toast>
        )}
      </section>
    </div>
  );
}
