'use client'

import React, {useState, useEffect} from "react";
import NavbarLanding from "@/components/landing/NavbarLanding";
import HeroLanding from "@/components/landing/HeroLanding";
import { FeatureLanding } from "@/components/landing/FeatureLanding";
import { FeaturePreviewLanding } from "@/components/landing/FeaturePreviewLanding";
import { FeedbackLanding } from "@/components/landing/FeedbackLanding";
import { FooterLanding } from "@/components/landing/FooterLanding";
import SignInForm from "@/components/global/SignInForm";
const LandingPage: React.FC = () => {
    const [isOpenSignIn, setIsOpenSign] = useState<boolean>(false)
    const handleToggleSignIn = () => setIsOpenSign(!isOpenSignIn)


    return (
        <div className="w-full bg-cover h-screen bg-[url('/img/bg-white.jpg')] scroll-smooth">
            <NavbarLanding openLogin={handleToggleSignIn}/>
            <HeroLanding openLogin={handleToggleSignIn}/>
            <FeatureLanding />
            <FeaturePreviewLanding />
            <FeedbackLanding />
            <FooterLanding />
             <SignInForm isOpen={isOpenSignIn} closeForm={handleToggleSignIn}/>

        </div>
    )
}


export default LandingPage