import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';

interface ChoiceCardProps {
  emoji: string;
  text: string;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ emoji, text }) => (
  <div className="choice-card">
    <div className="emoji">{emoji}</div>
    <span>{text}</span>
  </div>
);

interface SettingSwiperProps {
  title: string;
  options: Array<{ value: string; emoji: string; text: string }>;
  onSelectionChange: (value: string) => void;
  className: string;
}

export const SettingSwiper: React.FC<SettingSwiperProps> = ({
  title,
  options,
  onSelectionChange,
  className
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // Get random initial slide (excluding first and last)
  const getRandomInitialSlide = () => {
    const minIndex = 1;
    const maxIndex = options.length - 2;
    return minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
  };

  const [initialSlide] = useState(() => getRandomInitialSlide());

  useEffect(() => {
    if (swiper) {
      // Set initial selection based on the initial slide
      const initialOption = options[initialSlide];
      if (initialOption) {
        onSelectionChange(initialOption.value);
      }
    }
  }, [swiper, initialSlide, options, onSelectionChange]);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex;
    const selectedOption = options[activeIndex];
    if (selectedOption) {
      onSelectionChange(selectedOption.value);
    }
  };

  return (
    <div className="setting-section">
      <h2>{title}</h2>
      <div className={className}>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
          initialSlide={initialSlide}
          navigation={{
            nextEl: `.${className} .swiper-button-next`,
            prevEl: `.${className} .swiper-button-prev`,
          }}
          pagination={{
            el: `.${className} .swiper-pagination`,
            clickable: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            968: { slidesPerView: 3 }
          }}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          className="swiper"
        >
          {options.map((option, index) => (
            <SwiperSlide key={index} data-value={option.value}>
              <ChoiceCard emoji={option.emoji} text={option.text} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev" aria-label="Previous slide"></div>
        <div className="swiper-button-next" aria-label="Next slide"></div>
      </div>
    </div>
  );
};