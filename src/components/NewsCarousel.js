import React, { useEffect, useState } from "react";
import styles from "@/styles/NewsCarousel.module.css";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NewsCarousel() {
  const [news, setNews] = useState([]);
  const [newsStatusMessage, setNewsStatusMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideButtonClicked, setSlideButtonClicked] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedNews = await response.json();
        if (fetchedNews.length > 0) {
          setNews(fetchedNews);
        } else {
          setNewsStatusMessage("No news found.");
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNewsStatusMessage("Error loading news. Is the backend running?");
      }
    };

    fetchNews();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    setSlideButtonClicked(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
    setSlideButtonClicked(true);
  };

  useEffect(() => {
    const slideTimer = setTimeout(() => {
      if (!slideButtonClicked) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }
    }, 5000);

    const sliderOnTimer = setTimeout(() => {
      if (slideButtonClicked) {
        setSlideButtonClicked(false);
      }
    }, 10000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(sliderOnTimer);
    };
  }, [currentIndex, slideButtonClicked, news]);
  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.carouselContainer}>
          <div
            className={styles.carouselWrapper}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {news.map((news, index) => (
              <div key={index} className={styles.slide}>
                <a href={news.link} target="_blank">
                  <img
                    src={
                      news.image ||
                      "https://placehold.co/1000x1000/4B5563/F9FAFB?text=No+Cover"
                    }
                    alt={`Slide ${index}`}
                    className={styles.carouselImage}
                  />
                  <h1 className={styles.headLine}>{news.headLine}</h1>
                </a>
              </div>
            ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className={styles.indicatorContainer}>
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={` ${styles.indicatorButton} ${
                currentIndex === index ? styles.isActive : ""
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
