"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import verifiedImg from "@/public/assets/images/verified.gif";
import unVerifiedImg from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";

const EmailVerificationPage = () => {
  const { token } = useParams(); // ✅ Get the token from the URL
  const [isVerified, setIsVerified] = useState(null); // null = loading, true/false = result
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    // 🧩 Verify email as soon as the component mounts
    const verify = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });

        if (data?.success) {
          // ✅ Email verification successful
          setIsVerified(true);
          setMessage("Your email has been successfully verified!");
        } else {
          // ❌ Server returned failure response
          setIsVerified(false);
          setMessage(data?.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        // ⚠️ Handle unexpected API or network errors
        setIsVerified(false);
        setMessage(
          error.response?.data?.message ||
            "An error occurred during verification."
        );
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md w-full shadow-lg rounded-2xl">
        <CardContent className="p-6 text-center space-y-4">
          {/* 🕓 Show loading state while verifying */}
          {isVerified === null && (
            <div>
              <p className="text-lg font-medium text-gray-700">{message}</p>
            </div>
          )}

          {/* ✅ Show success message */}
          {isVerified === true && (
            <div>
              <Image
                src={verifiedImg}
                alt="Email Verified"
                className="mx-auto w-48 h-48"
                priority
              />
              <p className="mt-4 text-lg font-semibold text-green-600">
                {message}
              </p>
            </div>
          )}

          {/* ❌ Show failed message */}
          {isVerified === false && (
            <div>
              <Image
                src={unVerifiedImg}
                alt="Verification Failed"
                className="mx-auto w-48 h-48"
                priority
              />
              <p className="mt-4 text-lg font-semibold text-red-600">
                {message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
