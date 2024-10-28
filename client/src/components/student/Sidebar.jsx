import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faFile } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ student }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyLargeScreen = window.innerWidth >= 770;
      setIsLargeScreen(isCurrentlyLargeScreen);
      console.log("Screen size changed:", isCurrentlyLargeScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pt-10 px-8 bg-[#f0fbff]">
      {/* Header */}
      <div className="py-12">
        {!student ? (
          <div className="text-3xl lg:text-5xl py-10">
            <h2 className="relative">
              Transform Your <span>Dream Job</span> into Reality
              <span
                className={`absolute left-[44%] md:-bottom-3 lg:-bottom-5 md:h-[6px] lg:h-[8px] bg-orange-500 rounded-xl ${
                  isLargeScreen ? "animate-grow-lg" : "animate-grow-md"
                }`}
              ></span>
            </h2>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold p-3 mt-5">
              Hi, {student?.firstname}!
            </h1>
            <h1 className="text-xl px-3">
              Let’s help you land your dream career.....
            </h1>
          </div>
        )}
      </div>
      {/* Pending Assignment */}
      {/* Uncomment and implement your pending assignments here */}
    </div>
  );
};

export default Sidebar;
