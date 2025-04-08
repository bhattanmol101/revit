"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@heroui/alert";
import { Form } from "@heroui/form";
import Link from "next/link";
import Image from "next/image";

import logo from "../../../public/assets/revit-logo.svg";

import { signInAction } from "./action";

import { title } from "@/components/primitives";
import { GoogleIcon } from "@/components/icons";
import { PageState } from "@/types";
import { useGlobalStore } from "@/store";
import { validateEmail, validatePassword } from "@/utils/validators";
import { fetchUserAction } from "@/app/action";
import { SignupUser, User } from "@/types/user";

export default function Main() {
  const router = useRouter();

  const [signin, updateSignin] = useState<PageState>({
    disabled: false,
    loading: false,
    success: false,
    error: null,
  });

  const { setGlobalState } = useGlobalStore((state) => state);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    updateSignin((signup) => ({
      ...signup,
      loading: true,
    }));

    const data = Object.fromEntries(new FormData(e.currentTarget)) as SignupUser;

    const res = await signInAction(data);

    updateSignin({
      disabled: res.success,
      loading: false,
      success: res.success,
      error: res.error,
    });

    if (res.success) {
      const user = await fetchUserAction();
      if (user) {
        setGlobalState({ auth: true, user: user});
        router.replace("/");
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-row items-center justify-evenly">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="pb-12">
          <Image alt="logo" height={80} src={logo} />
        </div>
        <div>
          <span className={title({ color: "yellow", size: "lg" })}>
            Review&nbsp;
          </span>
          <span className={title({ color: "pink", size: "lg" })}>
            Everything
          </span>
        </div>
        <Slider
          aria-label="Volume"
          className="max-w-sm py-7"
          color="primary"
          defaultValue={2}
          maxValue={5}
          minValue={0}
          size="md"
          step={0.1}
        />
        <p>
          Find ratings, reviews for what you need &
          <br />
          review anything you want.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        {signin.error && (
          <Alert
            className="mb-5"
            color={"danger"}
            title={signin.error?.message}
          />
        )}

        <Form
          className="w-96 flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={onSubmit}
        >
          <Input
            errorMessage="Please enter a valid email"
            label="Email"
            name="email"
            placeholder="user@aeradron.com"
            type="email"
            validate={validateEmail}
          />
          <Input
            errorMessage="Please enter a valid password"
            label="Password"
            name="password"
            placeholder="Password123"
            type="password"
            validate={validatePassword}
          />
          <Button
            className="mt-2"
            color="primary"
            fullWidth={true}
            isDisabled={signin.disabled}
            isLoading={signin.loading}
            spinnerPlacement="end"
            type="submit"
          >
            Login
          </Button>
        </Form>
        <div className="flex flex-row justify-center items-center max-w-sm my-10">
          <Divider className="w-36 mr-5" />
          <span className="text-gray-500">OR</span>
          <Divider className="w-36 ml-5" />
        </div>
        <Button
          className="max-w-sm"
          color="default"
          fullWidth={true}
          startContent={<GoogleIcon size={22} />}
        >
          Login with Google
        </Button>
        <Divider className="w-full my-5" />
        <Button
          as={Link}
          className="w-full"
          color="primary"
          href="/signup"
          variant="flat"
        >
          Sign Up
        </Button>
      </div>
    </section>
  );
}
