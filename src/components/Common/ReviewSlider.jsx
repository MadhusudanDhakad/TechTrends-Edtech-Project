import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
        try {
          const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (err) {
        console.log("Error fetching reviews: ", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // console.log(reviews)
  

  if  (loading) {
    return (
      <div className="flex justify-center items-center h-[200px] text-richblack-100">
        Loading reviews...
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="flex justify-center items-center h-[200px] text-richblue-100">
        No reviews yet. Be the first to add one!
      </div>
    )
  }

  return (
   <div className="text-white w-full">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto ">
        <Swiper
          slidesPerView={1} // default for mobile
          spaceBetween={20}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="reviewSwiper w-full"
          breakpoints={{
            640: { // sm
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: true,
            },
            768: { // md
              slidesPerView: 2,
              spaceBetween: 20,
              centeredSlides: true,
            },
            1024: { // lg
              slidesPerView: 3,
              spaceBetween: 20,
              centeredSlides: true,
            },
            1280: { // xl
              slidesPerView: 3,
              spaceBetween: 20,
              centeredSlides: true,
            },
          }}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i} className="!flex justify-center items-center">
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 w-full max-w-[300px]">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review?.review}
                </p>
                <div className="flex justify-center items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>

  )
}

export default ReviewSlider
