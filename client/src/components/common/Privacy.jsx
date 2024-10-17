import React, {useEffect} from 'react';
import findUser from '../common/UserDetection.js'
import { useNavigate } from 'react-router-dom';

const Privacy = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const handleUserNavigate=async()=>{
    const {userType,userId}=await findUser();
    console.log(userType)
    if(userType==='student'){
      navigate(`/student/dashboard/${userId}`)
      return;
    }

    if(userType==='recruiter'){
      navigate(`/recruiter/dashboard/${userId}`)
      return;
    }
  }

  return (
    <>
     <nav className="w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          <button onClick={handleUserNavigate} className='text-xl font-bold text-gray-700'>Home</button>
          <button className="text-xl font-bold text-blue-600 ">Privacy Policy</button>
        </div>
      </nav>
    
    <div className="max-w-6xl mx-auto p-6 bg-white text-justify text-gray-800 mt-2">
      

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Internsnest is committed to protecting the privacy of its users and ensuring the confidentiality of personal data collected through our platform. This Privacy Policy outlines how we collect, use, share, and protect your personal information in compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act (DPDP), 2023.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
      <p className="mb-2">We collect various types of information to provide and improve our services. This includes:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Personal Information: When you register for an account, apply in internships, or contact us, we collect personal details such as your name, email address, contact information, and payment details.</li>
        <li>Usage Data: We automatically collect information about how you use the platform, including IP addresses, browser types, device information, and interactions with course materials.</li>
        <li>Course Data: We track your progress, quiz results, and interactions with AI-powered tools to offer personalized learning experiences and course recommendations.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Providing Services: To deliver courses, manage accounts, and provide customer support.</li>
        <li>Personalization: To offer tailored course recommendations, AI-based feedback, and personalized learning experiences.</li>
        <li>Communication: To send you important updates, course-related notifications, and marketing communications, provided you have opted in.</li>
        <li>Platform Improvement: To analyze user behavior, enhance our services, and develop new features based on feedback and usage data.</li>
        <li>Payment Processing: To handle enrollment fees and process payments securely through third-party providers.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Sharing Your Information</h2>
      <p className="mb-2">We do not sell or rent your personal data to third parties. However, we may share your information with:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Service Providers: Third-party vendors who assist with services such as payment processing, website hosting, data analytics, and marketing. These providers are contractually obligated to protect your information.</li>
        <li>Legal Compliance: We may disclose your information to comply with legal obligations, court orders, or government requests under Indian law, including law enforcement or public authorities for the purposes of national security or legal enforcement.</li>
        <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new owners.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Your Rights Under Indian Law</h2>
      <p className="mb-2">Under the Digital Personal Data Protection Act (DPDP), 2023, you have the following rights:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Right to Access: You can request access to the personal data we hold about you and receive information on how your data is processed.</li>
        <li>Right to Correction: You have the right to request corrections or updates to any inaccurate or incomplete personal data we hold.</li>
        <li>Right to Erasure: You may request the deletion of your personal data under certain circumstances, such as when the data is no longer necessary for the purpose it was collected, or if you withdraw your consent.</li>
        <li>Right to Data Portability: You can request a copy of your personal data in a commonly used, machine-readable format.</li>
        <li>Right to Withdraw Consent: If the processing of your personal data is based on your consent, you have the right to withdraw your consent at any time.</li>
        <li>Right to Grievance Redressal: You have the right to lodge a grievance or complaint if you believe your rights have been violated under the DPDP Act.</li>
      </ul>

      <p className="mb-4">To exercise any of these rights, please contact us at <a href="mailto:connect@ai4sees.com" className="text-blue-500">connect@ai4sees.com</a>. We may verify your identity before processing your request.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Data Security</h2>
      <p className="mb-4">
        We take appropriate measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our security practices include encryption, access control, and regular security audits.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Data Retention</h2>
      <p className="mb-4">
        We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including compliance with legal obligations, resolving disputes, and enforcing our agreements.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Cookies and Tracking Technologies</h2>
      <p className="mb-4">
        We use cookies and similar tracking technologies to enhance your experience on our platform. You can control the use of cookies through your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">8. Cross-border Data Transfers</h2>
      <p className="mb-4">
        In some cases, your personal data may be transferred to and processed in countries outside of India. We ensure that your data is protected in accordance with this Privacy Policy and applicable data protection laws.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">9. Third-Party Links</h2>
      <p className="mb-4">
        Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review the privacy policies of third-party websites before providing your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">10. Children’s Privacy</h2>
      <p className="mb-4">
        Our services are not intended for children under 13. If we become aware that we have collected personal data from a child, we will take steps to delete that information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">11. Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">12. Grievance Redressal Mechanism</h2>
      <p className="mb-4">
        If you have any questions, concerns, or complaints, contact our Grievance Redressal Officer at <a href="mailto:connect@ai4sees.com" className="text-blue-500">connect@ai4sees.com</a> or by phone at 8867583329. Address: 9th Main Road, Vysya Bank Colony, New Gurappana Palya, 1st Stage, BTM Layout, Bengaluru, Karnataka.
      </p>
    </div>
    </>
  );
};

export default Privacy;
