import { useState } from "react"
// import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { VscSignOut, VscMenu, VscClose } from "react-icons/vsc"
import { IoIosArrowBack } from "react-icons/io"


import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
// import { link } from "react-router-dom"
// import { link } from "fs"
// import logo from "../../../assets/Logo/logo_Full.png"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  
  // return (
  //   <>
  //     <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
  //       <div className="flex flex-col">
  //         {sidebarLinks.map((link) => {
  //           if (link.type && user?.accountType !== link.type) return null
  //           return (
  //             <SidebarLink key={link.id} link={link} iconName={link.icon} />
  //           )
  //         })}
  //       </div>
  //       <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
  //       <div className="flex flex-col">
  //         <SidebarLink
  //           link={{ name: "Settings", path: "/dashboard/settings" }}
  //           iconName="VscSettingsGear"
  //         />
  //         <button
  //           onClick={() =>
  //             setConfirmationModal({
  //               text1: "Are you sure?",
  //               text2: "You will be logged out of your account.",
  //               btn1Text: "Logout",
  //               btn2Text: "Cancel",
  //               btn1Handler: () => dispatch(logout(navigate)),
  //               btn2Handler: () => setConfirmationModal(null),
  //             })
  //           }
  //           className="px-8 py-2 text-sm font-medium text-richblack-300"
  //         >
  //           <div className="flex items-center gap-x-2">
  //             <VscSignOut className="text-lg" />
  //             <span>Logout</span>
  //           </div>
  //         </button>
  //       </div>
  //     </div>
  //     {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
  //   </>
  // )

  const handleLinkClick = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger for mobile */}

       <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-16 left-4 z-[1000] text-2xl text-richblack-25"
        >
          <IoIosArrowBack
            size={28}
            className={`${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-300`}
            />
            {/* {isOpen ? <VscClose /> : <VscMenu />} */}
        </button>



      {/* <div className="fixed top-4 left-4 md:static z-[1001"> 
        <img src={logo} alt="logo" className="w-32 md:w-auto" />
      </div> */}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-[220px] bg-richblack-800 border-r border-richblack-700 py-10 mt-14
        transform transition-transform duration-300 z-[999]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink 
                key={link.id} 
                link={link} 
                iconName={link.icon} 
                onClick={handleLinkClick}
              />
            )
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            onClick={handleLinkClick}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
