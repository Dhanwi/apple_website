import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoDivRef = useRef([]);
  const videoSpanRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPLaying: false,
    // this useState have initial value all these, initially videoId is 0 and everything is false right now, it will change according to jb video play hogi
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPLaying } = video;
  // here above we r actually destructuring the array value of useState jo upar declare kiya h, mtlb, ki instead of writing all these element/property each time like isPlay .... we simply write video

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPLaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPLaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPLaying, loadedData]);

  // in the handleLoadedMetaData, we are passing the index and the event
  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      //animate the progress of video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          // here .progress() in gsap is itself a function, which keep the track of progress

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });
            // Note: videoDivRef jo h wo jo chote 4 dots h, below jha video scroll ho rhi h, play and pause button ke pass, unhe represent kr rha

            // here 760 = window inner width for phone
            //  1200 = for tab
            // rest for window, laptop....

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // note: the videoSpanRef, and span is associated with the timimg of those dots near play and pause button , ki wo tb tk open rhe jb tk ki video chl rhi h

        onComplete: () => {
          if (isPLaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
            // ye gsap.to jo span me lgi h means ki agr video is in playing mode to tb tk jo dot h, wo jo expand krega 12 px tk, uske background me ye afafaf wali color animate honi chahiye slowly through the span of video, mtlb jb tk video chlegi
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };
      if (isPLaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
      // here .ticker in gsap is used to track the progress
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        // hre pre means previous video, & ...pre means, ki hm previousVideo wali array ko scatter kr rhe h and usme add kr rhe new value, jo puri new array ab setVideo ki value bn jayegi
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPLaying: !pre.isPLaying }));
        // here, isPLaying: !pre.isPLaying this means ki isPlaying is opposite of pre isPlaying. mtlb for video to play (bcz case play h), hmare isPlaying ki value opposti hogi, previous video ke isplaying se, that is, pre k isplaying false hoga to ye true hogi or agr previous video ki isplaying true hogi then ye video hmari play nhi hogi and iski value false hogi
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPLaying: !pre.isPLaying }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  // preload="auto", earlier it was set auto and because of that when we refresh the page that video start playing even before we can go to that particular viewport,or viewpage. that's why now, i set it to none and then added autoPlay also.
                  // preload="none"
                  // autoPlay
                  // back to the same, because getting error in loading
                  preload="auto"
                  muted
                  className={`${list.id === 2 && "translate-x-44"}
                  pointer-events-none`}
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  // here actually, onEnded event listener we are calling, to keep track of which video is ending, so that the dots there expand accordingly, so for that here we are checking if the index i is not equal to 3 that means if it is not the last video then we will call the handler function, handleProcess for case 'video-end' (we can go there and check that this case simply, we r setting isEnd: true and  index is increased by one, so we move to the next video as well as the next dot will expand) otherwise we are calling handle process for 'video-last' where the video will replay.

                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPLaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* now, making the video scroller button type, to play pause or restart the video. this is the 2nd section, hero section ke baad wali just, usme jidhar video scroll ho rhi from right to left. */}

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
              {/* here, we are passing a reference, el is element, so we are calling a callback function, for each element el and updating the array videoSpanRef.current[i], giving value el, similarly upper wali span me bhi yhi kr rhe */}
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPLaying ? playImg : pauseImg}
            // ye jo line likhi h uper, that means, if ye last video h then replay wali Image lga do (button ki baat kr rhe hm yha), or agr, video play nhi ho rhi to play hone wali image lgani h, otherwise agr video play ho rkhi h to pause wali image lgani h.  aage bhi sare aise hi h concept.
            alt={isLastVideo ? "replay" : !isPLaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPLaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
