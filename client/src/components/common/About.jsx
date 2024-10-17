import React, {useEffect} from 'react';
import about_img from '../../images/about_image.jpeg';

const About = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-cyan-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          <h1 className='text-xl font-bold text-gray-700'>Home</h1>
          <h1 className="text-xl font-bold text-blue-600 ">About Us</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-2">
        {/* Image Section */}
        <div className='w-full'>
          <img src={about_img} alt="About" className='w-full max-h-[460px] object-cover'/>
        </div>

        {/* Vision Section */}
        <div className="bg-cyan-50 p-8 max-w-3xl text-justify">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6 tracking-widest">
            Vision
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Internsnest is a technology-driven platform with a mission to bridge the gap between education and practical experience. We aim to empower students with real-world skills, hands-on opportunities, and the confidence to pursue fulfilling careers.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We envision a world where every student can discover their passion, gain meaningful experience, and seamlessly transition from learning to professional success. At Internsnest, we are committed to helping students unlock their potential and shape their futures with purpose and confidence.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 w-full max-w-2xl">
          {/* Internships Card */}
          <div className="bg-white border shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Internships</h2>
            <p className="text-gray-700">
              Explore a wide range of internships designed to provide you with hands-on experience and help you develop the skills needed to succeed in your career.
            </p>
          </div>

          {/* Jobs Card */}
          <div className="bg-white border shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Jobs</h2>
            <p className="text-gray-700">
              Discover job opportunities that align with your interests and career goals, and take the next step towards achieving professional success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
