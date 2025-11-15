// import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
// import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

// import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../Common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // console.log("All Course ", courses)

  return (
    <>
     <div className="rounded-xl border border-richblack-800 overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 bg-richblack-900 px-6 py-3 border-b border-richblack-800">
          <p className="text-sm font-medium uppercase text-richblack-100">Courses</p>
          <p className="text-sm font-medium uppercase text-richblack-100">Duration</p>
          <p className="text-sm font-medium uppercase text-richblack-100">Price</p>
          <p className="text-sm font-medium uppercase text-richblack-100">Actions</p>
        </div>

        {/* Body */}
        {courses.length === 0 ? (
          <div className="py-10 text-center text-2xl font-medium text-richblack-100">
            No courses found
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="
                grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] gap-6 
                px-6 py-8 border-b border-richblack-800
              "
            >
              {/* Course Column */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="md:h-[148px] md:w-[220px] rounded-lg object-cover"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-lg font-semibold text-richblack-5">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                      ? course.courseDescription
                          .split(" ")
                          .slice(0, TRUNCATE_LENGTH)
                          .join(" ") + "..."
                      : course.courseDescription}
                  </p>
                  <p className="text-[12px] text-white">
                    Created: {formatDate(course.createdAt)}
                  </p>

                  {course.status === COURSE_STATUS.DRAFT ? (
                    <p className="flex w-fit items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] text-pink-100">
                      <HiClock size={14} />
                      Drafted
                    </p>
                  ) : (
                    <p className="flex w-fit items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] text-yellow-100">
                      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                        <FaCheck size={8} />
                      </span>
                      Published
                    </p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <p className="md:text-left text-sm font-medium text-richblack-100">
                2hr 30min
              </p>

              {/* Price */}
              <p className="md:text-left text-sm font-medium text-richblack-100">
                ₹{course.price}
              </p>

              {/* Actions */}
              <div className="flex items-start gap-4">
                <button
                  disabled={loading}
                  onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                  className="transition-all hover:scale-110 text-yellow-400 hover:text-caribbeangreen-300"
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  disabled={loading}
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Do you want to delete this course?",
                      text2: "All the data related to this course will be deleted",
                      btn1Text: !loading ? "Delete" : "Loading...",
                      btn2Text: "Cancel",
                      btn1Handler: !loading
                        ? () => handleCourseDelete(course._id)
                        : () => {},
                      btn2Handler: !loading
                        ? () => setConfirmationModal(null)
                        : () => {},
                    })
                  }
                  className="transition-all hover:scale-110 text-[#f87171] hover:text-[#dc2626]"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

    </>
  )
}
