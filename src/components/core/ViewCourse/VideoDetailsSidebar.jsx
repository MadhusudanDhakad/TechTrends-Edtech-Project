import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../Common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal, isSidebarOpen, setIsSidebarOpen }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
     <>
      {/* Responsive Sidebar Wrapper */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-full md:h-[calc(100vh-3.5rem)] w-[80%] max-w-[350px] flex flex-col border-r border-richblack-700 bg-richblack-800 transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* ✅ Header Section */}
        <div className="mx-5 flex flex-col gap-3 border-b border-richblack-600 py-4 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between">
            {/* Back / Toggle Button */}
             <div
               onClick={() => {
                 navigate(`/dashboard/enrolled-courses`)
               }}
               className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
               title="back"
              >
               <IoIosArrowBack size={30} />
             </div>

            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* Section & Lecture List */}
        <div className="h-full overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              key={index}
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(course?._id)}
            >
              <div className="flex justify-between bg-richblack-600 px-5 py-3">
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <span
                  className={`transition-all duration-300 ${
                    activeStatus === course?._id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <BsChevronDown />
                </span>
              </div>

              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)

                        // 👇 Close sidebar automatically on mobile
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false)
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
