"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { useState } from "react";
import { Alert } from "@heroui/alert";
import Link from "next/link";
import Image from "next/image";

import logo from "../../../public/assets/revit-logo.svg";
import { signInWithGoogleAction } from "../signin/action";

import { signUpAction } from "./action";

import { title } from "@/components/primitives";
import { GoogleIcon } from "@/components/icons";
import { SignupUser } from "@/types/user";
import { validateEmail, validatePassword } from "@/utils/validators";
import { PageState } from "@/types";

export default function SignupPage() {
  const [signup, updateSignup] = useState<PageState>({
    disabled: false,
    loading: false,
    success: false,
    error: null,
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();

    updateSignup((signup) => ({
      ...signup,
      loading: true,
    }));

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as SignupUser;

    const res = await signUpAction(data.email, data.password);

    updateSignup({
      disabled: res.success,
      loading: false,
      success: res.success,
      error: res.error,
    });
  };

  return (
    <section className="min-h-screen flex sm:flex-row flex-col items-center sm:justify-evenly pt-10 sm:pt-0">
      <div className="flex flex-col justify-center items-center text-center sm:pb-0 pb-10">
        <div className="sm:pb-12 pb-6">
          <Image
            priority
            alt="logo"
            className="sm:h-full h-16"
            height={100}
            src={logo}
          />
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
          className="max-w-sm sm:py-7 py-4"
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
      <div className="flex flex-col justify-center items-center max-w-sm">
        {(signup.disabled || signup.error) && (
          <Alert
            className="sm:mb-5 mb-2"
            color={signup.success ? "success" : "danger"}
            title={
              signup.success
                ? "Thanks for signing up! Please check your email for verification link."
                : signup.error?.message
            }
          />
        )}
        <Form
          className="w-96 flex flex-col items-center sm:gap-4 gap-2"
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
            isDisabled={signup.disabled}
            isLoading={signup.loading}
            spinnerPlacement="end"
            type="submit"
          >
            Sign Up
          </Button>
          <p className="text-default-400 text-tiny">
            By signing up you agree to our{" "}
            <a className="text-primary-300" href="/terms">
              terms & conditions
            </a>
          </p>
        </Form>
        <div className="flex flex-row justify-center items-center max-w-sm sm:my-10 my-6">
          <Divider className="w-36 mr-5" />
          <span className="text-gray-500">OR</span>
          <Divider className="w-36 ml-5" />
        </div>
        <Button
          className="max-w-sm"
          color="default"
          fullWidth={true}
          startContent={<GoogleIcon size={22} />}
          onPress={signInWithGoogleAction}
        >
          Signup with Google
        </Button>
        <Divider className="w-full my-5" />
        <Button
          as={Link}
          className="w-full"
          color="primary"
          href="/signin"
          variant="flat"
        >
          Sign In
        </Button>
      </div>
    </section>
  );
}
