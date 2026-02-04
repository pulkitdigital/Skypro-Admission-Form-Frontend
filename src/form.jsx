// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//   const initialState = {
//     fullName: "",
//     dob: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     permanentAddress: "",
//     currentAddress: "",
//     dgca: "",
//     egca: "",
//     medical: "",
//     parentName: "",
//     relationship: "",
//     parentMobile: "",
//     occupation: "",
//     school: "",
//     classYear: "",
//     board: "",
//     course: "",
//     modeOfClass: "",
//     feesPaid: "",
//     paymentMode: "",
//     installment: "",
//   };

//   const [form, setForm] = useState(initialState);
//   const [files, setFiles] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [fileErrors, setFileErrors] = useState({});
//   const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
//   const [sameAddress, setSameAddress] = useState(false);
//   const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

//   // IMPORTANT: Replace with your actual reCAPTCHA Site Key
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Replace with your key
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Load reCAPTCHA script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://www.google.com/recaptcha/api.js"; 
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setRecaptchaLoaded(true);
//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   const paymentOptions = [
//     { value: "", label: "Select Payment Mode" },
//     { value: "Cash", label: "Cash" },
//     { value: "UPI", label: "UPI" },
//     { value: "Net Banking", label: "Net Banking" },
//     { value: "Cheque", label: "Cheque" },
//   ];

//   const medicalOptions = [
//     { value: "", label: "Select Medical Status" },
//     { value: "Medical Class 1", label: "Medical Class 1" },
//     { value: "Medical Class 2", label: "Medical Class 2" },
//     { value: "N/A", label: "N/A" },
//   ];

//   const courseOptions = [
//     { value: "", label: "Select Course" },
//     { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
//     { value: "ATPL Theory Training", label: "ATPL Theory Training" },
//     { value: "CPL Flying Training", label: "CPL Flying Training" },
//     { value: "Assistant Flight Instructor Rating", label: "Assistant Flight Instructor Rating" },
//     { value: "Type Rating Courses", label: "Type Rating Courses" },
//     { value: "Airline Preparatory Training", label: "Airline Preparatory Training" },
//     { value: "ADAPT Training", label: "ADAPT Training" },
//     { value: "Drone Pilot License Training", label: "Drone Pilot License Training" },
//     { value: "Cabin Crew Training", label: "Cabin Crew Training" },
//     { value: "Airport Agent Diploma Training", label: "Airport Agent Diploma Training" },
//     { value: "Mentorship Programme", label: "Mentorship Programme" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     if (name === "permanentAddress" && sameAddress) {
//       setForm((prev) => ({ ...prev, currentAddress: value }));
//     }
//   };

//   const handleSameAddressChange = (e) => {
//     const checked = e.target.checked;
//     setSameAddress(checked);

//     if (checked) {
//       setForm((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
//     }
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const fieldName = e.target.name;

//     setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));

//     if (file) {
//       const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

//       if (!validTypes.includes(file.type)) {
//         const errorMsg = `Only PNG, JPEG, and PDF files are allowed for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 2 * 1024 * 1024;
//       if (file.size > maxSize) {
//         const errorMsg = `File size must be less than 2MB for ${fieldName}`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         setStatus(`❌ ${errorMsg}`);
//         e.target.value = "";
//         return;
//       }

//       setFiles({ ...files, [fieldName]: file });
//       setStatus("");
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!disclaimerAccepted) {
//       setStatus("❌ Please accept the disclaimer to proceed");
//       return;
//     }

//     // Get reCAPTCHA token
//     const token = window.grecaptcha?.getResponse();

//     if (!token) {
//       setStatus("❌ Please complete the reCAPTCHA verification");
//       return;
//     }

//     setLoading(true);
//     setStatus("");

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));
//      formData.append("recaptchaToken", token);

//     try {
//       await Promise.all([
//         axios.post(`${API_URL}/api/submit`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         }),
//         delay(5000),
//       ]);

//       setStatus("✅ Form submitted successfully");
//       setForm(initialState);
//       setFiles({});
//       setFileErrors({});
//       setDisclaimerAccepted(false);
//       setSameAddress(false);
//       window.grecaptcha?.reset();
//       e.target.reset();
//     } catch (err) {
//       setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
//       window.grecaptcha?.reset();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-12">
//           <h2
//             className="text-3xl sm:text-5xl font-bold mb-2"
//             style={{ color: "black" }}
//           >
//             STUDENT ADMISSION FORM
//           </h2>
//           <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
//             SkyPro Aviation Academy
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
//         >
//           {status && (
//             <div
//               className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
//                 status.includes("successfully")
//                   ? "bg-green-100 text-green-800 border-2 border-green-200"
//                   : "bg-red-100 text-red-800 border-2 border-red-200"
//               }`}
//             >
//               {status}
//             </div>
//           )}

//           {/* 1. Student Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               1. Student Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="fullName"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Date of Birth<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="dob"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Gender<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Male"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Male
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Female
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="mobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Email Address<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Permanent Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="permanentAddress"
//                   value={form.permanentAddress}
//                   placeholder="Enter complete permanent address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="md:col-span-2 -mt-4 -mb-4">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={sameAddress}
//                     onChange={handleSameAddressChange}
//                     className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
//                   />
//                   <span className="text-gray-700 font-medium">
//                     Current address same as permanent address
//                   </span>
//                 </label>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Address<span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="currentAddress"
//                   value={form.currentAddress}
//                   placeholder="Enter complete current address"
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical"
//                   required
//                   onChange={handleChange}
//                   disabled={sameAddress}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   DGCA Computer Number
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     (Leave Blank if Not Applicable)
//                   </span>
//                 </label>
//                 <input
//                   name="dgca"
//                   placeholder="Enter DGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   eGCA Number
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     (Leave Blank if Not Applicable)
//                   </span>
//                 </label>
//                 <input
//                   name="egca"
//                   placeholder="Enter eGCA number"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Medical Status<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="medical"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {medicalOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </section>

//           {/* 2. Parent / Guardian Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               2. Parent/Guardian Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Parent/Guardian Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentName"
//                   type="text"
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Relationship<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="relationship"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     ))
//                   }
//                   placeholder="Father/Mother/Guardian"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentMobile"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Occupation<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="occupation"
//                   placeholder="Profession/Business"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     ))
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 3. Academic Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               3. Academic Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   School/College Name<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="school"
//                   placeholder="Institution name"
//                   type="text"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Educational Qualification
//                 </label>

//                 <select
//                   name="classYear"
//                   defaultValue=""
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                 >
//                   <option value="">— Please choose an option —</option>
//                   <option value="Class 10">Class 10</option>
//                   <option value="12th Appearing">12th Appearing</option>
//                   <option value="12th Passed">12th Passed</option>
//                   <option value="Graduation">Graduation</option>
//                   <option value="Post Graduation">Post Graduation</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Board/University<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="board"
//                   placeholder="CBSE/ICSE/State Board"
//                   type="text"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 4. Course Details */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               4. Course Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Course Applied For<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="course"
//                   className="w-[90%] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                   onChange={handleChange}
//                   required
//                 >
//                   {courseOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mode of Class
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="modeOfClass"
//                       value="Online Class"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Online Class
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="modeOfClass"
//                       value="Offline Class"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Offline Class
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 5. Fee Structure */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               5. Fee Structure
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Fees Paid<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="Yes"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="No"
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       required
//                       onChange={handleChange}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>

//               {form.feesPaid === "Yes" && (
//                 <>
//                   <div>
//                     <label className="block text-lg font-bold text-gray-700 mb-2">
//                       Installments<span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-6 mt-2">
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="installment"
//                           value="Yes"
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           required
//                           onChange={handleChange}
//                         />
//                         Yes
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="installment"
//                           value="No"
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           required
//                           onChange={handleChange}
//                         />
//                         No
//                       </label>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-lg font-bold text-gray-700 mb-2">
//                       Mode of Payment<span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="paymentMode"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
//                       onChange={handleChange}
//                       required
//                     >
//                       {paymentOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>
//           </section>

//           {/* 6. Documents Submitted */}
//           <section className="mb-12">
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               6. Documents Submitted
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               PNG, JPEG, and PDF formats are accepted (Max 2MB per file)
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[
//                 { name: "addressProof", label: "Address Proof" },
//                 { name: "photo", label: "Passport Size Photo" },
//                 { name: "marksheet10", label: "10th Marksheet" },
//                 { name: "marksheet12", label: "12th Marksheet" },
//                 { name: "aadhar", label: "Aadhaar Card" },
//               ].map((field) => (
//                 <div key={field.name}>
//                   <label className="block text-lg font-bold text-gray-700 mb-2">
//                     {field.label}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="file"
//                     name={field.name}
//                     accept="image/png, image/jpeg, image/jpg, application/pdf"
//                     className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
//                       fileErrors[field.name]
//                         ? "border-red-400 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                     required
//                     onChange={handleFile}
//                   />
//                   {fileErrors[field.name] && (
//                     <p className="text-red-600 text-sm mt-1">
//                       {fileErrors[field.name]}
//                     </p>
//                   )}
//                   {files[field.name] && !fileErrors[field.name] && (
//                     <p className="text-green-600 text-sm mt-1">
//                       ✓ {files[field.name].name}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Disclaimer */}
//           <section className="mb-8">
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 Declaration
//               </h3>
//               <label className="flex items-start">
//                 <input
//                   type="checkbox"
//                   checked={disclaimerAccepted}
//                   onChange={(e) => setDisclaimerAccepted(e.target.checked)}
//                   className="mt-1 mr-3 text-blue-500 focus:ring-blue-300"
//                   required
//                 />
//                 <span className="text-gray-800 font-medium">
//                   I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may result in the cancellation of my admission.
//                   <span className="text-red-500">*</span>
//                 </span>
//               </label>
//             </div>
//           </section>

//           {/* reCAPTCHA Section */}
//           <section className="mb-8">
//             <div className="flex justify-center">
//               <div className="g-recaptcha" data-sitekey={siteKey}></div>
//             </div>
//             {!recaptchaLoaded && (
//               <p className="text-center text-gray-500 text-sm mt-2">
//                 Loading security verification...
//               </p>
//             )}
//           </section>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || !disclaimerAccepted}
//             className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500"
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }































import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ThankYouPopup from "./ThankYouPopup";

export default function App() {
  const initialState = {
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    permanentAddress: "",
    currentAddress: "",
    dgca: "",
    egca: "",
    medical: "",
    parentName: "",
    relationship: "",
    parentMobile: "",
    occupation: "",
    school: "",
    classYear: "",
    board: "",
    course: "",
    modeOfClass: "",
    feesPaid: "",
    paymentMode: "",
    installment: "",
  };

  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileErrors, setFileErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Refs for each section
  const studentDetailsRef = useRef(null);
  const parentDetailsRef = useRef(null);
  const academicDetailsRef = useRef(null);
  const courseDetailsRef = useRef(null);
  const feeStructureRef = useRef(null);
  const documentsRef = useRef(null);
  const declarationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load reCAPTCHA script
  useEffect(() => {
    window.onRecaptchaVerify = () => {
      setRecaptchaVerified(true);
    };

    window.onRecaptchaExpired = () => {
      setRecaptchaVerified(false);
    };

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.onRecaptchaVerify;
      delete window.onRecaptchaExpired;
    };
  }, []);

  const paymentOptions = [
    { value: "", label: "Select Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "Cheque", label: "Cheque" },
  ];

  const medicalOptions = [
    { value: "", label: "Select Medical Status" },
    { value: "Medical Class 1", label: "Medical Class 1" },
    { value: "Medical Class 2", label: "Medical Class 2" },
    { value: "N/A", label: "N/A" },
  ];

  const courseOptions = [
    { value: "", label: "Select Course" },
    { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
    { value: "ATPL Theory Training", label: "ATPL Theory Training" },
    { value: "CPL Flying Training", label: "CPL Flying Training" },
    {
      value: "Assistant Flight Instructor Rating",
      label: "Assistant Flight Instructor Rating",
    },
    { value: "Type Rating Courses", label: "Type Rating Courses" },
    {
      value: "Airline Preparatory Training",
      label: "Airline Preparatory Training",
    },
    { value: "ADAPT Training", label: "ADAPT Training" },
    {
      value: "Drone Pilot License Training",
      label: "Drone Pilot License Training",
    },
    { value: "Cabin Crew Training", label: "Cabin Crew Training" },
    {
      value: "Airport Agent Diploma Training",
      label: "Airport Agent Diploma Training",
    },
    { value: "Mentorship Programme", label: "Mentorship Programme" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "permanentAddress" && sameAddress) {
      setForm((prev) => ({ ...prev, currentAddress: value }));
    }
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      setForm((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    if (file) {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];

      if (!validTypes.includes(file.type)) {
        const errorMsg = `Only PNG, JPEG, and PDF files are allowed`;
        setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
        e.target.value = "";
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        const errorMsg = `File size must be less than 2MB`;
        setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
        e.target.value = "";
        return;
      }

      setFiles({ ...files, [fieldName]: file });
      setStatus("");
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validateForm = () => {
    const errors = {};

    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    if (!form.gender) errors.gender = "Please select gender";
    if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (form.mobile.length !== 10)
      errors.mobile = "Mobile number must be 10 digits";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.permanentAddress.trim())
      errors.permanentAddress = "Permanent address is required";
    if (!form.currentAddress.trim())
      errors.currentAddress = "Current address is required";
    if (!form.medical) errors.medical = "Medical status is required";

    if (!form.parentName.trim())
      errors.parentName = "Parent/Guardian name is required";
    if (!form.relationship.trim()) errors.relationship = "Relationship is required";
    if (!form.parentMobile.trim())
      errors.parentMobile = "Parent mobile number is required";
    else if (form.parentMobile.length !== 10)
      errors.parentMobile = "Mobile number must be 10 digits";
    if (!form.occupation.trim()) errors.occupation = "Occupation is required";

    if (!form.school.trim()) errors.school = "School/College name is required";
    if (!form.board.trim()) errors.board = "Board/University is required";

    if (!form.course) errors.course = "Course selection is required";

    if (!form.feesPaid) errors.feesPaid = "Please select fees paid status";
    if (form.feesPaid === "Yes") {
      if (!form.installment)
        errors.installment = "Please select installment option";
      if (!form.paymentMode) errors.paymentMode = "Payment mode is required";
    }

    if (!files.addressProof) errors.addressProof = "Address proof is required";
    if (!files.photo) errors.photo = "Passport size photo is required";
    if (!files.marksheet10) errors.marksheet10 = "10th marksheet is required";
    if (!files.marksheet12) errors.marksheet12 = "12th marksheet is required";
    if (!files.aadhar) errors.aadhar = "Aadhaar card is required";

    return errors;
  };

  const scrollToError = (errors) => {
    const errorFieldToRef = {
      fullName: studentDetailsRef,
      dob: studentDetailsRef,
      gender: studentDetailsRef,
      mobile: studentDetailsRef,
      email: studentDetailsRef,
      permanentAddress: studentDetailsRef,
      currentAddress: studentDetailsRef,
      medical: studentDetailsRef,
      parentName: parentDetailsRef,
      relationship: parentDetailsRef,
      parentMobile: parentDetailsRef,
      occupation: parentDetailsRef,
      school: academicDetailsRef,
      board: academicDetailsRef,
      course: courseDetailsRef,
      feesPaid: feeStructureRef,
      installment: feeStructureRef,
      paymentMode: feeStructureRef,
      addressProof: documentsRef,
      photo: documentsRef,
      marksheet10: documentsRef,
      marksheet12: documentsRef,
      aadhar: documentsRef,
    };

    for (const [field, ref] of Object.entries(errorFieldToRef)) {
      if (errors[field] && ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("❌ Please fill all required fields correctly");
      scrollToError(errors);
      return;
    }

    if (!disclaimerAccepted) {
      setStatus("❌ Please accept the disclaimer to proceed");
      if (declarationRef.current) {
        declarationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const token = window.grecaptcha?.getResponse();

    if (!token) {
      setStatus("❌ Please complete the reCAPTCHA verification");
      if (recaptchaRef.current) {
        recaptchaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    Object.keys(files).forEach((key) => formData.append(key, files[key]));
    formData.append("recaptchaToken", token);

    try {
      await Promise.all([
        axios.post(`${API_URL}/api/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        delay(5000),
      ]);

      setStatus("✅ Form submitted successfully");
      setShowThankYou(true);
      setForm(initialState);
      setFiles({});
      setFileErrors({});
      setFieldErrors({});
      setDisclaimerAccepted(false);
      setSameAddress(false);
      setRecaptchaVerified(false);
      window.grecaptcha?.reset();
      e.target.reset();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
      setRecaptchaVerified(false);
      window.grecaptcha?.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-5xl font-bold mb-2"
            style={{ color: "black" }}
          >
            STUDENT ADMISSION FORM
          </h2>
          <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
            SkyPro Aviation Academy
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
        >
          {status && (
            <div
              className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
                status.includes("successfully")
                  ? "bg-green-100 text-green-800 border-2 border-green-200"
                  : "bg-red-100 text-red-800 border-2 border-red-200"
              }`}
            >
              {status}
            </div>
          )}

          {/* 1. Student Details */}
          <section className="mb-12" ref={studentDetailsRef}>
            <h3
              className="text-2xl font-bold mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              1. Student Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  placeholder="Enter full name"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.fullName && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.dob
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.dob && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.dob}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Gender<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={form.gender === "Male"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={form.gender === "Female"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
                {fieldErrors.gender && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mobile No.<span className="text-red-500">*</span>
                </label>
                <input
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a valid 10-digit mobile number"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.mobile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.mobile && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.mobile}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Permanent Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  value={form.permanentAddress}
                  placeholder="Enter complete permanent address"
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
                    fieldErrors.permanentAddress
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.permanentAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.permanentAddress}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 -mt-4 -mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={handleSameAddressChange}
                    className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">
                    Current address same as permanent address
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Current Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="currentAddress"
                  value={form.currentAddress}
                  placeholder="Enter complete current address"
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
                    fieldErrors.currentAddress
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                  disabled={sameAddress}
                />
                {fieldErrors.currentAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.currentAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  DGCA Computer Number
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Leave Blank if Not Applicable)
                  </span>
                </label>
                <input
                  name="dgca"
                  value={form.dgca}
                  placeholder="Enter DGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  eGCA Number
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Leave Blank if Not Applicable)
                  </span>
                </label>
                <input
                  name="egca"
                  value={form.egca}
                  placeholder="Enter eGCA number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Medical Status<span className="text-red-500">*</span>
                </label>
                <select
                  name="medical"
                  value={form.medical}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
                    fieldErrors.medical
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                >
                  {medicalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.medical && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.medical}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Parent / Guardian Details */}
          <section className="mb-12" ref={parentDetailsRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              2. Parent/Guardian Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Parent/Guardian Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="parentName"
                  type="text"
                  value={form.parentName}
                  placeholder="Enter full name"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.parentName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.parentName && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.parentName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Relationship<span className="text-red-500">*</span>
                </label>
                <input
                  name="relationship"
                  type="text"
                  value={form.relationship}
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  placeholder="Father/Mother/Guardian"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.relationship
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.relationship && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.relationship}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mobile No.<span className="text-red-500">*</span>
                </label>
                <input
                  name="parentMobile"
                  type="tel"
                  value={form.parentMobile}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a valid 10-digit mobile number"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.parentMobile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.parentMobile && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.parentMobile}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Occupation<span className="text-red-500">*</span>
                </label>
                <input
                  name="occupation"
                  value={form.occupation}
                  placeholder="Profession/Business"
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.occupation
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.occupation && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.occupation}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Academic Details */}
          <section className="mb-12" ref={academicDetailsRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              3. Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  School/College Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="school"
                  value={form.school}
                  placeholder="Institution name"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.school
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.school && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.school}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Current Educational Qualification
                </label>
                <select
                  name="classYear"
                  value={form.classYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
                >
                  <option value="">— Please choose an option —</option>
                  <option value="Class 10">Class 10</option>
                  <option value="12th Appearing">12th Appearing</option>
                  <option value="12th Passed">12th Passed</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Board/University<span className="text-red-500">*</span>
                </label>
                <input
                  name="board"
                  value={form.board}
                  placeholder="CBSE/ICSE/State Board"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    fieldErrors.board
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                />
                {fieldErrors.board && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.board}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 4. Course Details */}
          <section className="mb-12" ref={courseDetailsRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              4. Course Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Course Applied For<span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  value={form.course}
                  className={`w-[90%] px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
                    fieldErrors.course
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleChange}
                >
                  {courseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.course && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.course}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Mode of Class
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="modeOfClass"
                      value="Online Class"
                      checked={form.modeOfClass === "Online Class"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Online Class
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="modeOfClass"
                      value="Offline Class"
                      checked={form.modeOfClass === "Offline Class"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Offline Class
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Fee Structure */}
          <section className="mb-12" ref={feeStructureRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              5. Fee Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Fees Paid<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="feesPaid"
                      value="Yes"
                      checked={form.feesPaid === "Yes"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="feesPaid"
                      value="No"
                      checked={form.feesPaid === "No"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
                {fieldErrors.feesPaid && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.feesPaid}
                  </p>
                )}
              </div>

              {form.feesPaid === "Yes" && (
                <>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Installments<span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="installment"
                          value="Yes"
                          checked={form.installment === "Yes"}
                          className="mr-2 text-blue-500 focus:ring-blue-300"
                          onChange={handleChange}
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="installment"
                          value="No"
                          checked={form.installment === "No"}
                          className="mr-2 text-blue-500 focus:ring-blue-300"
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                    {fieldErrors.installment && (
                      <p className="text-red-600 text-sm mt-1">
                        {fieldErrors.installment}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Mode of Payment<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMode"
                      value={form.paymentMode}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
                        fieldErrors.paymentMode
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      onChange={handleChange}
                    >
                      {paymentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.paymentMode && (
                      <p className="text-red-600 text-sm mt-1">
                        {fieldErrors.paymentMode}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 6. Documents Submitted */}
          <section className="mb-12" ref={documentsRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              6. Documents Submitted
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              PNG, JPEG, and PDF formats are accepted (Max 2MB per file)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "addressProof", label: "Address Proof" },
                { name: "photo", label: "Passport Size Photo" },
                { name: "marksheet10", label: "10th Marksheet" },
                { name: "marksheet12", label: "12th Marksheet" },
                { name: "aadhar", label: "Aadhaar Card" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    {field.label}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name={field.name}
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                      fileErrors[field.name] || fieldErrors[field.name]
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    onChange={handleFile}
                  />
                  {(fileErrors[field.name] || fieldErrors[field.name]) && (
                    <p className="text-red-600 text-sm mt-1">
                      {fileErrors[field.name] || fieldErrors[field.name]}
                    </p>
                  )}
                  {files[field.name] &&
                    !fileErrors[field.name] &&
                    !fieldErrors[field.name] && (
                      <p className="text-green-600 text-sm mt-1">
                        ✓ {files[field.name].name}
                      </p>
                    )}
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-8" ref={declarationRef}>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Declaration
              </h3>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 mr-3 text-blue-500 focus:ring-blue-300"
                />
                <span className="text-gray-800 font-medium">
                  I hereby declare that all the information provided above is
                  true and correct to the best of my knowledge. I understand
                  that any false information may result in the cancellation of
                  my admission.
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
          </section>

          {/* reCAPTCHA Section */}
          <section className="mb-8" ref={recaptchaRef}>
            <div className="flex justify-center">
              <div
                className="g-recaptcha"
                data-sitekey={siteKey}
                data-callback="onRecaptchaVerify"
                data-expired-callback="onRecaptchaExpired"
              ></div>
            </div>
            {!recaptchaLoaded && (
              <p className="text-center text-gray-500 text-sm mt-2">
                Loading security verification...
              </p>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !disclaimerAccepted || !recaptchaVerified}
            className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}