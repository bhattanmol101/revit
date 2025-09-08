"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <>
      <section className="overflow-hidden py-35 pb-20 md:pt-40 xl:py-50 xl:pb-20">
        <div className="max-w-c-1390 mx-auto px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5 text-center md:text-left">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                },

                visible: {
                  opacity: 1,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <span className="bg-gradient-to-r from-[#FF705B] to-[#FFB457] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Review&nbsp;
              </span>
              <span className="bg-gradient-to-r from-[#FF72E1] to-[#F54C7A] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                Everything
              </span>
              <div className="mt-10 text-sm md:text-base">
                <p>
                  Revit - An all in one place for reviews. Find ratings, reviews
                  for what you need. Provide reviews for things you like and did
                  not like. Create review forums and find people with similar
                  interest to share reviews.
                </p>
                <p className="mt-2">
                  Grow your business with revit by getting accurate feedback and
                  handle all the reviews in one place.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                },

                visible: {
                  opacity: 1,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="animate_right hidden md:w-1/2 lg:block"
            >
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute top-0 -left-11.5"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute right-0 bottom-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className="relative aspect-700/444 w-full">
                  <Image
                    className="shadow-solid-l dark:hidden"
                    src="/images/hero/hero-light.svg"
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="shadow-solid-l hidden dark:block"
                    src="/images/hero/hero-dark.svg"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
