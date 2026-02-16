// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ThankYouPopup from "./ThankYouPopup";

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
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
//   const [sameAddress, setSameAddress] = useState(false);
//   const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
//   const [recaptchaVerified, setRecaptchaVerified] = useState(false);
//   const [showThankYou, setShowThankYou] = useState(false);

//   // Refs for each section
//   const studentDetailsRef = useRef(null);
//   const parentDetailsRef = useRef(null);
//   const academicDetailsRef = useRef(null);
//   const courseDetailsRef = useRef(null);
//   const feeStructureRef = useRef(null);
//   const documentsRef = useRef(null);
//   const declarationRef = useRef(null);
//   const recaptchaRef = useRef(null);

//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Load reCAPTCHA script
//   useEffect(() => {
//     window.onRecaptchaVerify = () => {
//       setRecaptchaVerified(true);
//     };

//     window.onRecaptchaExpired = () => {
//       setRecaptchaVerified(false);
//     };

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
//       delete window.onRecaptchaVerify;
//       delete window.onRecaptchaExpired;
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
//     { value: "Airline Preparatory Training", label: "Airline Preparatory Training" },
//     { value: "ADAPT Training", label: "ADAPT Training" },
//     { value: "Drone Pilot License Training", label: "Drone Pilot License Training"},
//     { value: "Safety Management System Course", label: "Safety Management System Course" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//     }

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
//     if (fieldErrors[fieldName]) {
//       setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
//     }

//     if (file) {
//       const validTypes = [
//         "image/png",
//         "image/jpeg",
//         "image/jpg",
//         "application/pdf",
//       ];

//       if (!validTypes.includes(file.type)) {
//         const errorMsg = `Only PNG, JPEG, and PDF files are allowed`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 2 * 1024 * 1024;
//       if (file.size > maxSize) {
//         const errorMsg = `File size must be less than 2MB`;
//         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
//         e.target.value = "";
//         return;
//       }

//       setFiles({ ...files, [fieldName]: file });
//       setStatus("");
//     }
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const validateForm = () => {
//     const errors = {};

//     if (!form.fullName.trim()) errors.fullName = "Full name is required";
//     if (!form.dob) errors.dob = "Date of birth is required";
//     if (!form.gender) errors.gender = "Please select gender";
//     if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
//     else if (form.mobile.length !== 10)
//       errors.mobile = "Mobile number must be 10 digits";
//     if (!form.email.trim()) errors.email = "Email is required";
//     if (!form.permanentAddress.trim())
//       errors.permanentAddress = "Permanent address is required";
//     if (!form.currentAddress.trim())
//       errors.currentAddress = "Current address is required";
//     if (!form.medical) errors.medical = "Medical status is required";

//     if (!form.parentName.trim())
//       errors.parentName = "Parent/Guardian name is required";
//     if (!form.relationship.trim()) errors.relationship = "Relationship is required";
//     if (!form.parentMobile.trim())
//       errors.parentMobile = "Parent mobile number is required";
//     else if (form.parentMobile.length !== 10)
//       errors.parentMobile = "Mobile number must be 10 digits";
//     if (!form.occupation.trim()) errors.occupation = "Occupation is required";

//     if (!form.school.trim()) errors.school = "School/College name is required";
//     if (!form.board.trim()) errors.board = "Board/University is required";

//     if (!form.course) errors.course = "Course selection is required";

//     if (!form.feesPaid) errors.feesPaid = "Please select fees paid status";
//     if (form.feesPaid === "Yes") {
//       if (!form.installment)
//         errors.installment = "Please select installment option";
//       if (!form.paymentMode) errors.paymentMode = "Payment mode is required";
//     }

//     if (!files.addressProof) errors.addressProof = "Address proof is required";
//     if (!files.photo) errors.photo = "Passport size photo is required";
//     if (!files.marksheet10) errors.marksheet10 = "10th marksheet is required";
//     if (!files.marksheet12) errors.marksheet12 = "12th marksheet is required";
//     if (!files.aadhar) errors.aadhar = "Aadhaar card is required";

//     return errors;
//   };

//   const scrollToError = (errors) => {
//     const errorFieldToRef = {
//       fullName: studentDetailsRef,
//       dob: studentDetailsRef,
//       gender: studentDetailsRef,
//       mobile: studentDetailsRef,
//       email: studentDetailsRef,
//       permanentAddress: studentDetailsRef,
//       currentAddress: studentDetailsRef,
//       medical: studentDetailsRef,
//       parentName: parentDetailsRef,
//       relationship: parentDetailsRef,
//       parentMobile: parentDetailsRef,
//       occupation: parentDetailsRef,
//       school: academicDetailsRef,
//       board: academicDetailsRef,
//       course: courseDetailsRef,
//       feesPaid: feeStructureRef,
//       installment: feeStructureRef,
//       paymentMode: feeStructureRef,
//       addressProof: documentsRef,
//       photo: documentsRef,
//       marksheet10: documentsRef,
//       marksheet12: documentsRef,
//       aadhar: documentsRef,
//     };

//     for (const [field, ref] of Object.entries(errorFieldToRef)) {
//       if (errors[field] && ref && ref.current) {
//         ref.current.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//         return;
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errors = validateForm();

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       setStatus("❌ Please fill all required fields correctly");
//       scrollToError(errors);
//       return;
//     }

//     if (!disclaimerAccepted) {
//       setStatus("❌ Please accept the disclaimer to proceed");
//       if (declarationRef.current) {
//         declarationRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//       return;
//     }

//     const token = window.grecaptcha?.getResponse();

//     if (!token) {
//       setStatus("❌ Please complete the reCAPTCHA verification");
//       if (recaptchaRef.current) {
//         recaptchaRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//       return;
//     }

//     setLoading(true);
//     setStatus("");

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));
//     formData.append("recaptchaToken", token);

//     try {
//       await Promise.all([
//         axios.post(`${API_URL}/api/submit`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         }),
//         delay(5000),
//       ]);

//       setStatus("✅ Form submitted successfully");
//       setShowThankYou(true);
//       setForm(initialState);
//       setFiles({});
//       setFileErrors({});
//       setFieldErrors({});
//       setDisclaimerAccepted(false);
//       setSameAddress(false);
//       setRecaptchaVerified(false);
//       window.grecaptcha?.reset();
//       e.target.reset();

//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       setStatus(`❌ ${err.response?.data?.error || "Submission failed"}`);
//       setRecaptchaVerified(false);
//       window.grecaptcha?.reset();
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <ThankYouPopup
//         isOpen={showThankYou}
//         onClose={() => setShowThankYou(false)}
//       />

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
//           <section className="mb-12" ref={studentDetailsRef}>
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
//                   value={form.fullName}
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.fullName
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.fullName && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.fullName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Date of Birth<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={form.dob}
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.dob
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.dob && (
//                   <p className="text-red-600 text-sm mt-1">{fieldErrors.dob}</p>
//                 )}
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
//                       checked={form.gender === "Male"}
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Male
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       checked={form.gender === "Female"}
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Female
//                   </label>
//                 </div>
//                 {fieldErrors.gender && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.gender}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="mobile"
//                   type="tel"
//                   value={form.mobile}
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.mobile
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.mobile && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.mobile}
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Email Address<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   placeholder="your@email.com"
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.email
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.email && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.email}
//                   </p>
//                 )}
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
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
//                     fieldErrors.permanentAddress
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.permanentAddress && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.permanentAddress}
//                   </p>
//                 )}
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
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
//                     fieldErrors.currentAddress
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                   disabled={sameAddress}
//                 />
//                 {fieldErrors.currentAddress && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.currentAddress}
//                   </p>
//                 )}
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
//                   value={form.dgca}
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
//                   value={form.egca}
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
//                   value={form.medical}
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
//                     fieldErrors.medical
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 >
//                   {medicalOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {fieldErrors.medical && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.medical}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* 2. Parent / Guardian Details */}
//           <section className="mb-12" ref={parentDetailsRef}>
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
//                   value={form.parentName}
//                   placeholder="Enter full name"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.parentName
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.parentName && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.parentName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Relationship<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="relationship"
//                   type="text"
//                   value={form.relationship}
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   placeholder="Father/Mother/Guardian"
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.relationship
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.relationship && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.relationship}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Mobile No.<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="parentMobile"
//                   type="tel"
//                   value={form.parentMobile}
//                   placeholder="10-digit mobile number"
//                   inputMode="numeric"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   title="Enter a valid 10-digit mobile number"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/\D/g, ""))
//                   }
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.parentMobile
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.parentMobile && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.parentMobile}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Occupation<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="occupation"
//                   value={form.occupation}
//                   placeholder="Profession/Business"
//                   type="text"
//                   inputMode="text"
//                   pattern="[A-Za-z\s]+"
//                   title="Only alphabets allowed"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(
//                       /[^A-Za-z\s]/g,
//                       ""
//                     ))
//                   }
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.occupation
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.occupation && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.occupation}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* 3. Academic Details */}
//           <section className="mb-12" ref={academicDetailsRef}>
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
//                   value={form.school}
//                   placeholder="Institution name"
//                   type="text"
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.school
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.school && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.school}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Current Educational Qualification
//                 </label>
//                 <select
//                   name="classYear"
//                   value={form.classYear}
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
//                   value={form.board}
//                   placeholder="CBSE/ICSE/State Board"
//                   type="text"
//                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
//                     fieldErrors.board
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 />
//                 {fieldErrors.board && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.board}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* 4. Course Details */}
//           <section className="mb-12" ref={courseDetailsRef}>
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
//                   value={form.course}
//                   className={`w-[90%] px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
//                     fieldErrors.course
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                   onChange={handleChange}
//                 >
//                   {courseOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {fieldErrors.course && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.course}
//                   </p>
//                 )}
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
//                       checked={form.modeOfClass === "Online Class"}
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
//                       checked={form.modeOfClass === "Offline Class"}
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
//           <section className="mb-12" ref={feeStructureRef}>
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               5. Fee Structure
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-2">
//                   Fees Status<span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex space-x-6 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="Yes"
//                       checked={form.feesPaid === "Yes"}
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="feesPaid"
//                       value="No"
//                       checked={form.feesPaid === "No"}
//                       className="mr-2 text-blue-500 focus:ring-blue-300"
//                       onChange={handleChange}
//                     />
//                     No
//                   </label>
//                 </div>
//                 {fieldErrors.feesPaid && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {fieldErrors.feesPaid}
//                   </p>
//                 )}
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
//                           checked={form.installment === "Yes"}
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           onChange={handleChange}
//                         />
//                         Yes
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           name="installment"
//                           value="No"
//                           checked={form.installment === "No"}
//                           className="mr-2 text-blue-500 focus:ring-blue-300"
//                           onChange={handleChange}
//                         />
//                         No
//                       </label>
//                     </div>
//                     {fieldErrors.installment && (
//                       <p className="text-red-600 text-sm mt-1">
//                         {fieldErrors.installment}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-lg font-bold text-gray-700 mb-2">
//                       Mode of Payment<span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="paymentMode"
//                       value={form.paymentMode}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
//                         fieldErrors.paymentMode
//                           ? "border-red-500 bg-red-50"
//                           : "border-gray-300"
//                       }`}
//                       onChange={handleChange}
//                     >
//                       {paymentOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     {fieldErrors.paymentMode && (
//                       <p className="text-red-600 text-sm mt-1">
//                         {fieldErrors.paymentMode}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
//           </section>

//           {/* 6. Documents Submitted */}
//           <section className="mb-12" ref={documentsRef}>
//             <h3
//               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
//               style={{ color: "#003366" }}
//             >
//               6. Documents Required
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
//                       fileErrors[field.name] || fieldErrors[field.name]
//                         ? "border-red-400 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                     onChange={handleFile}
//                   />
//                   {(fileErrors[field.name] || fieldErrors[field.name]) && (
//                     <p className="text-red-600 text-sm mt-1">
//                       {fileErrors[field.name] || fieldErrors[field.name]}
//                     </p>
//                   )}
//                   {files[field.name] &&
//                     !fileErrors[field.name] &&
//                     !fieldErrors[field.name] && (
//                       <p className="text-green-600 text-sm mt-1">
//                         ✓ {files[field.name].name}
//                       </p>
//                     )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Disclaimer */}
//           <section className="mb-8" ref={declarationRef}>
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
//                 />
//                 <span className="text-gray-800 font-medium">
//                   I hereby declare that all the information provided above is
//                   true and correct to the best of my knowledge. I understand
//                   that any false information may result in the cancellation of
//                   my admission.
//                   <span className="text-red-500">*</span>
//                 </span>
//               </label>
//             </div>
//           </section>

//           {/* reCAPTCHA Section */}
//           <section className="mb-8" ref={recaptchaRef}>
//             <div className="flex justify-center">
//               <div
//                 className="g-recaptcha"
//                 data-sitekey={siteKey}
//                 data-callback="onRecaptchaVerify"
//                 data-expired-callback="onRecaptchaExpired"
//               ></div>
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
//             disabled={loading || !disclaimerAccepted || !recaptchaVerified}
//             className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none"
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // import { useState, useEffect, useRef } from "react";
// // import axios from "axios";
// // import ThankYouPopup from "./ThankYouPopup";

// // export default function App() {
// //   const initialState = {
// //     fullName: "",
// //     dob: "",
// //     gender: "",
// //     mobile: "",
// //     email: "",
// //     permanentAddress: "",
// //     currentAddress: "",
// //     dgca: "",
// //     egca: "",
// //     medical: "",
// //     parentName: "",
// //     relationship: "",
// //     parentMobile: "",
// //     occupation: "",
// //     school: "",
// //     classYear: "",
// //     board: "",
// //     course: "",
// //     modeOfClass: "",
// //     feesPaid: "",
// //     paymentMode: "",
// //     installment: "",
// //   };

// //   const STORAGE_KEY = "skypro_admission_form_data";
// //   const STORAGE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// //   // Load saved data from localStorage on mount
// //   const loadSavedData = () => {
// //     try {
// //       const savedData = localStorage.getItem(STORAGE_KEY);
// //       if (savedData) {
// //         const { data, timestamp } = JSON.parse(savedData);
// //         const now = new Date().getTime();

// //         // Check if data is still valid (within 2 hours)
// //         if (now - timestamp < STORAGE_EXPIRY) {
// //           return data;
// //         } else {
// //           // Data expired, clear it
// //           localStorage.removeItem(STORAGE_KEY);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error loading saved data:", error);
// //     }
// //     return initialState;
// //   };

// //   const [form, setForm] = useState(loadSavedData());
// //   const [files, setFiles] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState("");
// //   const [fileErrors, setFileErrors] = useState({});
// //   const [fieldErrors, setFieldErrors] = useState({});
// //   const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
// //   const [sameAddress, setSameAddress] = useState(false);
// //   const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
// //   const [recaptchaVerified, setRecaptchaVerified] = useState(false);
// //   const [showThankYou, setShowThankYou] = useState(false);

// //   // Refs for each section
// //   const studentDetailsRef = useRef(null);
// //   const parentDetailsRef = useRef(null);
// //   const academicDetailsRef = useRef(null);
// //   const courseDetailsRef = useRef(null);
// //   const feeStructureRef = useRef(null);
// //   const documentsRef = useRef(null);
// //   const declarationRef = useRef(null);
// //   const recaptchaRef = useRef(null);

// //   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
// //   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// //   // Auto-save form data to localStorage whenever form changes
// //   useEffect(() => {
// //     const saveData = () => {
// //       try {
// //         const dataToSave = {
// //           data: form,
// //           timestamp: new Date().getTime(),
// //         };
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //       } catch (error) {
// //         console.error("Error saving data:", error);
// //       }
// //     };

// //     // Debounce save to avoid too frequent writes
// //     const timeoutId = setTimeout(saveData, 500);
// //     return () => clearTimeout(timeoutId);
// //   }, [form]);

// //   // Load reCAPTCHA script
// //   useEffect(() => {
// //     window.onRecaptchaVerify = () => {
// //       setRecaptchaVerified(true);
// //     };

// //     window.onRecaptchaExpired = () => {
// //       setRecaptchaVerified(false);
// //     };

// //     const script = document.createElement("script");
// //     script.src = "https://www.google.com/recaptcha/api.js";
// //     script.async = true;
// //     script.defer = true;
// //     script.onload = () => setRecaptchaLoaded(true);
// //     document.body.appendChild(script);

// //     return () => {
// //       if (document.body.contains(script)) {
// //         document.body.removeChild(script);
// //       }
// //       delete window.onRecaptchaVerify;
// //       delete window.onRecaptchaExpired;
// //     };
// //   }, []);

// //   const paymentOptions = [
// //     { value: "", label: "Select Payment Mode" },
// //     { value: "Cash", label: "Cash" },
// //     { value: "UPI", label: "UPI" },
// //     { value: "Net Banking", label: "Net Banking" },
// //     { value: "Cheque", label: "Cheque" },
// //   ];

// //   const medicalOptions = [
// //     { value: "", label: "Select Medical Status" },
// //     { value: "Medical Class 1", label: "Medical Class 1" },
// //     { value: "Medical Class 2", label: "Medical Class 2" },
// //     { value: "N/A", label: "N/A" },
// //   ];

// //   const courseOptions = [
// //     { value: "", label: "Select Course" },
// //     { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
// //     { value: "ATPL Theory Training", label: "ATPL Theory Training" },
// //     { value: "CPL Flying Training", label: "CPL Flying Training" },
// //     {
// //       value: "Assistant Flight Instructor Rating",
// //       label: "Assistant Flight Instructor Rating",
// //     },
// //     { value: "Type Rating Courses", label: "Type Rating Courses" },
// //     {
// //       value: "Airline Preparatory Training",
// //       label: "Airline Preparatory Training",
// //     },
// //     { value: "ADAPT Training", label: "ADAPT Training" },
// //     {
// //       value: "Drone Pilot License Training",
// //       label: "Drone Pilot License Training",
// //     },
// //     { value: "Cabin Crew Training", label: "Cabin Crew Training" },
// //     {
// //       value: "Airport Agent Diploma Training",
// //       label: "Airport Agent Diploma Training",
// //     },
// //     { value: "Mentorship Programme", label: "Mentorship Programme" },
// //   ];

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm({ ...form, [name]: value });

// //     if (fieldErrors[name]) {
// //       setFieldErrors((prev) => ({ ...prev, [name]: "" }));
// //     }

// //     if (name === "permanentAddress" && sameAddress) {
// //       setForm((prev) => ({ ...prev, currentAddress: value }));
// //     }
// //   };

// //   const handleSameAddressChange = (e) => {
// //     const checked = e.target.checked;
// //     setSameAddress(checked);

// //     if (checked) {
// //       setForm((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
// //     }
// //   };

// //   const handleFile = (e) => {
// //     const file = e.target.files[0];
// //     const fieldName = e.target.name;

// //     setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));
// //     if (fieldErrors[fieldName]) {
// //       setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
// //     }

// //     if (file) {
// //       const validTypes = [
// //         "image/png",
// //         "image/jpeg",
// //         "image/jpg",
// //         "application/pdf",
// //       ];

// //       if (!validTypes.includes(file.type)) {
// //         const errorMsg = `Only PNG, JPEG, and PDF files are allowed`;
// //         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
// //         e.target.value = "";
// //         return;
// //       }

// //       const maxSize = 2 * 1024 * 1024;
// //       if (file.size > maxSize) {
// //         const errorMsg = `File size must be less than 2MB`;
// //         setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
// //         e.target.value = "";
// //         return;
// //       }

// //       setFiles({ ...files, [fieldName]: file });
// //       setStatus("");
// //     }
// //   };

// //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// //   const validateForm = () => {
// //     const errors = {};

// //     if (!form.fullName.trim()) errors.fullName = "Full name is required";
// //     if (!form.dob) errors.dob = "Date of birth is required";
// //     if (!form.gender) errors.gender = "Please select gender";
// //     if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
// //     else if (form.mobile.length !== 10)
// //       errors.mobile = "Mobile number must be 10 digits";
// //     if (!form.email.trim()) errors.email = "Email is required";
// //     if (!form.permanentAddress.trim())
// //       errors.permanentAddress = "Permanent address is required";
// //     if (!form.currentAddress.trim())
// //       errors.currentAddress = "Current address is required";
// //     if (!form.medical) errors.medical = "Medical status is required";

// //     if (!form.parentName.trim())
// //       errors.parentName = "Parent/Guardian name is required";
// //     if (!form.relationship.trim())
// //       errors.relationship = "Relationship is required";
// //     if (!form.parentMobile.trim())
// //       errors.parentMobile = "Parent mobile number is required";
// //     else if (form.parentMobile.length !== 10)
// //       errors.parentMobile = "Mobile number must be 10 digits";
// //     if (!form.occupation.trim()) errors.occupation = "Occupation is required";

// //     if (!form.school.trim()) errors.school = "School/College name is required";
// //     if (!form.board.trim()) errors.board = "Board/University is required";

// //     if (!form.course) errors.course = "Course selection is required";

// //     if (!form.feesPaid) errors.feesPaid = "Please select fees paid status";
// //     if (form.feesPaid === "Yes") {
// //       if (!form.installment)
// //         errors.installment = "Please select installment option";
// //       if (!form.paymentMode) errors.paymentMode = "Payment mode is required";
// //     }

// //     if (!files.addressProof) errors.addressProof = "Address proof is required";
// //     if (!files.photo) errors.photo = "Passport size photo is required";
// //     if (!files.marksheet10) errors.marksheet10 = "10th marksheet is required";
// //     if (!files.marksheet12) errors.marksheet12 = "12th marksheet is required";
// //     if (!files.aadhar) errors.aadhar = "Aadhaar card is required";

// //     return errors;
// //   };

// //   const scrollToError = (errors) => {
// //     const errorFieldToRef = {
// //       fullName: studentDetailsRef,
// //       dob: studentDetailsRef,
// //       gender: studentDetailsRef,
// //       mobile: studentDetailsRef,
// //       email: studentDetailsRef,
// //       permanentAddress: studentDetailsRef,
// //       currentAddress: studentDetailsRef,
// //       medical: studentDetailsRef,
// //       parentName: parentDetailsRef,
// //       relationship: parentDetailsRef,
// //       parentMobile: parentDetailsRef,
// //       occupation: parentDetailsRef,
// //       school: academicDetailsRef,
// //       board: academicDetailsRef,
// //       course: courseDetailsRef,
// //       feesPaid: feeStructureRef,
// //       installment: feeStructureRef,
// //       paymentMode: feeStructureRef,
// //       addressProof: documentsRef,
// //       photo: documentsRef,
// //       marksheet10: documentsRef,
// //       marksheet12: documentsRef,
// //       aadhar: documentsRef,
// //     };

// //     for (const [field, ref] of Object.entries(errorFieldToRef)) {
// //       if (errors[field] && ref && ref.current) {
// //         ref.current.scrollIntoView({
// //           behavior: "smooth",
// //           block: "center",
// //         });
// //         return;
// //       }
// //     }
// //   };

// //   const submitWithRetry = async (formData, maxRetries = 3) => {
// //     for (let attempt = 1; attempt <= maxRetries; attempt++) {
// //       try {
// //         setStatus(`📤 Submitting (Attempt ${attempt}/${maxRetries})...`);

// //         const response = await axios.post(`${API_URL}/api/submit`, formData, {
// //           headers: { "Content-Type": "multipart/form-data" },
// //           timeout: 60000, // 60 seconds timeout
// //         });

// //         return response;
// //       } catch (err) {
// //         console.error(`Attempt ${attempt} failed:`, err.message);

// //         // If this was the last attempt, throw the error
// //         if (attempt === maxRetries) {
// //           throw err;
// //         }

// //         // Wait before retrying (exponential backoff)
// //         const waitTime = attempt * 3000; // 3s, 6s, 9s
// //         setStatus(`⏳ Server is waking up... Retrying in ${waitTime/1000}s...`);
// //         await delay(waitTime);
// //       }
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const errors = validateForm();

// //     if (Object.keys(errors).length > 0) {
// //       setFieldErrors(errors);
// //       setStatus("❌ Please fill all required fields correctly");
// //       scrollToError(errors);
// //       return;
// //     }

// //     if (!disclaimerAccepted) {
// //       setStatus("❌ Please accept the disclaimer to proceed");
// //       if (declarationRef.current) {
// //         declarationRef.current.scrollIntoView({
// //           behavior: "smooth",
// //           block: "center",
// //         });
// //       }
// //       return;
// //     }

// //     const token = window.grecaptcha?.getResponse();

// //     if (!token) {
// //       setStatus("❌ Please complete the reCAPTCHA verification");
// //       if (recaptchaRef.current) {
// //         recaptchaRef.current.scrollIntoView({
// //           behavior: "smooth",
// //           block: "center",
// //         });
// //       }
// //       return;
// //     }

// //     setLoading(true);
// //     setStatus("📤 Submitting your application...");

// //     const formData = new FormData();
// //     Object.keys(form).forEach((key) => formData.append(key, form[key]));
// //     Object.keys(files).forEach((key) => formData.append(key, files[key]));
// //     formData.append("recaptchaToken", token);

// //     try {
// //       // Use retry mechanism with minimum 5 second delay
// //       await Promise.all([
// //         submitWithRetry(formData),
// //         delay(5000),
// //       ]);

// //       setStatus("✅ Form submitted successfully");
// //       setShowThankYou(true);

// //       // Clear localStorage after successful submission
// //       localStorage.removeItem(STORAGE_KEY);

// //       setForm(initialState);
// //       setFiles({});
// //       setFileErrors({});
// //       setFieldErrors({});
// //       setDisclaimerAccepted(false);
// //       setSameAddress(false);
// //       setRecaptchaVerified(false);
// //       window.grecaptcha?.reset();
// //       e.target.reset();

// //       window.scrollTo({ top: 0, behavior: "smooth" });
// //     } catch (err) {
// //       const errorMsg = err.response?.data?.error || err.message || "Submission failed";
// //       setStatus(`❌ ${errorMsg}`);
// //       setRecaptchaVerified(false);
// //       window.grecaptcha?.reset();
// //       window.scrollTo({ top: 0, behavior: "smooth" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Function to clear saved data
// //   const clearSavedData = () => {
// //     if (window.confirm("Are you sure you want to clear all saved form data?")) {
// //       localStorage.removeItem(STORAGE_KEY);
// //       setForm(initialState);
// //       setFiles({});
// //       setFieldErrors({});
// //       setFileErrors({});
// //       setStatus("🗑️ Form data cleared");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <ThankYouPopup
// //         isOpen={showThankYou}
// //         onClose={() => setShowThankYou(false)}
// //       />

// //       <div className="max-w-5xl mx-auto">
// //         <div className="text-center mb-12">
// //           <h2
// //             className="text-3xl sm:text-5xl font-bold mb-2"
// //             style={{ color: "black" }}
// //           >
// //             STUDENT ADMISSION FORM
// //           </h2>
// //           <p className="text-xl font-bold" style={{ color: "#f4b221" }}>
// //             SkyPro Aviation Academy
// //           </p>
// //         </div>

// //         {/* Auto-save indicator */}
// //         <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
// //           <div className="flex items-center space-x-2">
// //             <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
// //               <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
// //             </svg>
// //             <span className="text-blue-800 text-sm font-medium">
// //               ✨ Your progress is auto-saved for 2 hours
// //             </span>
// //           </div>
// //           <button
// //             type="button"
// //             onClick={clearSavedData}
// //             className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
// //           >
// //             Clear Data
// //           </button>
// //         </div>

// //         <form
// //           onSubmit={handleSubmit}
// //           className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200"
// //         >
// //           {status && (
// //             <div
// //               className={`mb-8 p-4 rounded-2xl text-center font-medium text-lg ${
// //                 status.includes("successfully")
// //                   ? "bg-green-100 text-green-800 border-2 border-green-200"
// //                   : status.includes("Submitting") || status.includes("Retrying")
// //                   ? "bg-blue-100 text-blue-800 border-2 border-blue-200"
// //                   : "bg-red-100 text-red-800 border-2 border-red-200"
// //               }`}
// //             >
// //               {status}
// //             </div>
// //           )}

// //           {/* 1. Student Details */}
// //           <section className="mb-12" ref={studentDetailsRef}>
// //             <h3
// //               className="text-2xl font-bold mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               1. Student Details
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Full Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="fullName"
// //                   value={form.fullName}
// //                   placeholder="Enter full name"
// //                   inputMode="text"
// //                   pattern="[A-Za-z\s]+"
// //                   title="Only alphabets allowed"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(
// //                       /[^A-Za-z\s]/g,
// //                       ""
// //                     ))
// //                   }
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.fullName
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.fullName && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.fullName}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Date of Birth<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="date"
// //                   name="dob"
// //                   value={form.dob}
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.dob
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.dob && (
// //                   <p className="text-red-600 text-sm mt-1">{fieldErrors.dob}</p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Gender<span className="text-red-500">*</span>
// //                 </label>
// //                 <div className="flex space-x-6 mt-2">
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="gender"
// //                       value="Male"
// //                       checked={form.gender === "Male"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     Male
// //                   </label>
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="gender"
// //                       value="Female"
// //                       checked={form.gender === "Female"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     Female
// //                   </label>
// //                 </div>
// //                 {fieldErrors.gender && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.gender}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Mobile No.<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="mobile"
// //                   type="tel"
// //                   value={form.mobile}
// //                   placeholder="10-digit mobile number"
// //                   inputMode="numeric"
// //                   pattern="[0-9]{10}"
// //                   maxLength={10}
// //                   title="Enter a valid 10-digit mobile number"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(/\D/g, ""))
// //                   }
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.mobile
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.mobile && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.mobile}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="md:col-span-2">
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Email Address<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="email"
// //                   name="email"
// //                   value={form.email}
// //                   placeholder="your@email.com"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.email
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.email && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.email}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="md:col-span-2">
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Permanent Address<span className="text-red-500">*</span>
// //                 </label>
// //                 <textarea
// //                   name="permanentAddress"
// //                   value={form.permanentAddress}
// //                   placeholder="Enter complete permanent address"
// //                   rows="3"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
// //                     fieldErrors.permanentAddress
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.permanentAddress && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.permanentAddress}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="md:col-span-2 -mt-4 -mb-4">
// //                 <label className="flex items-center">
// //                   <input
// //                     type="checkbox"
// //                     checked={sameAddress}
// //                     onChange={handleSameAddressChange}
// //                     className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
// //                   />
// //                   <span className="text-gray-700 font-medium">
// //                     Current address same as permanent address
// //                   </span>
// //                 </label>
// //               </div>

// //               <div className="md:col-span-2">
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Current Address<span className="text-red-500">*</span>
// //                 </label>
// //                 <textarea
// //                   name="currentAddress"
// //                   value={form.currentAddress}
// //                   placeholder="Enter complete current address"
// //                   rows="3"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 resize-vertical ${
// //                     fieldErrors.currentAddress
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                   disabled={sameAddress}
// //                 />
// //                 {fieldErrors.currentAddress && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.currentAddress}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   DGCA Computer Number
// //                   <span className="text-sm font-normal text-gray-500 ml-2">
// //                     (Leave Blank if Not Applicable)
// //                   </span>
// //                 </label>
// //                 <input
// //                   name="dgca"
// //                   value={form.dgca}
// //                   placeholder="Enter DGCA number"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
// //                   onChange={handleChange}
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   eGCA Number
// //                   <span className="text-sm font-normal text-gray-500 ml-2">
// //                     (Leave Blank if Not Applicable)
// //                   </span>
// //                 </label>
// //                 <input
// //                   name="egca"
// //                   value={form.egca}
// //                   placeholder="Enter eGCA number"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200"
// //                   onChange={handleChange}
// //                 />
// //               </div>

// //               <div className="md:col-span-2">
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Medical Status<span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="medical"
// //                   value={form.medical}
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
// //                     fieldErrors.medical
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 >
// //                   {medicalOptions.map((option) => (
// //                     <option key={option.value} value={option.value}>
// //                       {option.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 {fieldErrors.medical && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.medical}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* 2. Parent / Guardian Details */}
// //           <section className="mb-12" ref={parentDetailsRef}>
// //             <h3
// //               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               2. Parent/Guardian Details
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Parent/Guardian Name<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="parentName"
// //                   type="text"
// //                   value={form.parentName}
// //                   placeholder="Enter full name"
// //                   inputMode="text"
// //                   pattern="[A-Za-z\s]+"
// //                   title="Only alphabets allowed"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(
// //                       /[^A-Za-z\s]/g,
// //                       ""
// //                     ))
// //                   }
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.parentName
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.parentName && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.parentName}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Relationship<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="relationship"
// //                   type="text"
// //                   value={form.relationship}
// //                   inputMode="text"
// //                   pattern="[A-Za-z\s]+"
// //                   title="Only alphabets allowed"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(
// //                       /[^A-Za-z\s]/g,
// //                       ""
// //                     ))
// //                   }
// //                   placeholder="Father/Mother/Guardian"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.relationship
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.relationship && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.relationship}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Mobile No.<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="parentMobile"
// //                   type="tel"
// //                   value={form.parentMobile}
// //                   placeholder="10-digit mobile number"
// //                   inputMode="numeric"
// //                   pattern="[0-9]{10}"
// //                   maxLength={10}
// //                   title="Enter a valid 10-digit mobile number"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(/\D/g, ""))
// //                   }
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.parentMobile
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.parentMobile && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.parentMobile}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Occupation<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="occupation"
// //                   value={form.occupation}
// //                   placeholder="Profession/Business"
// //                   type="text"
// //                   inputMode="text"
// //                   pattern="[A-Za-z\s]+"
// //                   title="Only alphabets allowed"
// //                   onInput={(e) =>
// //                     (e.target.value = e.target.value.replace(
// //                       /[^A-Za-z\s]/g,
// //                       ""
// //                     ))
// //                   }
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.occupation
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.occupation && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.occupation}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* 3. Academic Details */}
// //           <section className="mb-12" ref={academicDetailsRef}>
// //             <h3
// //               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               3. Academic Details
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   School/College Name<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="school"
// //                   value={form.school}
// //                   placeholder="Institution name"
// //                   type="text"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.school
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.school && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.school}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Current Educational Qualification
// //                 </label>
// //                 <select
// //                   name="classYear"
// //                   value={form.classYear}
// //                   onChange={handleChange}
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white"
// //                 >
// //                   <option value="">— Please choose an option —</option>
// //                   <option value="Class 10">Class 10</option>
// //                   <option value="12th Appearing">12th Appearing</option>
// //                   <option value="12th Passed">12th Passed</option>
// //                   <option value="Graduation">Graduation</option>
// //                   <option value="Post Graduation">Post Graduation</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Board/University<span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   name="board"
// //                   value={form.board}
// //                   placeholder="CBSE/ICSE/State Board"
// //                   type="text"
// //                   className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
// //                     fieldErrors.board
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 />
// //                 {fieldErrors.board && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.board}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* 4. Course Details */}
// //           <section className="mb-12" ref={courseDetailsRef}>
// //             <h3
// //               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               4. Course Details
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Course Applied For<span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="course"
// //                   value={form.course}
// //                   className={`w-[90%] px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
// //                     fieldErrors.course
// //                       ? "border-red-500 bg-red-50"
// //                       : "border-gray-300"
// //                   }`}
// //                   onChange={handleChange}
// //                 >
// //                   {courseOptions.map((option) => (
// //                     <option key={option.value} value={option.value}>
// //                       {option.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 {fieldErrors.course && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.course}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Mode of Class
// //                 </label>
// //                 <div className="flex space-x-6 mt-2">
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="modeOfClass"
// //                       value="Online Class"
// //                       checked={form.modeOfClass === "Online Class"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     Online Class
// //                   </label>
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="modeOfClass"
// //                       value="Offline Class"
// //                       checked={form.modeOfClass === "Offline Class"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     Offline Class
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           </section>

// //           {/* 5. Fee Structure */}
// //           <section className="mb-12" ref={feeStructureRef}>
// //             <h3
// //               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               5. Fee Structure
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div>
// //                 <label className="block text-lg font-bold text-gray-700 mb-2">
// //                   Fees Paid<span className="text-red-500">*</span>
// //                 </label>
// //                 <div className="flex space-x-6 mt-2">
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="feesPaid"
// //                       value="Yes"
// //                       checked={form.feesPaid === "Yes"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     Yes
// //                   </label>
// //                   <label className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="feesPaid"
// //                       value="No"
// //                       checked={form.feesPaid === "No"}
// //                       className="mr-2 text-blue-500 focus:ring-blue-300"
// //                       onChange={handleChange}
// //                     />
// //                     No
// //                   </label>
// //                 </div>
// //                 {fieldErrors.feesPaid && (
// //                   <p className="text-red-600 text-sm mt-1">
// //                     {fieldErrors.feesPaid}
// //                   </p>
// //                 )}
// //               </div>

// //               {form.feesPaid === "Yes" && (
// //                 <>
// //                   <div>
// //                     <label className="block text-lg font-bold text-gray-700 mb-2">
// //                       Installments<span className="text-red-500">*</span>
// //                     </label>
// //                     <div className="flex space-x-6 mt-2">
// //                       <label className="flex items-center">
// //                         <input
// //                           type="radio"
// //                           name="installment"
// //                           value="Yes"
// //                           checked={form.installment === "Yes"}
// //                           className="mr-2 text-blue-500 focus:ring-blue-300"
// //                           onChange={handleChange}
// //                         />
// //                         Yes
// //                       </label>
// //                       <label className="flex items-center">
// //                         <input
// //                           type="radio"
// //                           name="installment"
// //                           value="No"
// //                           checked={form.installment === "No"}
// //                           className="mr-2 text-blue-500 focus:ring-blue-300"
// //                           onChange={handleChange}
// //                         />
// //                         No
// //                       </label>
// //                     </div>
// //                     {fieldErrors.installment && (
// //                       <p className="text-red-600 text-sm mt-1">
// //                         {fieldErrors.installment}
// //                       </p>
// //                     )}
// //                   </div>

// //                   <div>
// //                     <label className="block text-lg font-bold text-gray-700 mb-2">
// //                       Mode of Payment<span className="text-red-500">*</span>
// //                     </label>
// //                     <select
// //                       name="paymentMode"
// //                       value={form.paymentMode}
// //                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
// //                         fieldErrors.paymentMode
// //                           ? "border-red-500 bg-red-50"
// //                           : "border-gray-300"
// //                       }`}
// //                       onChange={handleChange}
// //                     >
// //                       {paymentOptions.map((option) => (
// //                         <option key={option.value} value={option.value}>
// //                           {option.label}
// //                         </option>
// //                       ))}
// //                     </select>
// //                     {fieldErrors.paymentMode && (
// //                       <p className="text-red-600 text-sm mt-1">
// //                         {fieldErrors.paymentMode}
// //                       </p>
// //                     )}
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //           </section>

// //           {/* 6. Documents Submitted */}
// //           <section className="mb-12" ref={documentsRef}>
// //             <h3
// //               className="text-2xl font-bold text-gray-900 mb-3 pb-3"
// //               style={{ color: "#003366" }}
// //             >
// //               6. Documents Submitted
// //             </h3>
// //             <p className="text-sm text-gray-600 mb-4">
// //               PNG, JPEG, and PDF formats are accepted (Max 2MB per file)
// //             </p>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //               {[
// //                 { name: "addressProof", label: "Address Proof" },
// //                 { name: "photo", label: "Passport Size Photo" },
// //                 { name: "marksheet10", label: "10th Marksheet" },
// //                 { name: "marksheet12", label: "12th Marksheet" },
// //                 { name: "aadhar", label: "Aadhaar Card" },
// //               ].map((field) => (
// //                 <div key={field.name}>
// //                   <label className="block text-lg font-bold text-gray-700 mb-2">
// //                     {field.label}
// //                     <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="file"
// //                     name={field.name}
// //                     accept="image/png, image/jpeg, image/jpg, application/pdf"
// //                     className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
// //                       fileErrors[field.name] || fieldErrors[field.name]
// //                         ? "border-red-400 bg-red-50"
// //                         : "border-gray-300"
// //                     }`}
// //                     onChange={handleFile}
// //                   />
// //                   {(fileErrors[field.name] || fieldErrors[field.name]) && (
// //                     <p className="text-red-600 text-sm mt-1">
// //                       {fileErrors[field.name] || fieldErrors[field.name]}
// //                     </p>
// //                   )}
// //                   {files[field.name] &&
// //                     !fileErrors[field.name] &&
// //                     !fieldErrors[field.name] && (
// //                       <p className="text-green-600 text-sm mt-1">
// //                         ✓ {files[field.name].name}
// //                       </p>
// //                     )}
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           {/* Disclaimer */}
// //           <section className="mb-8" ref={declarationRef}>
// //             <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
// //               <h3 className="text-xl font-bold text-gray-900 mb-3">
// //                 Declaration
// //               </h3>
// //               <label className="flex items-start">
// //                 <input
// //                   type="checkbox"
// //                   checked={disclaimerAccepted}
// //                   onChange={(e) => setDisclaimerAccepted(e.target.checked)}
// //                   className="mt-1 mr-3 text-blue-500 focus:ring-blue-300"
// //                 />
// //                 <span className="text-gray-800 font-medium">
// //                   I hereby declare that all the information provided above is
// //                   true and correct to the best of my knowledge. I understand
// //                   that any false information may result in the cancellation of
// //                   my admission.
// //                   <span className="text-red-500">*</span>
// //                 </span>
// //               </label>
// //             </div>
// //           </section>

// //           {/* reCAPTCHA Section */}
// //           <section className="mb-8" ref={recaptchaRef}>
// //             <div className="flex justify-center">
// //               <div
// //                 className="g-recaptcha"
// //                 data-sitekey={siteKey}
// //                 data-callback="onRecaptchaVerify"
// //                 data-expired-callback="onRecaptchaExpired"
// //               ></div>
// //             </div>
// //             {!recaptchaLoaded && (
// //               <p className="text-center text-gray-500 text-sm mt-2">
// //                 Loading security verification...
// //               </p>
// //             )}
// //           </section>

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             disabled={loading || !disclaimerAccepted || !recaptchaVerified}
// //             className="w-full bg-[#003366] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none"
// //           >
// //             {loading ? "Submitting..." : "Submit Application"}
// //           </button>

// //           {/* Info about server wake-up time */}
// //           <p className="text-center text-gray-500 text-sm mt-4">
// //             ℹ️ First-time submission may take 30-60 seconds as server wakes up
// //           </p>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }




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
    class12Stream: "",
    board: "",
    course: "",
    modeOfClass: "",
    feesPaid: "",
    paymentMode: "",
    installment: "",
    transactionId: "",
    paymentDate: "",
    previousFlyingExperience: "",
    dgcaPapersCleared: "",
    dgcaSubjects: [],
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
  const aviationBackgroundRef = useRef(null);
  const documentsRef = useRef(null);
  const declarationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Local Storage - Save form data every 2 hours
  useEffect(() => {
    // Load saved form data on mount
    const savedData = localStorage.getItem("admissionFormData");
    const savedTimestamp = localStorage.getItem("admissionFormTimestamp");

    if (savedData && savedTimestamp) {
      const now = new Date().getTime();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

      if (now - parseInt(savedTimestamp) < twoHours) {
        const parsedData = JSON.parse(savedData);
        setForm(parsedData.form || initialState);
        setSameAddress(parsedData.sameAddress || false);
        setDisclaimerAccepted(parsedData.disclaimerAccepted || false);
      } else {
        // Clear expired data
        localStorage.removeItem("admissionFormData");
        localStorage.removeItem("admissionFormTimestamp");
      }
    }
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever form changes
    const dataToSave = {
      form,
      sameAddress,
      disclaimerAccepted,
    };

    localStorage.setItem("admissionFormData", JSON.stringify(dataToSave));
    localStorage.setItem(
      "admissionFormTimestamp",
      new Date().getTime().toString(),
    );

    // Set up auto-clear after 2 hours
    const timeout = setTimeout(
      () => {
        localStorage.removeItem("admissionFormData");
        localStorage.removeItem("admissionFormTimestamp");
      },
      2 * 60 * 60 * 1000,
    ); // 2 hours

    return () => clearTimeout(timeout);
  }, [form, sameAddress, disclaimerAccepted]);

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

  // ✅ ADD THIS NEW CODE HERE - Backend Keep-Alive
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await fetch(`${API_URL}/health`);
        console.log("✓ Backend awake");
      } catch (error) {
        console.log("Ping failed:", error.message);
      }
    };

    // Ping immediately on mount
    pingBackend();

    // Then ping every 10 minutes
    const interval = setInterval(pingBackend, 10 * 60 * 1000);

    // Stop when user leaves page
    return () => clearInterval(interval);
  }, [API_URL]);

  const medicalOptions = [
    { value: "", label: "Select Medical Status" },
    { value: "Medical Class 1", label: "Medical Class 1" },
    { value: "Medical Class 2", label: "Medical Class 2" },
    { value: "N/A", label: "N/A" },
  ];

  const paymentOptions = [
    { value: "", label: "Select Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Net Banking", label: "Net Banking" },
    { value: "Cheque", label: "Cheque" },
  ];

  const courseOptions = [
    { value: "", label: "Select Course" },
    { value: "DGCA Ground Classes", label: "DGCA Ground Classes" },
    { value: "ATPL Theory Training", label: "ATPL Theory Training" },
    {
      value: "Airline Preparatory Training",
      label: "Airline Preparatory Training",
    },
    { value: "ADAPT Training", label: "ADAPT Training" },
    {
      value: "Drone Pilot License Training",
      label: "Drone Pilot License Training",
    },
    {
      value: "Safety Management System Course",
      label: "Safety Management System Course",
    },
  ];

  const dgcaSubjectOptions = [
    { value: "Air Navigation", label: "Air Navigation" },
    { value: "Aviation Meteorology", label: "Aviation Meteorology" },
    { value: "Air Regulations", label: "Air Regulations" },
    { value: "Technical General", label: "Technical General" },
    { value: "Radio Telephony (RTR)", label: "Radio Telephony (RTR)" },
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

  const handleDGCASubjectChange = (e) => {
    const { value, checked } = e.target;
    let updatedSubjects = [...form.dgcaSubjects];

    if (checked) {
      updatedSubjects.push(value);
    } else {
      updatedSubjects = updatedSubjects.filter((subject) => subject !== value);
    }

    setForm({ ...form, dgcaSubjects: updatedSubjects });

    if (fieldErrors.dgcaSubjects) {
      setFieldErrors((prev) => ({ ...prev, dgcaSubjects: "" }));
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

    // Clear previous errors for this field
    setFileErrors((prev) => ({ ...prev, [fieldName]: "" }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    // If no file selected (user cancelled), show error
    if (!file) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: "Please select a file to upload",
      }));
      return;
    }

    // Define valid types for each field
    let validTypes = [];
    let formatMessage = "";

    if (
      fieldName === "aadhar" ||
      fieldName === "marksheet10" ||
      fieldName === "marksheet12"
    ) {
      validTypes = ["application/pdf"];
      formatMessage = "Only PDF files are allowed";
    } else if (
      fieldName === "photo" ||
      fieldName === "signature" ||
      fieldName === "parentSignature"
    ) {
      validTypes = ["image/jpeg", "image/jpg", "image/png"];
      formatMessage = "Only JPEG and PNG files are allowed";
    } else if (fieldName === "paymentReceipt") {
      validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      formatMessage = "Only PNG, JPEG, and PDF files are allowed";
    } else {
      validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      formatMessage = "Only PNG, JPEG, and PDF files are allowed";
    }

    // Validate file type
    if (!validTypes.includes(file.type)) {
      setFileErrors((prev) => ({ ...prev, [fieldName]: formatMessage }));
      e.target.value = "";
      // Remove file from state if it exists
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[fieldName];
        return newFiles;
      });
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `File size must be less than 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
      e.target.value = "";
      // Remove file from state if it exists
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[fieldName];
        return newFiles;
      });
      return;
    }

    // Validate image dimensions for photo and signatures
    if (
      fieldName === "photo" ||
      fieldName === "signature" ||
      fieldName === "parentSignature"
    ) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = () => {
          let isValid = false;
          let errorMsg = "";

          if (fieldName === "photo") {
            // Photo: 413 x 531 pixels
            if (img.width === 413 && img.height === 531) {
              isValid = true;
            } else {
              errorMsg = `Photo dimensions must be exactly 413 x 531 pixels. Your image is ${img.width} x ${img.height} pixels`;
            }
          } else if (
            fieldName === "signature" ||
            fieldName === "parentSignature"
          ) {
            // Signature: 300 x 150 pixels
            if (img.width === 300 && img.height === 150) {
              isValid = true;
            } else {
              errorMsg = `Signature dimensions must be exactly 300 x 150 pixels. Your image is ${img.width} x ${img.height} pixels`;
            }
          }

          if (isValid) {
            setFiles((prev) => ({ ...prev, [fieldName]: file }));
            setStatus("");
          } else {
            setFileErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
            e.target.value = "";
          }
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      // For non-image files (PDFs), save directly
      setFiles({ ...files, [fieldName]: file });
      setStatus("");
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validateForm = () => {
    const errors = {};

    // Student Details validation
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

    // Parent Details validation
    if (!form.parentName.trim())
      errors.parentName = "Parent/Guardian name is required";
    if (!form.relationship.trim())
      errors.relationship = "Relationship is required";
    if (!form.parentMobile.trim())
      errors.parentMobile = "Parent mobile number is required";
    else if (form.parentMobile.length !== 10)
      errors.parentMobile = "Mobile number must be 10 digits";
    if (!form.occupation.trim()) errors.occupation = "Occupation is required";

    // Academic Details validation
    if (!form.school.trim()) errors.school = "School/College name is required";
    if (!form.classYear)
      errors.classYear = "Current education qualification is required";
    if (!form.board.trim()) errors.board = "Board/University is required";

    // Class 12 stream validation - only required if classYear involves Class 12
    if (
      form.classYear &&
      (form.classYear.includes("12th") ||
        form.classYear === "Graduation" ||
        form.classYear === "Post Graduation")
    ) {
      if (!form.class12Stream)
        errors.class12Stream = "Class 12 stream is required";
    }

    // Course Details validation
    if (!form.course) errors.course = "Course selection is required";

    // Fee Status validation
    if (!form.feesPaid) errors.feesPaid = "Please select fees paid status";
    if (form.feesPaid === "Yes") {
      if (!form.installment)
        errors.installment = "Please select installment option";
      if (!form.paymentMode) errors.paymentMode = "Payment mode is required";
      if (form.paymentMode !== "Cash" && !form.transactionId.trim())
        errors.transactionId = "Transaction ID is required";
      if (!form.paymentDate) errors.paymentDate = "Payment date is required";
      if (!files.paymentReceipt)
        errors.paymentReceipt = "Payment confirmation receipt is required";
    }

    // Aviation Background validation
    if (!form.previousFlyingExperience)
      errors.previousFlyingExperience =
        "Please select flying experience status";
    if (!form.dgcaPapersCleared)
      errors.dgcaPapersCleared = "Please select DGCA papers status";
    if (form.dgcaPapersCleared === "Yes" && form.dgcaSubjects.length === 0)
      errors.dgcaSubjects = "Please select at least one DGCA subject";

    // Document validation - check if files are uploaded
    if (!files.aadhar) errors.aadhar = "Aadhaar card (PDF) is required";
    if (!files.marksheet10)
      errors.marksheet10 = "10th marksheet (PDF) is required";
    if (!files.marksheet12)
      errors.marksheet12 = "12th marksheet (PDF) is required";
    if (!files.photo) errors.photo = "Passport size photo is required";
    if (!files.signature) errors.signature = "Student signature is required";
    if (!files.parentSignature)
      errors.parentSignature = "Parent/Guardian signature is required";

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
      classYear: academicDetailsRef,
      class12Stream: academicDetailsRef,
      board: academicDetailsRef,
      course: courseDetailsRef,
      feesPaid: feeStructureRef,
      installment: feeStructureRef,
      paymentMode: feeStructureRef,
      transactionId: feeStructureRef,
      paymentDate: feeStructureRef,
      paymentReceipt: feeStructureRef,
      previousFlyingExperience: aviationBackgroundRef,
      dgcaPapersCleared: aviationBackgroundRef,
      dgcaSubjects: aviationBackgroundRef,
      aadhar: documentsRef,
      marksheet10: documentsRef,
      marksheet12: documentsRef,
      photo: documentsRef,
      signature: documentsRef,
      parentSignature: documentsRef,
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
    Object.keys(form).forEach((key) => {
      if (key === "dgcaSubjects") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });
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

      // Clear localStorage after successful submission
      localStorage.removeItem("admissionFormData");
      localStorage.removeItem("admissionFormTimestamp");

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
                  placeholder="Enter Full Name"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      "",
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
                  placeholder="Enter 10-digit Mobile Number"
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
                  placeholder="Enter Complete Permanent Address"
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
                  placeholder="Enter Complete Current Address"
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
                  placeholder="Enter DGCA Number"
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
                  placeholder="Enter EGCA Number"
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
                  placeholder="Enter Full Name of Parent/Guardian"
                  inputMode="text"
                  pattern="[A-Za-z\s]+"
                  title="Only alphabets allowed"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      "",
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
                      "",
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
                  placeholder="Enter 10-digit Mobile Number"
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
                      "",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  School/College Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="school"
                  value={form.school}
                  placeholder="Institution Name"
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
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="classYear"
                  value={form.classYear}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
                    fieldErrors.classYear
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">— Please choose an option —</option>
                  <option value="12th Appearing">12th Appearing</option>
                  <option value="12th Passed">12th Passed</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
                {fieldErrors.classYear && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.classYear}
                  </p>
                )}
              </div>

              {form.classYear &&
                (form.classYear.includes("12th") ||
                  form.classYear === "Graduation" ||
                  form.classYear === "Post Graduation") && (
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Class 12 Stream<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="class12Stream"
                      value={form.class12Stream}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-white ${
                        fieldErrors.class12Stream
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">— Select Stream —</option>
                      <option value="Class 12th with Physics and Maths">
                        Class 12th with Physics and Maths
                      </option>
                      <option value="Class 12th without Physics and Maths">
                        Class 12th without Physics and Maths
                      </option>
                    </select>
                    {fieldErrors.class12Stream && (
                      <p className="text-red-600 text-sm mt-1">
                        {fieldErrors.class12Stream}
                      </p>
                    )}
                  </div>
                )}

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

          {/* 5. Fee Status */}
          <section className="mb-12" ref={feeStructureRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              5. Fee Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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

                  {form.paymentMode && form.paymentMode !== "Cash" && (
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">
                        Transaction ID<span className="text-red-500">*</span>
                      </label>
                      <input
                        name="transactionId"
                        value={form.transactionId}
                        placeholder="Enter transaction ID"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                          fieldErrors.transactionId
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        onChange={handleChange}
                      />
                      {fieldErrors.transactionId && (
                        <p className="text-red-600 text-sm mt-1">
                          {fieldErrors.transactionId}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Payment Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={form.paymentDate}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                        fieldErrors.paymentDate
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      onChange={handleChange}
                    />
                    {fieldErrors.paymentDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {fieldErrors.paymentDate}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Payment Confirmation Receipt
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-2">
                      PNG, JPEG, and PDF formats are accepted (Max 2MB)
                    </p>
                    <input
                      type="file"
                      name="paymentReceipt"
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                        fileErrors.paymentReceipt || fieldErrors.paymentReceipt
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                      onChange={handleFile}
                    />
                    {(fileErrors.paymentReceipt ||
                      fieldErrors.paymentReceipt) && (
                      <p className="text-red-600 text-sm mt-1">
                        {fileErrors.paymentReceipt ||
                          fieldErrors.paymentReceipt}
                      </p>
                    )}
                    {files.paymentReceipt &&
                      !fileErrors.paymentReceipt &&
                      !fieldErrors.paymentReceipt && (
                        <p className="text-green-600 text-sm mt-1">
                          ✓ {files.paymentReceipt.name}
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 6. Aviation Background */}
          <section className="mb-12" ref={aviationBackgroundRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              6. Aviation Background
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Previous Flying Experience
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousFlyingExperience"
                      value="Yes"
                      checked={form.previousFlyingExperience === "Yes"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousFlyingExperience"
                      value="No"
                      checked={form.previousFlyingExperience === "No"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
                {fieldErrors.previousFlyingExperience && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.previousFlyingExperience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Have You Cleared Any DGCA Papers?
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dgcaPapersCleared"
                      value="Yes"
                      checked={form.dgcaPapersCleared === "Yes"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dgcaPapersCleared"
                      value="No"
                      checked={form.dgcaPapersCleared === "No"}
                      className="mr-2 text-blue-500 focus:ring-blue-300"
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
                {fieldErrors.dgcaPapersCleared && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.dgcaPapersCleared}
                  </p>
                )}
              </div>

              {form.dgcaPapersCleared === "Yes" && (
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    If Yes, specify subjects:
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {dgcaSubjectOptions.map((subject) => (
                      <label key={subject.value} className="flex items-center">
                        <input
                          type="checkbox"
                          value={subject.value}
                          checked={form.dgcaSubjects.includes(subject.value)}
                          className="mr-3 text-blue-500 focus:ring-blue-300 w-4 h-4"
                          onChange={handleDGCASubjectChange}
                        />
                        <span className="text-gray-700">{subject.label}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.dgcaSubjects && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.dgcaSubjects}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 7. Documents Submitted */}
          <section className="mb-12" ref={documentsRef}>
            <h3
              className="text-2xl font-bold text-gray-900 mb-3 pb-3"
              style={{ color: "#003366" }}
            >
              7. Documents Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Note: Please upload documents in the specified formats only (Max
              2MB per file)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Aadhaar Card (PDF)<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="aadhar"
                  accept="application/pdf"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.aadhar || fieldErrors.aadhar
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                {(fileErrors.aadhar || fieldErrors.aadhar) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.aadhar || fieldErrors.aadhar}
                  </p>
                )}
                {files.aadhar && !fileErrors.aadhar && !fieldErrors.aadhar && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ {files.aadhar.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  10th Marksheet (PDF)<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="marksheet10"
                  accept="application/pdf"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.marksheet10 || fieldErrors.marksheet10
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                {(fileErrors.marksheet10 || fieldErrors.marksheet10) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.marksheet10 || fieldErrors.marksheet10}
                  </p>
                )}
                {files.marksheet10 &&
                  !fileErrors.marksheet10 &&
                  !fieldErrors.marksheet10 && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.marksheet10.name}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  12th Marksheet (PDF)<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="marksheet12"
                  accept="application/pdf"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.marksheet12 || fieldErrors.marksheet12
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                {(fileErrors.marksheet12 || fieldErrors.marksheet12) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.marksheet12 || fieldErrors.marksheet12}
                  </p>
                )}
                {files.marksheet12 &&
                  !fileErrors.marksheet12 &&
                  !fieldErrors.marksheet12 && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.marksheet12.name}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Passport Size Photo (JPEG, PNG)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg, image/jpg, image/png"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.photo || fieldErrors.photo
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Required dimensions: 413 x 531 pixels (35mm x 45mm at 300
                  DPI), JPG/JPEG/PNG only, Max 2MB
                </p>
                <a
                  href="https://www.reduceimages.com/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                >
                  Click Here to Resize Your Photo
                </a>
                {(fileErrors.photo || fieldErrors.photo) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.photo || fieldErrors.photo}
                  </p>
                )}
                {files.photo && !fileErrors.photo && !fieldErrors.photo && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ {files.photo.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Student Signature (JPEG, PNG)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="signature"
                  accept="image/jpeg, image/jpg, image/png"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.signature || fieldErrors.signature
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Required dimensions: 300 x 150 pixels, JPG/JPEG/PNG only, Max
                  2MB
                </p>
                <a
                  href="https://www.reduceimages.com/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                >
                  Click Here to Resize Your Signature
                </a>
                {(fileErrors.signature || fieldErrors.signature) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.signature || fieldErrors.signature}
                  </p>
                )}
                {files.signature &&
                  !fileErrors.signature &&
                  !fieldErrors.signature && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.signature.name}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Parent/Guardian Signature (JPEG, PNG)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="parentSignature"
                  accept="image/jpeg, image/jpg, image/png"
                  className={`w-full px-4 py-3 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-blue-300 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 ${
                    fileErrors.parentSignature || fieldErrors.parentSignature
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onChange={handleFile}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Required dimensions: 300 x 150 pixels, JPG/JPEG/PNG only, Max
                  2MB
                </p>
                <a
                  href="https://www.reduceimages.com/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                >
                  Click Here to Resize Your Signature
                </a>
                {(fileErrors.parentSignature ||
                  fieldErrors.parentSignature) && (
                  <p className="text-red-600 text-sm mt-1">
                    {fileErrors.parentSignature || fieldErrors.parentSignature}
                  </p>
                )}
                {files.parentSignature &&
                  !fileErrors.parentSignature &&
                  !fieldErrors.parentSignature && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {files.parentSignature.name}
                    </p>
                  )}
              </div>
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
