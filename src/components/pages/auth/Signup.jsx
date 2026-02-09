import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { FaGoogle, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

// ================= VALIDATION =================

const schema = yup.object({
  username: yup.string().required("Full name required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// ================= COMPONENT =================

export default function Signup() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ================= SUBMIT =================

  const onSubmit = async (data) => {

    setLoading(true);

    try {

      const res = await fetch("/api/v1/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Registration failed");

      toast.success("Account created");

      navigate("/login");

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }
  };

  // ================= UI =================

  return (

    <div className="min-h-screen flex items-center justify-center bg-white">

      {/* Main Card */}
      <div className="w-[1100px] h-[600px] bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200">

        {/* LEFT SIDE - Brand Panel */}
        <div className="w-1/2 bg-gradient-to-br from-[#5a4fff] via-[#5146f2] to-[#4338e0] rounded-r-[80px] flex flex-col items-center justify-center p-12 relative overflow-hidden">
          
          {/* Decorative circles */}
          {/* <div className="absolute top-10 left-8 w-40 h-40 bg-white bg-opacity-15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white bg-opacity-10 rounded-full blur-3xl"></div> */}
          
          {/* Logo and text */}
          <div className="relative z-10 text-center">
            {/* Logo */}
            <div className="mb-8">
              <img src="/Logo3.png" alt="Placfy" className="w-20 h-20 rounded-lg mx-auto shadow-lg" />
            </div>
            
            {/* Brand text */}
            <h1 className="text-white text-4xl font-bold mb-4">Placfy</h1>
            
            {/* Tagline */}
            <h2 className="text-white text-3xl font-bold leading-snug mb-8">
              Learn From World's Best Instructors Around The World.
            </h2>
            
            {/* Illustration with emojis */}
            {/* <div className="flex justify-center gap-8 text-6xl my-8">
              <span className="hover:scale-125 transition transform duration-300">🚀</span>
              <span className="hover:scale-125 transition transform duration-300">👨‍💻</span>
              <span className="hover:scale-125 transition transform duration-300">✉️</span>
            </div> */}
            
            {/* Description */}
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
              Join thousands of students learning from world-class instructors and transform your skills
            </p>
          </div>
        </div>


        {/* RIGHT SIDE - Form */}
        <div className="w-1/2 flex flex-col justify-center px-14">

          {/* Language */}
                <div className="text-right text-sm text-slate-600 mb-8 font-medium mt-1">
                🌐 English (USA)
                </div>


                {/* Title */}
                <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Create Account
                </h2>
                <p className="text-slate-600 text-sm">Join Placfy today and start learning</p>
                </div>


                {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Full Name */}
            <div>
              <input
                {...register("username")}
                placeholder="Full Name"
                className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors"
              />
              {errors.username && <p className="text-red-500 text-xs mt-2">{errors.username?.message}</p>}
            </div>


            {/* Email */}
            <div>
              <input
                {...register("email")}
                placeholder="Email Address"
                className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email?.message}</p>}
            </div>


            {/* Password */}
            <div>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password?.message}</p>}
            </div>


            {/* Confirm Password */}
            <div>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-2">{errors.confirmPassword?.message}</p>}
            </div>


            {/* Terms */}
            <div className="flex items-center text-sm mt-4 pt-2">
              <input type="checkbox" defaultChecked className="mr-3 w-4 h-4 accent-[#5a4fff] rounded cursor-pointer"/>
              <span className="text-slate-600">
                I agree to{' '}
                <a href="#" className="text-[#5a4fff] hover:underline font-semibold">terms of service</a>
                {' '}and{' '}
                <a href="#" className="text-[#5a4fff] hover:underline font-semibold">privacy policy</a>
              </span>
            </div>


            {/* Button */}
            <button
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-[#5a4fff] to-[#4338e0] hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>


          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="mx-3 text-xs text-slate-600 font-semibold">
              OR SIGN UP WITH
            </span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>


          {/* Social */}
          <div className="flex justify-center gap-3">

            <Social icon={<FaGoogle />} />
            <Social icon={<FaFacebookF />} />
            <Social icon={<FaInstagram />} />
            <Social icon={<FaTwitter />} />
            <Social icon={<FaLinkedinIn />} />

          </div>


          {/* Login */}
          <div className="text-center text-sm mt-8 text-slate-600">

            Already have an account?

            <button
              onClick={() => navigate("/login")}
              className="text-[#5a4fff] ml-2 font-bold hover:underline"
            >
              Sign In
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}


// ================= SOCIAL =================

function Social({ icon }) {

  return (

    <button className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-[#f6f8ff] hover:border-[#5a4fff] hover:text-[#5a4fff] transition-colors text-slate-600">
      {icon}
    </button>

  );

}