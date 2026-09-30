"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const { data: resData, error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to create account. Please try again.");
      } else {
        setSuccessMsg("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create an account</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter your details below to create your account
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/50">
            {successMsg}
          </div>
        )}

        <Form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }
              return null;
            }}
          >
            <Label>Name</Label>
            <Input name="name" placeholder="John Doe" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input name="email" placeholder="john@example.com" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input name="password" placeholder="Enter your password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>

          <div className="mt-2 flex flex-col gap-3">
            <Button type="submit" isDisabled={loading}>
              {loading ? "Creating account..." : "Submit"}
            </Button>

            <Button type="reset" variant="secondary" isDisabled={loading}>
              Reset
            </Button>
          </div>
        </Form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-accent underline underline-offset-4 hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
