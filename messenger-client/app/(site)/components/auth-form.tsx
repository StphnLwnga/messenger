"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useTheme } from "next-themes"
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react'
import { LiaSpinnerSolid } from "react-icons/lia";

import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { AuthSocialButton } from './auth-social-button';
import { Loading } from '@/components/ui/loading';
import { CREATE_USER_FROM_CREDENTIALS } from '@/graphql/mutations';

type Variant = 'LOGIN' | 'REGISTER';

/**
 * Renders the authentication form component.
 *
 * @return {JSX.Element} The rendered authentication form component.
 */
export default function AuthForm(): JSX.Element {
  const session = useSession();
  const router = useRouter();

  const { resolvedTheme } = useTheme();

  const { toast } = useToast();

  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    console.log(session)
    if (session?.status === 'authenticated') {
      toast({
        title: 'Logged in!',
        variant: 'default',
        className: `${resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-500 text-gray-100'} border-0 border-gray-200`,
      });
      router.push('/users');
    }
  }, [session?.status, router]);

  /**
   * Toggles the variant between 'LOGIN' and 'REGISTER'.
   *
   * This function clears any errors, resets the form, and updates the variant state.
   * It checks the current variant and sets it to the opposite value.
   *
   * @return {void} This function does not return a value.
   */
  const toggleVariant = () => {
    clearErrors();
    reset();
    setVariant((currentVariant: Variant) => currentVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  };

  const {
    register,
    handleSubmit,
    formState: { errors, },
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  /**
   * Handles the form submission for login or registration.
   *
   * @param {FieldValues} data - The form data containing name, email, and password.
   * @return {Promise<void>} A promise that resolves when the submission is complete.
   */
  const onSubmit: SubmitHandler<FieldValues> = async (data): Promise<void> => {
    setIsLoading(true);
    setIsSubmitted(false);
    const { name, email, password } = data;

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      }).then(callback => {
        // console.log(callback)
        if (callback?.error) {
          toast({
            title: 'Login failed',
            variant: 'destructive',
            action: (
              <ToastAction
                onClick={() => setIsSubmitted(true)}
                altText="Failed login"
              >
                Clear Form
              </ToastAction>
            ),
          });
          router.push('/users');
        }
        if (callback?.ok && !callback?.error) {
          toast({
            title: 'Logged in!',
            variant: 'default',
            className: `${resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-500 text-gray-100'} border-0 border-gray-200`,
          });
        }
        setIsSubmitted(true);
        return;
      }).finally(() => { setIsLoading(false); return });
    } else {
      try {
        const res = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
          query: CREATE_USER_FROM_CREDENTIALS,
          variables: {
            createUserInput: { name, email, password, }
          },
        }, {
          headers: { 'Content-Type': 'application/json', }
        });

        // console.log(res)
        const { user, code, message } = res.data?.data?.createUserFromCredentials;
        if (code !== 200 && message.includes("email")) throw new Error(`Email already exists`);
        if (code !== 200) throw new Error(`Registration failed`);
        setIsSubmitted(true);
        await signIn('credentials', {
          email,
          password,
        });
      } catch (error: any) {
        console.log(error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
          action: (
            <ToastAction
              onClick={() => setIsSubmitted(true)}
              altText={error.message}
            >
              Clear Form
            </ToastAction>
          ),
        });
      } finally {
        setIsLoading(false);
        return;
      }
    }
  }

  /**
   * Executes a social action by signing in with the specified action.
   *
   * @param {string} action - The action to be performed.
   * @return {Promise<void>} A promise that resolves when the action is completed.
   */
  const socialAction = async (action: string): Promise<void> => {
    setIsLoading(true);
    setIsSubmitted(false);
    try {
      const resp = await signIn(action, { redirect: false })
      if (resp?.error) throw new Error('Invalid credentials');
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  }

  useEffect(() => {
    isSubmitted && reset();
  }, [isSubmitted]);

  switch (true) {
    case session?.status === 'loading' || session?.status === 'authenticated':
      return (
        <div className='flex w-full items-center justify-center align-middle fixed pr-[4%]'>
          <Loading resolvedTheme={resolvedTheme} size={188} />
        </div>
      );

    default:
      return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className={cn(
            "px-4 py-8 shadow shadow-gray-400 bg-white sm:rounded-lg sm:px-10",
            resolvedTheme === 'dark' && "shadow-gray-500 bg-gray-800",
          )}>
            <form
              className='space-y-6'
              onSubmit={handleSubmit(onSubmit)}
            >
              {variant === 'REGISTER' && (
                <Input
                  disabled={isLoading}
                  id="name"
                  type="text"
                  label='Name'
                  required
                  placeholder='George Jetson'
                  register={register}
                  errors={errors}
                />
              )}
              <Input
                disabled={isLoading}
                id="email"
                type="email"
                label='Email'
                required
                placeholder='spaced@example.com'
                register={register}
                errors={errors}
              />
              <Input
                disabled={isLoading}
                id="password"
                type="password"
                label="Password"
                required
                placeholder='********'
                register={register}
                errors={errors}
              />
              <div className='pt-4'>
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="secondary"
                  fullWidth
                  className={cn(
                    'signin text-gray-100 text-md',
                  )}
                >
                  {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={cn(
                      "w-full border-t border-gray-300",
                      resolvedTheme === 'dark' && "border-gray-500",
                    )}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={cn(
                    "px-2",
                    "bg-white text-gray-500",
                    resolvedTheme === 'dark' && "bg-gray-800 text-gray-300",
                  )}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                <AuthSocialButton icon={FcGoogle} onClick={() => socialAction('google')} />
              </div>

              <div className={cn(
                "flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500",
                resolvedTheme === 'dark' && "text-gray-300",
              )}>
                <div className="font-bold">
                  {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                </div>
                <div
                  onClick={toggleVariant}
                  className="underline cursor-pointer"
                >
                  {variant === 'LOGIN' ? 'Create an account' : 'Login to your account'}
                </div>
              </div>

            </div>
          </div>
        </div>
      );
  }
}