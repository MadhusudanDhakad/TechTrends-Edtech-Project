import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { IoIosArrowBack } from "react-icons/io"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

  // Sidebar visibility for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      // console.log("Course Data here... ", courseData.courseDetails)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {/* Pass toggle state to Sidebar */}
        <VideoDetailsSidebar
          setReviewModal={setReviewModal}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Video Section */}
        <div className="flex-1 overflow-auto h-[calc(100vh-3.5rem)] bg-richblack-900">
          <div className="mx-4 md:mx-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Floating Sidebar Toggle Button (Visible only on mobile) */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="fixed bottom-4 left-4 z-50 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-richblack-100 text-richblack-800 shadow-lg hover:scale-95 transition-transform md:hidden"
      >
        <IoIosArrowBack
          size={28}
          className={`${isSidebarOpen ? "rotate-180" : "rotate-0"} transition-transform duration-300`}
        />
      </button>



      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>

  )
}

