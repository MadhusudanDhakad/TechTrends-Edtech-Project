import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { resetPassword } from "../services/operations/authAPI"
// new update
// import { resetPasswordAPI } from "../services/operations/authAPI"

function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()


    // New update 
    if (!password || !confirmPassword) {
      toast.error("Pelase fill both password fields") 
      return 
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match")
      return
    }


    const token = location.pathname.split("/").at(-1)
    // new update
    const result = await resetPassword( {password, confirmPassword, token} )
    if (result.success) {
      navigate("/login")
    }
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new password
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="form-style w-full !pr-10"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="form-style w-full !pr-10"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword









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

