import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimateOnScroll from '@/components/common/AnimateOnScroll';

import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import GoalBased from '@/components/home/GoalBased';
import ExpensiveProject from '@/components/home/ExpensiveProject';
import ProjectOfTheMonth from '@/components/home/ProjectOfTheMonth';
import WhyUs from '@/components/home/WhyUs';
import Partners from '@/components/home/Partners';
import Testimonials from '@/components/home/Testimonials';
import ExploreLocation from "@/components/home/ExploreLocation";
import ProjectOfTheWeek from '@/components/home/ProjectOfTheWeek';
import ZeroBrokerage from '@/components/home/ZeroBrokerage';
import NewsLetter from '@/components/home/NewsLetter';
import FounderTalk from '@/components/home/FounderTalk';
import OtherLocation from '@/components/home/OtherLocation';

const Page = () => {

  return (
    <>
      <Navbar />

      <HeroSection />

      <AnimateOnScroll variant="up">
        <ProjectOfTheWeek />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <FeaturedProperties />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up" delay="delay-100">
        <ExpensiveProject />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <ZeroBrokerage />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <ExploreLocation />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <ProjectOfTheMonth />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <GoalBased />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <OtherLocation />
      </AnimateOnScroll>

      <AnimateOnScroll variant="scale">
        <Partners />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <Testimonials />
      </AnimateOnScroll>

       <AnimateOnScroll variant="left">
        <WhyUs />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <NewsLetter />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <FounderTalk />
      </AnimateOnScroll>

      <AnimateOnScroll variant="up">
        <Footer />
      </AnimateOnScroll>
    </>
  );
};

export default Page;
