import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [OtpSent, setOtpSent] = useState(false);
  const [Otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const Host = 'http://localhost:3000/';

  const startLoader = () => {
    setLoading(true);
  };

  const stopLoader = () => {
    setLoading(false);
  };

  useEffect(() => {
    startLoader();
    stopLoader();
  }, []);

  const handleSendOTP = async () => {
    if (selectedOption === ""){
      alert("Please select user type: Admin or Student");
      return;
    }
    if (email) {
      startLoader();
      const response = await fetch(`${Host}api/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email }),
      });

      const json = await response.json();
      if (json.success) {
        setOtpSent(true);
        setTimeout(() => {
            stopLoader();
        }, 1500);
      } else {
        stopLoader();
        alert("Failed to send OTP.");
      }
    } else {
      alert("Please enter an email address.");
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    if (email && Otp) {
      const response = await fetch(`${Host}api/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, enteredOTP: Otp }),
      });

      const json = await response.json();
      if (json.success) {
        setIsPassword(true);
      } else {
        alert("Invalid OTP.");
      }
    } else {
      alert("Please enter an email and OTP.");
    }
  };

  const handleNewPassword = async (event) => {
    event.preventDefault();
    try{
        const response = await fetch(`${Host}api/auth/forgotPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password, user: selectedOption }),
        });
  
        const json = await response.json();
        if (json.success) {
          window.location.replace("http://192.168.3.169/");
        } else {
          throw new Error(json.message);
        }
      } catch(error){
        alert(error.message);
      }
  };

  const handleSubmit = () => {
    // Implement logic for handling the form submission
  };

  return (
    <div className="h-screen w-full flex justify-center items-center relative">
      <img
        src="/Images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      />
      <div className="place-content-center relative z-10 flex flex-col justify-center w-[350px]">
        <form
          className="max-w-[700px] w-full mx-auto bg-white p-8 px-8 rounded-lg"
          onSubmit={handleSubmit}
        >
          {isPassword ? (
            <>
              <div className="flex justify-center sticky top-0 bg-white py-2">
                <h2 className="text-2xl text-[#3dafaa] mb-4 font-bold">
                  Enter New Password
                </h2>
              </div>
              <div className="flex flex-col text-black py-2">
                <label>New Password</label>
                <input
                  className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                    type="submit"
                    className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                    onClick={handleNewPassword}
                    >
                    Update
                </button>
            </>
          ) : (
            <>
              <div className="flex justify-center sticky top-0 bg-white py-2">
                <h2 className="text-2xl text-[#3dafaa] mb-4 font-bold">
                  Forgot Password
                </h2>
              </div>
              
              {OtpSent ? (
                <>
                  <div className="flex flex-col text-black py-2">
                    <label>Enter Otp</label>
                    <input
                      className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                      type="Otp"
                      value={Otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </button>
                  <div className="flex">
                    <p className="text-gray-500">OTP sended to</p>
                    <p className="text-red-500 ml-1">{email}</p>
                  </div>
                </>
              ) : loading ? (
                <div className="flex justify-center">
                  <ClipLoader
                    color={"#3dafaa"}
                    loading={loading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <>
                  <div className="flex mt-1 justify-around">
                    <button
                      className={`px-4 py-2 rounded-full cursor-pointer border ${
                        selectedOption === "admin"
                          ? "bg-[#3dafaa] text-white"
                          : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white"
                      } outline-none focus:border-[#3dafaa]`}
                      onClick={() => setSelectedOption("admin")}
                      type="button"
                    >
                      Admin
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full cursor-pointer border ${
                        selectedOption === "student"
                          ? "bg-[#3dafaa] text-white"
                          : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white"
                      } outline-none focus:border-[#3dafaa]`}
                      onClick={() => setSelectedOption("student")}
                      type="button"
                    >
                      Student
                    </button>
                  </div>
                  <div className="flex flex-col text-black py-2">
                    <label>Email Id</label>
                    <input
                      className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                      type="otp"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                    onClick={handleSendOTP}
                  >
                    Send OTP
                  </button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;