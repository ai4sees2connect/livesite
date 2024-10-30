import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faFile } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ student }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
console.log('this student is inside sidebarrrr',student);
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
          <div className="text-3xl lg:text-5xl  lg:py-10 z-20">
            <div className="relative w-fit mx-auto z-0">
              Transform Your Dream Job into Reality
              <div
                className={`absolute left-0 -z-10 lg:left-0 -bottom-4 md:-bottom-3 lg:-bottom-2  h-[6px] lg:h-[8px] bg-orange-400 rounded-xl  animate-grow-width-lg
                  `}
              ></div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold p-3 mt-5 relative w-full capitalize">
              Hi, {student?.firstname}!
              
            </h1>
            <div className="text-xl lg:text-3xl px-3 w-fit mx-auto relative">
              Let’s help you land your dream career.....
              <div
                className={`absolute left-0  lg:left-0 md:-bottom-3 lg:-bottom-3  h-[6px] lg:h-[8px] bg-orange-500 rounded-xl   animate-grow-width-lg
                  `}
              ></div>
            </div>
          </div>

        )}
      </div>
      {/* Pending Assignment */}
      {/* Uncomment and implement your pending assignments here */}
    </div>
  );
};

export default Sidebar;
