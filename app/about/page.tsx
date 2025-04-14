import Image from "next/image";
import { Divider } from "@heroui/divider";

import mainAbout from "../../public/assets/main-about.svg";
import aboutSearch from "../../public/assets/about-search.svg";
import aboutGive from "../../public/assets/about-give.svg";
import revitLogo from "../../public/assets/revit-logo.svg";

import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="md:px-36">
      <div className="flex md:flex-row flex-col md:justify-between items-center text-center md:text-left">
        <div className="md:basis-1/2">
          <h1 className={`${title({ size: "xl", color: "blue" })}`}>
            Change the way you{" "}
            <span className={`${title({ size: "xl", color: "yellow" })}`}>
              {" "}
              SEARCH{" "}
            </span>
            or{" "}
            <span className={`${title({ size: "xl", color: "pink" })}`}>
              GIVE
            </span>{" "}
            reviews
          </h1>
        </div>
        <Image
          priority
          alt="main about"
          className=" my-10 md:py-0"
          height={450}
          src={mainAbout}
        />
      </div>
      <div className="flex flex-row items-center justify-center md:py-20 py-10">
        <div className="basis-2/3">
          <Divider />
        </div>
        <div className="px-10">
          <Image priority alt="logo" height={100} src={revitLogo} />
        </div>
        <div className="basis-2/3">
          <Divider />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center text-center md:text-justify pt-10">
        <div className="hidden md:flex">
          <Image
            priority
            alt="main about"
            className="md:h-full h-20"
            height={350}
            src={aboutSearch}
          />
        </div>
        <div className="md:basis-1/2">
          <p
            className={`${title({ className: "font-extrabold", color: "yellow" })}`}
          >
            SEARCH
          </p>
          <p className="md:text-lg text-small md:pt-10 pt-5">
            No more struggling to scroll through pages to find reviews for what
            you like on google. Search on revit to find reviews about anything
            you like, posted by genuine people. Finding reviews could not be
            more simpler.
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center pt-10 text-center md:text-justify">
        <div className="md:basis-1/2">
          <p
            className={`${title({ className: "font-extrabold", color: "pink" })}`}
          >
            GIVE
          </p>
          <p className="md:text-lg text-small md:pt-10 pt-5">
            Are you a wanna be critique or you genuinly care and review things.
            Post what you feel about whatever you want to give feedback for, be
            it news/people/service etc. the possibilites are endless. Giving
            reviews could not have been more easy.
          </p>
        </div>
        <div className="hidden md:flex">
          <Image
            priority
            alt="about give"
            className="md:h-full h-28"
            height={350}
            src={aboutGive}
          />
        </div>
      </div>
    </div>
  );
}
