import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Resetting Password...")
    // dispatch(setLoading(true))
    try {
      // new update
      const body = { password, confirmPassword, token }


      // const response = await apiConnector("POST", RESETPASSWORD_API, {
      //   password,
      //   confirmPassword,
      //   token,
      // })

      // new update 
      const response = await apiConnector("POST", endpoints.RESETPASSTOKEN_API, body)

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to reset password")
      }

      toast.success(response.data.message || "Password Reset Successfully")
      if (navigate) navigate("/login")
      // new update
      // return { success: true, data: response.data }
    } catch (err) {
      console.log("RESETPASSWORD ERROR............", err)

      // new update
      const msg = err?.response?.data?.message || err?.message || "Something went wrong while resetting password"

      toast.error(msg)
      // new update
      // return { success: false, error: msg }
    } finally {
      // new update
        toast.dismiss(toastId)
        // dispatch(setLoading(false))
      }
      // toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}






// import React, { useState } from "react"
// import { useForm } from "react-hook-form"
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

// import { changePassword } from "../../../../services/operations/SettingsAPI"
// import IconBtn from "../../../Common/IconBtn"

// export default function UpdatePassword() {
//   const { token } = useSelector((state) => state.auth)
//   const navigate = useNavigate()

//   const [showOldPassword, setShowOldPassword] = useState(false)
//   const [showNewPassword, setShowNewPassword] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm()

//   const submitPasswordForm = async (data) => {
//     // console.log("password Data - ", data)
//     try {
//       await changePassword(token, data)
//     } catch (error) {
//       console.log("ERROR MESSAGE - ", error.message)
//     }
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit(submitPasswordForm)}>
//         <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
//           <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
//           <div className="flex flex-col gap-5 lg:flex-row">
//             <div className="relative flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="oldPassword" className="lable-style">
//                 Current Password
//               </label>
//               <input
//                 type={showOldPassword ? "text" : "password"}
//                 name="oldPassword"
//                 id="oldPassword"
//                 placeholder="Enter Current Password"
//                 className="form-style"
//                 {...register("oldPassword", { required: true })}
//               />
//               <span
//                 onClick={() => setShowOldPassword((prev) => !prev)}
//                 className="absolute right-3 top-[38px] z-[10] cursor-pointer"
//               >
//                 {showOldPassword ? (
//                   <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//                 ) : (
//                   <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//                 )}
//               </span>
//               {errors.oldPassword && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   Please enter your Current Password.
//                 </span>
//               )}
//             </div>
//             <div className="relative flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="newPassword" className="lable-style">
//                 New Password
//               </label>
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 name="newPassword"
//                 id="newPassword"
//                 placeholder="Enter New Password"
//                 className="form-style"
//                 {...register("newPassword", { required: true })}
//               />
//               <span
//                 onClick={() => setShowNewPassword((prev) => !prev)}
//                 className="absolute right-3 top-[38px] z-[10] cursor-pointer"
//               >
//                 {showNewPassword ? (
//                   <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//                 ) : (
//                   <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//                 )}
//               </span>
//               {errors.newPassword && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   Please enter your New Password.
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={() => {
//               navigate("/dashboard/my-profile")
//             }}
//             className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
//           >
//             Cancel
//           </button>
//           <IconBtn type="submit" text="Update" />
//         </div>
//       </form>
//     </>
//   )
// }

