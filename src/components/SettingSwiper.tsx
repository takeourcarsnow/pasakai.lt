import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

interface ChoiceCardProps {
  emoji: string;
  text: string;
  onClick?: () => void;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ emoji, text, onClick }) => (
  <div className="choice-card" onClick={onClick}>
    <div className="emoji">
      {emoji.startsWith('http') ? <Image src={emoji} alt={text} width={50} height={50} /> : emoji}
    </div>
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
  const initialSelectionApplied = useRef(false);

  useEffect(() => {
    // Apply initial selection once after the Swiper instance is ready.
    if (swiper && !initialSelectionApplied.current) {
      const initialOption = options[initialSlide];
      if (initialOption) {
        onSelectionChange(initialOption.value);
      }
      initialSelectionApplied.current = true;
    }
    // We intentionally omit options and onSelectionChange from the
    // dependency list to avoid re-triggering this effect if the parent
    // updates selection (which could cause a loop). The initial selection
    // should only be applied once when Swiper becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiper, initialSlide]);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex;
    const selectedOption = options[activeIndex];
    if (selectedOption) {
      onSelectionChange(selectedOption.value);
    }
  };

  const handleCardClick = (index: number) => {
    if (!swiper) return;
    const slidesPerView = typeof swiper.params.slidesPerView === 'number' ? swiper.params.slidesPerView : 1;
    const half = Math.floor(slidesPerView / 2);
    const leftmostIndex = swiper.activeIndex - half;
    const rightmostIndex = swiper.activeIndex + half;
    if (index === leftmostIndex && index !== rightmostIndex) {
      swiper.slidePrev();
    } else if (index === rightmostIndex && index !== leftmostIndex) {
      swiper.slideNext();
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
              <ChoiceCard emoji={option.emoji} text={option.text} onClick={() => handleCardClick(index)} />
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