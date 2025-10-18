// import * as Icons from "react-icons/vsc"
// import { useDispatch } from "react-redux"
// import { NavLink, matchPath, useLocation } from "react-router-dom"

// import { resetCourseState } from "../../../slices/courseSlice"

// export default function SidebarLink({ link, iconName }) {
//   const Icon = Icons[iconName]
//   const location = useLocation()
//   const dispatch = useDispatch()

//   const matchRoute = (route) => {
//     return matchPath({ path: route }, location.pathname)
//   }

//   return (
//     <NavLink
//       to={link.path}
//       onClick={() => dispatch(resetCourseState())}
//       // className={`relative px-8 py-2 text-sm font-medium ${
//       //   matchRoute(link.path)
//       //     ? "bg-yellow-800 text-yellow-50"
//       //     : "bg-opacity-0 text-richblack-300"
//       // } transition-all duration-200`}
//       className={`relative block w-full px-4 md:px-8 py-2 text-sm font-medium ${
//         matchRoute(link.path)
//           ? "bg-yellow-800 text-yellow-50"
//           : "bg-opacity-0 text-richblack-300"
//       } transition-all duration-200`}

//     >
//       <span
//         className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
//           matchRoute(link.path) ? "opacity-100" : "opacity-0"
//         }`}
//       ></span>
//       <div className="flex items-center gap-x-2">
//         {/* Icon Goes Here */}
//         <Icon className="text-lg md:text-xl" />
//         <span className="text-sm md:text-base">{link.name}</span>
//       </div>
//     </NavLink>
//   )
// }


import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import { resetCourseState } from "../../../slices/courseSlice"
import { apiConnector } from "../../../services/apiConnector"
import { categories } from "../../../services/apis"

export default function SidebarLink({ link, iconName, onClick }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const [subLinks, setSubLinks] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  // Fetch sub-links for Catalog
  useEffect(() => {
    if (link.name === "Catalog") {
      ;(async () => {
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API)
          setSubLinks(res.data.data || [])
        } catch (err) {
          console.log("Could not fetch categories", err)
        }
      })()
    }
  }, [link.name])

  const handleClick = () => {
    if (link.name === "Catalog") {
      setIsDropdownOpen(!isDropdownOpen)
    }
    if (onClick) onClick()
    dispatch(resetCourseState())
  }

  return (
    <div className="w-full">
      <NavLink
        to={link.path || "#"}
        onClick={handleClick}
        className={`relative block w-full px-4 md:px-8 py-2 text-sm font-medium ${
          matchRoute(link.path)
            ? "bg-yellow-800 text-yellow-50"
            : "bg-opacity-0 text-richblack-300"
        } transition-all duration-200`}
      >
        <span
          className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
            matchRoute(link.path) ? "opacity-100" : "opacity-0"
          }`}
        ></span>
        <div className="flex items-center gap-x-2">
          <Icon className="text-lg md:text-xl" />
          <span className="text-sm md:text-base">{link.name}</span>
        </div>
      </NavLink>

      {/* Catalog Dropdown */}
      {link.name === "Catalog" && isDropdownOpen && subLinks.length > 0 && (
        <div className="ml-4 md:ml-8 mt-1 flex flex-col gap-1">
          {subLinks.map((subLink) => (
            <NavLink
              key={subLink._id}
              to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
              onClick={onClick} // close sidebar on mobile if needed
              className="px-4 py-1 text-sm text-richblack-300 hover:bg-richblack-700 rounded"
            >
              {subLink.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}