"use client";

import { useTranslations } from 'next-intl';
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@nextui-org/modal";
import { SignIn, createUser } from "@/service/apis";
import { RiFacebookLine, RiGoogleLine, RiMicrosoftLine } from "@remixicon/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface SignInFormProps {
  isOpen: boolean;
  closeForm: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ isOpen, closeForm}) => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [userNameSignIn, setUserNameSignIn] = useState<string>("");
  const [passwordSignIn, setPasswordSignIn] = useState<string>("");
  const [errorSignIn, setErrorSignIn] = useState<string>("");
  const [isLoadingSignin, setIsLoadingSignIn] = useState<boolean>(false);
  const [isVisibleSignIn, setIsVisibleSignIn] = useState<boolean>(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const t = useTranslations('SigninForm');

  const toggleVisibility = () => setIsVisibleSignIn(!isVisibleSignIn)


  const handleToggleSuccess = () => setIsOpenSuccess(!isOpenSuccess)

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoadingSignIn(true);
    e.preventDefault();
    try {
      const data = await SignIn(userNameSignIn, passwordSignIn);

      if(data !== undefined) {
        localStorage.setItem("access_token", data?.data.access_token);
        localStorage.setItem("user_id", data?.data.user_id)
        setIsLoadingSignIn(false);
        router.push("/home");
      }
    } catch (e: any) {
      setIsLoadingSignIn(false);
      console.log(e);
      if(e.response !== undefined) {
        setErrorSignIn(e.response.data?.msg);
      }
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!validateEmail(formData.email)) newErrors.email = "Email is invalid";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSignIn(true);
    
    if (!validateForm()) {
      setIsLoadingSignIn(false);
      return
    };

    try {
      const data = await createUser(
        formData.username,
        formData.password,
        formData.email,
        formData.firstName,
        formData.lastName,
      );

      handleToggleSuccess()
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });

    } catch (error: any) {
      console.error("Error registering:", error);
      const errorMessage = error.response?.data?.msg || "An unexpected error occurred";
    
      setErrors((prev) => ({
        ...prev,
        username: errorMessage, 
      }));
    
    }
    
    setIsLoadingSignIn(false);
  };

  // Hàm cập nhật giá trị khi thay đổi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    console.log(id)
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "", 
    }));
  };

  return (
    <div
      className={`z-50 transition-all w-full h-screen fixed top-0 left-0 flex justify-center items-center box-border bg-black bg-opacity-55 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onMouseDown={closeForm}
    >
      <div
        className={`transition-all max-w-5xl w-4/5 grid grid-cols-2 h-fit items-stretch`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className=" rounded-l-3xl flex-1 h-full p-10 bg-gray-200 dark:text-white dark:bg-zinc-700 flex-col md:block hidden">
          <div className="text-2xl font-bold">{t('Welcome!')}</div>
          <div className="w-full h-[90%] flex-grow flex justify-center items-center">
            <div className="w-2/4 h-2/4 flex items-center justify-center">
              <span className="text-7xl font-bold">Viet.</span>
            </div>
          </div>
          <div>
            {isSignIn ? t('Not a member yet?') : t('Already have an account?')}
            <button
              className="text-blue-500 hover:underline"
              onClick={toggleSignIn}
            >
              {isSignIn ? t('Register now') : t('Sign in')}
            </button>
          </div>
      </div>

      <div className="rounded-r-3xl md:rounded-l-none dark:bg-zinc-800 flex items-center justify-center flex-1 h-full p-10 bg-white overflow-y-auto rounded-l-3xl">
          {isSignIn ? (
            <div className="flex justify-center w-full items-center h-full overflow-auto">
              <div className="w-full h-full">
                <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-6">
                {t('Log in')}
                </h2>
                <form className="space-y-4" onSubmit={handleSignIn}>
                  <div>
                    <Input
                    variant="underlined"
                      id="email"
                      className="dark:text-gray-700 mb-7 "
                      label="Your username"
                      errorMessage={errorSignIn}
                      isInvalid={errorSignIn === "" ? false : true}
                      onChange={(e) => {
                        setUserNameSignIn(e.target.value);
                        setErrorSignIn("");
                      }}
                    />
                  
                  </div>
                  <div>
                    <Input
                    variant="underlined"
                      errorMessage={errorSignIn}
                      id="password"
                      label="Your password"
                      isInvalid={errorSignIn === "" ? false : true}
                      type={isVisibleSignIn ? "text" : "password"}
                      onChange={(e) => setPasswordSignIn(e.target.value)}
                      endContent={
                        <button className="focus:outline-none w-4 h-4" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                          {isVisibleSignIn ? (
                            <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  <div className="flex dark:text-white items-center space-x-2 mb-6">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                  </div>
                  <Button
                    className="w-full"
                    color="default"
                    disabled={isLoadingSignin}
                    type="submit"
                    isLoading={isLoadingSignin}
                  >
                    {isLoadingSignin ? t('LoggingIn') : t('Log in')}
                  </Button>
                </form>
                <div className="text-sm text-right mt-4">
                  <span className="text-blue-500 hover:underline">
                  {t('Forgot your password?')}
                  </span>
                </div>
                <div className="text-center text-gray-500 my-4 dark:text-white">
                {t('Or sign in with')}
                </div>
                <div className="flex space-x-3 ">
                  <Button startContent={<RiFacebookLine size={18}/>} className="flex-1 text-gray-500 dark:hover:text-white hover:text-black" color="default" variant="ghost">
                    
                    Facebook
                  </Button>
                  <Button startContent={<RiGoogleLine size={18}/>} className="flex-1 text-gray-500 dark:hover:text-white hover:text-black" color="default" variant="ghost">
                    Google
                  </Button>
                  <Button startContent={<RiMicrosoftLine size={18}/>} className="flex-1 text-gray-500 dark:hover:text-white hover:text-black" color="default" variant="ghost">
                    Microsoft
                  </Button>
                </div>
                <div className="w-full mt-8">
                <button
                  className="hover:underline w-full text-center text-sm opacity-70"
                  onClick={toggleSignIn}
                >
                  {isSignIn ? t('Not a member') : t('Sign in')}
                </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full mx-auto">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-6">
              {t('RegisterTitle')}
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                    errorMessage={errors.firstName}
                    isInvalid={!!errors.firstName?.trim()}
                    variant="underlined"
                      id="firstName"
                      label="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Input
                     errorMessage={errors.lastName}
                     isInvalid={!!errors.lastName?.trim()}
                    variant="underlined"
                      id="lastName"
                      label="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Input
                   errorMessage={errors.username}
                   isInvalid={!!errors.username?.trim()}
                  variant="underlined"
                    id="username"
                    label="Your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Input
                  errorMessage={errors.email}
                  isInvalid={!!errors.email?.trim()}
                  variant="underlined"
                    id="email"
                    label="Your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                    errorMessage={errors.password}
                    isInvalid={!!errors.password?.trim()}
                    variant="underlined"
                      id="password"
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                  
                    <Input
                    errorMessage={errors.confirmPassword}
                    isInvalid={!!errors.confirmPassword?.trim()}
                    variant="underlined"
                      id="confirmPassword"
                      label="Repeat password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />

                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.termsAccepted}
                    id="terms"
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        termsAccepted: checked === true,
                      }));
                    }}
                  />
                  <Label className="text-sm dark:text-white" htmlFor="terms">
                    {t('AgreeWithTerm')}{" "}
                    <span className="text-blue-500 hover:underline" >
                      {t('TermAndConditions')}
                    </span>
                  </Label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-sm">
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full"
                  disabled={isLoadingSignin}
                  isLoading={isLoadingSignin}
                  type="submit"
                >
                  {isLoadingSignin ? t('CreatingAccount') : t('CreateAccount')}
                </Button>
              </form>
              <div className="text-center text-gray-500 my-4 dark:text-white">
                {t('OrRegisterWith')}
              </div>
              <div className="flex space-x-3 ">
                  <Button startContent={<RiFacebookLine size={18}/>} className="flex-1 text-gray-500 hover:text-white" color="default" variant="ghost">
                    Facebook
                  </Button>
                  <Button startContent={<RiGoogleLine size={18}/>} className="flex-1 text-gray-500 hover:text-white" color="default" variant="ghost">
                    Google
                  </Button>
                  <Button startContent={<RiMicrosoftLine size={18}/>} className="flex-1 text-gray-500 hover:text-white" color="default" variant="ghost">
                    Microsoft
                  </Button>
                </div>
                <button
                  className="hover:underline w-full text-center text-sm opacity-70 mt-4"
                  onClick={toggleSignIn}
                >
                  {isSignIn ? t('Not a member') : t('AskForLogin')}
                </button>
            </div>
          )}
        </div>
      </div>

      <Modal backdrop="blur" isOpen={isOpenSuccess} onClose={handleToggleSuccess}>
        <ModalContent>
          {(handleToggleSuccess) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Register Successfully!</ModalHeader>
              <ModalBody>
                <p> 
                Your account has been successfully created. Please return to the login page to access our services.
                </p>
                
              </ModalBody>
              <ModalFooter>
               
                <Button color="default" onPress={() => {
                toggleSignIn()
                handleToggleSuccess()
                }}>
                  Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SignInForm;
