import React from 'react'
import Hero from '@/Landing/Hero'
import About from '@/Landing/About'
import InfoSection from '@/Landing/Infosec'
import KeyFeatures from '@/Landing/Keyfeatures'
import HowItWorks from '@/Landing/Work'
import { Testimonials } from '@/Landing/Success'
import SkillBridgeForm from '@/Landing/Skillbridge'
import Footer from '@/Landing/footer'

function Trial() {
  return (
    <>
    <Hero/>
    <About/>
    <InfoSection/>
    <KeyFeatures/>
    <HowItWorks/>
    <Testimonials/>
    <SkillBridgeForm/>
    <Footer/>

    </>
  )
}

export default Trial