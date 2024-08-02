import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormInputs {
  userId: string;
  password: string;
}

const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoadingLogin(true);

    const loginPromise = signIn("credentials", {
      redirect: false,
      userId: data.userId,
      password: data.password,
      callbackUrl: "/dashboard",
    });

    toast.promise(loginPromise, {
      pending: "Submitting login data...",
      success: "Login successful!",
      error: {
        render({ data }) {
          setLoadingLogin(false);
          return `Login failed`;
        },
      },
    });

    const resp = await loginPromise;

    if (resp?.error) {
      return;
    }

    const cookies = parseCookies();
    let nextUrl = "/dashboard";

    if (cookies.nextSession) {
      const nextSessionObj = JSON.parse(cookies.nextSession);
      nextUrl = nextSessionObj.url;
      destroyCookie(null, "nextSession");
    } else {
      const raw = window.localStorage.getItem("nextSession") ?? "";

      if (raw !== "" && raw !== undefined && raw !== null) {
        const stored = JSON.parse(raw);
        if (stored) {
          nextUrl = String(stored?.url);
        }
      } else if (resp?.url) {
        nextUrl = String(resp?.url);
      }
    }

    router.push(nextUrl);
  };

  return { register, handleSubmit, onSubmit, errors };
};

export { useLogin };
