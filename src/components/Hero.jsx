import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  //now here, we will set this handleVideoSrcSet to the useEffect

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet);

    //actually, in react it is very important to clear ur event Listener that u hve created, so here i am returning a function in which i am calling the removeEventListener

    return () => {
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  // here "[]", this is an empty dependency array used in useEffect

  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 2 });
    gsap.to("#cta", { opacity: 1, delay: 2, y: -50 });
    // here y:-50 means, i want to scale up a little bit buy button, when it appear on screen
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h=5/6 w-full flex-center flex-col">
        {/* here flex-center is not property of tailwind */}
        <p id="hero" className="hero-title">
          iPhone 15 pro
        </p>
        <div className="mid:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            loop
            key={videoSrc}
          >
            {/* i used loop, so that video keep on playing, until user reach the end */}

            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl"> From $189/month 0r $1899</p>
      </div>
    </section>
  );
};

export default Hero;
