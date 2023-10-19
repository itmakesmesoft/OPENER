'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState } from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

const Carousel = () => {
  const [sliderRef, setSliderRef] = useState<any>(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
    <div className="p-4 relative">
      <Slider ref={setSliderRef} {...settings}>
        <div>
          <div className="h-[300px] bg-slate-300">hello</div>
        </div>
        <div>
          <div className="h-[300px] bg-slate-300">OPENER</div>
        </div>
      </Slider>
      <button
        onClick={sliderRef?.slickPrev}
        className="absolute z-10 p-4 top-[150px] left-[1rem]"
      >
        <GrFormPrevious fontSize="1.5em" />
      </button>
      <button
        onClick={sliderRef?.slickNext}
        className="absolute z-10 p-4 top-[150px] right-[1rem]"
      >
        <GrFormNext fontSize="1.5em" />
      </button>
    </div>
  );
};

export default Carousel;
