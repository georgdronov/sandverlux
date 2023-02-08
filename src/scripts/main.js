document.addEventListener("DOMContentLoaded", function () {
  myFunctions.toggleClassOnScroll(".header", 170, "_scrolled");
  myFunctions.toggleClassOnClick(".burger", ".header", "_menu-opened");
  myFunctions.myLazyLoad();
  myFunctions.scrollToTop();
  myFunctions.mapOverlay();
  myFunctions.toggleElements();
  myFunctions.myGallery;
  myFunctions.mySetAnchorsEvents;
  const popupOverlay = myFunctions.myPopupOverlay;

  const allPopopups = document.querySelectorAll(".popup");
  const popupCloseButtons = document.querySelectorAll(".popup__close");

  const popupClassActive = "popup_active";

  const formElements = document.querySelectorAll(".form__input");

  const openPopupButtons = document.querySelectorAll("[data-open-popup]");

  //catalog banners scrolling horizonally and max width
  const catalogBannerWrappers = document.querySelectorAll(
    ".catalog__banners-wrapper"
  );
  catalogBannerWrappers.forEach((elem) => {
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth >= 1200) {
          elem.style.maxWidth = `${
            window.innerWidth - elem.getBoundingClientRect().left
          }px`;
        }
      },
      {
        passive: true,
      }
    );
    if (window.innerWidth < 1200) return;

    elem.style.maxWidth = `${
      window.innerWidth - elem.getBoundingClientRect().left
    }px`;

    myFunctions.toHorizontalScroll(elem);
  });

  document
    .querySelectorAll('button[name="button-collapse"]')
    .forEach((button) =>
      button.addEventListener("click", (event) => {
        event.currentTarget.parentElement.parentElement.classList.toggle(
          "active"
        );
      })
    );

  //faq list collapse
  const allFaqItems = document.querySelectorAll(".faq-item");

  if (allFaqItems.length) {
    allFaqItems.forEach((item) => {
      const answerButton = item.querySelector(".faq-item__button");
      const answerWrapper = item.querySelector(".faq-item__answer-wrapper");

      answerButton.addEventListener("click", () => {
        faqCollapseAnimation(answerButton, answerWrapper);
      });
      myFunctions.onKeydownAction(
        answerButton,
        faqCollapseAnimation(answerButton, answerWrapper)
      );
    });
  }

  //popup click events

  popupCloseButtons.forEach((elem) => {
    elem.addEventListener("click", () => {
      popupOverlay.hide();
      allPopopups.forEach((elem) => elem.classList.remove(popupClassActive));
    });
  });

  popupOverlay.element.addEventListener("click", () => {
    popupOverlay.hide();
    allPopopups.forEach((elem) => elem.classList.remove(popupClassActive));
  });

  const ratingButtons = document.querySelectorAll(".form__rating > label");

  if (ratingButtons.length) {
    ratingButtons.forEach((button) =>
      button.addEventListener("click", (event) => {
        ratingButtons.forEach((elem) => elem.classList.remove("active"));
        event.currentTarget.classList.add("active");
      })
    );
  }

  // "contacts" form placeholder state movement //

  if (formElements) {
    formElements.forEach((elem) => {
      const elemLabel = elem.previousElementSibling || elem.nextElementSibling;
      if (!elemLabel) return;
      if (!elemLabel.classList.contains("form__label_placeholder")) return;

      changePlaceholderState(elem.value, elemLabel);

      elem.addEventListener("focusin", (e) =>
        changePlaceholderState(elem.value, elemLabel, e.type)
      );
      elem.addEventListener("focusout", (e) =>
        changePlaceholderState(elem.value, elemLabel, e.type)
      );
    });
  }

  // door price slider //
  const doorPriceSlider = document.getElementById("door-price-slider");

  if (doorPriceSlider) {
    const doorPriceMinInput = document.querySelector(
      "input[name=door-price-min]"
    );
    const doorPriceMaxInput = document.querySelector(
      "input[name=door-price-max]"
    );

    noUiSlider.create(doorPriceSlider, {
      start: [
        +doorPriceMinInput.value || 0,
        +doorPriceMaxInput.dataset.max || 100,
      ],
      step: 1,
      format: {
        to: function (value) {
          return parseInt(value);
        },
        from: function (value) {
          return parseInt(value);
        },
      },
      handleAttributes: [
        { "aria-label": "Минимальная цена" },
        { "aria-label": "Максимальная цена" },
      ],
      connect: true,
      range: {
        min: +doorPriceMinInput.dataset.min || 0,
        max: +doorPriceMaxInput.dataset.max || 100,
      },
    });

    doorPriceSlider.noUiSlider.on("update", function (values, handle) {
      let value = values[handle];

      if (handle) {
        doorPriceMaxInput.value = value;
      } else {
        doorPriceMinInput.value = value;
      }
    });

    doorPriceMinInput.addEventListener("change", function () {
      doorPriceSlider.noUiSlider.set([this.value, null]);
    });
    doorPriceMaxInput.addEventListener("change", function () {
      doorPriceSlider.noUiSlider.set([null, this.value]);
    });
  }

  // our-goods swiper //

  const ogFilterButtons = document.querySelectorAll(".our-goods__button");
  let ogSlides = null;

  if (ogFilterButtons.length) {
    ogFilterButtons.forEach((button) =>
      button.addEventListener("click", (event) => {
        showCorrectCategory(event.currentTarget.value);
        switchCategoryButton(event.currentTarget);
        ogSwiper.update();
      })
    );
    // eslint-disable-next-line no-unused-vars
    const ogSwiper = new Swiper(".our-goods__swiper", {
      modules: [Navigation],
      loop: false,
      // loopAdditionalSlides: 2,
      rewind: false,
      grabCursor: true,
      slidesPerView: "auto", //5,
      spaceBetween: 60,
      //autoHeight: true,
      setWrapperSize: true,
      containerModifierClass: "our-goods__swiper-",
      wrapperClass: "our-goods__swiper-wrapper",

      //pagination: {
      //  el: '.swiper-pagination',
      //},

      navigation: {
        nextEl: ".our-goods__nav-btn_next",
        prevEl: ".our-goods__nav-btn_prev",
        lockClass: "our-goods__nav-btn_lock",
        disabledClass: "our-goods__nav-btn_disabled",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: "auto",
          spaceBetween: 60,
        },
      },
      // breakpoints: {
      //   320: {
      //     slidesPerView: 1,
      //   },
      //   576: {
      //     slidesPerView: 2,
      //   },
      //   768: {
      //     slidesPerView: 3,
      //   },
      //   992: {
      //     slidesPerView: 4,
      //   },
      //   1200: {
      //     slidesPerView: 5,
      //   },
      // },
      on: {
        init: function () {
          updateSliderLockedState(this);
          ogSlides = this.slides;
          showCorrectCategory("bestseller");
        },
        // observerUpdate: function () {
        //   console.log("observerUpdate");
        // },
        // lock: function () {
        //   console.log("lock");
        // },
        update: function () {
          updateSliderLockedState(this);
          // console.log('update');
        },
        resize: function () {
          updateSliderLockedState(this);
        },
      },
    });
  }

  // product color switcher

  const productLabels = document.querySelectorAll(".product__color-label");
  productLabels.forEach((label) =>
    label.addEventListener("click", (event) => {
      event.currentTarget.parentElement.childNodes.forEach((label) =>
        label.nodeType === 1 ? label.classList.remove("active") : null
      );
      event.currentTarget.classList.add("active");
    })
  );

  // category filter toggle

  myFunctions.toggleClassOnClick(
    "[name=filter-toggle]",
    ".products__filter",
    "_opened"
  );
  myFunctions.toggleClassOnClick(
    "[name=filter-toggle-item]",
    "parent",
    "active"
  );
  myFunctions.toggleClassOnClick(
    "[name=filter-toggle-checkboxes]",
    "previous",
    "active"
  );

  // category sort views switcher

  const sortViewsButtons = document.querySelectorAll("[name=sort-view]");

  if (sortViewsButtons.length) {
    sortViewsButtons.forEach((button) =>
      button.addEventListener("click", (event) => {
        const defaultClassList = "products__items",
          target = event.currentTarget,
          productsWrapper = document.querySelector(`.${defaultClassList}`);

        target.parentElement.childNodes.forEach((sButton) =>
          sButton.nodeType === 1 ? sButton.classList.remove("active") : null
        );
        target.classList.add("active");
        productsWrapper.classList = defaultClassList;
        productsWrapper.classList.add(`${target.value}`);
      })
    );
  }

  // product slider swiper //
  const psSlides = document.querySelectorAll(
    ".custom-slider__swiper-wrapper > *"
  );

  if (psSlides.length) {
    // eslint-disable-next-line no-unused-vars
    const psSwiper = new Swiper(".custom-slider__swiper", {
      modules: [Navigation],
      loop: false,
      rewind: false,
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 60,
      setWrapperSize: true,
      containerModifierClass: "custom-slider__swiper-",
      wrapperClass: "custom-slider__swiper-wrapper",

      navigation: {
        nextEl: ".custom-slider__nav-btn_next",
        prevEl: ".custom-slider__nav-btn_prev",
        lockClass: "custom-slider__nav-btn_lock",
        disabledClass: "custom-slider__nav-btn_disabled",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: "auto",
          spaceBetween: 60,
        },
      },
      on: {
        init: function () {
          updateSliderLockedState(this);
        },
        update: function () {
          updateSliderLockedState(this);
        },
        resize: function () {
          updateSliderLockedState(this);
        },
      },
    });
  }

  // product card sliders swiper //
  const pcsClass = "product-card-slider__",
    pcsSlidersClasses = ["pcs-slider-01", "pcs-slider-02"];
  const pcsSlides = document.querySelectorAll(`.${pcsClass}swiper-wrapper > *`);
  let currentThumbsElement = null;

  if (pcsSlides.length) {
    const pcsThumbsSwiperConfig = {
      direction: "vertical",
      autoHeight: true,
      spaceBetween: 46,
      slidesPerView: 4,
      centeredSlides: true,
      normalizeSlideIndex: false,
      centeredSlidesBounds: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      wrapperClass: pcsClass + "swiper-wrapper",
      slideClass: pcsClass + "slide",
      breakpoints: {
        0: {
          spaceBetween: 15,
        },
        576: {
          spaceBetween: 20,
        },
        1200: {
          spaceBetween: 30,
        },
        1366: {
          spaceBetween: 46,
        },
      },
    };
    const pcsThumbsSwiper01 = new Swiper(
      `.${pcsClass}swiper--thumbs.${pcsSlidersClasses[0]}`,
      pcsThumbsSwiperConfig
    );
    const pcsThumbsSwiper02 = new Swiper(
      `.${pcsClass}swiper--thumbs.${pcsSlidersClasses[1]}`,
      pcsThumbsSwiperConfig
    );

    const pcsMainSwiperConfig = {
      grabCursor: false,
      slidesPerView: 1,
      roundLengths: true,
      wrapperClass: pcsClass + "swiper-wrapper",
      slideClass: pcsClass + "slide",
      thumbs: {
        swiper: currentThumbsElement,
      },
    };
    currentThumbsElement = pcsThumbsSwiper01;
    const pcsMainSwiper01 = new Swiper(
      `.${pcsClass}swiper--main.${pcsSlidersClasses[0]}`,
      pcsMainSwiperConfig
    );
    currentThumbsElement = pcsThumbsSwiper02;
    const pcsMainSwiper02 = new Swiper(
      `.${pcsClass}swiper--main.${pcsSlidersClasses[1]}`,
      pcsMainSwiperConfig
    );
    currentThumbsElement = null;

    pcsMainSwiper01.on("slideChangeTransitionStart", function () {
      pcsThumbsSwiper01.slideTo(pcsMainSwiper01.activeIndex);
    });
    pcsThumbsSwiper01.on("transitionStart", function () {
      pcsMainSwiper01.slideTo(pcsThumbsSwiper01.activeIndex);
    });
    pcsMainSwiper02.on("slideChangeTransitionStart", function () {
      pcsThumbsSwiper02.slideTo(pcsMainSwiper02.activeIndex);
    });
    pcsThumbsSwiper02.on("transitionStart", function () {
      pcsMainSwiper02.slideTo(pcsThumbsSwiper02.activeIndex);
    });
  }

  // product card sliders swiper //

  const pcsSwitcherButton = document.querySelector("[name=sliders-switcher]");
  const pcSliders = document.querySelectorAll(".product-card-slider");

  if (pcsSwitcherButton && pcSliders.length) {
    pcsSwitcherButton.addEventListener("click", (event) => {
      event.currentTarget.parentElement.classList.toggle("active");
      pcSliders.forEach((slide) => slide.classList.toggle("active"));
    });
  }

  // counter group elements //

  const counterContainers = document.querySelectorAll(
    "[data-counter-container]"
  );

  if (counterContainers.length) {
    counterContainers.forEach((container) => {
      const counterButtons = container.querySelectorAll("[data-action]");
      const counterTarget = container.querySelector("[data-target]");
      if (!counterButtons.length && !counterTarget) return;

      counterButtons.forEach((button) =>
        button.addEventListener("click", (event) => {
          switch (event.currentTarget.dataset.action) {
            case "plus":
              counterTarget.value = parseInt(counterTarget.value) + 1;
              break;
            case "minus":
              if (parseInt(counterTarget.value) <= 1) break;
              counterTarget.value = parseInt(counterTarget.value) - 1;
              break;
          }
        })
      );
      counterTarget.addEventListener("change", (event) => {
        const target = event.currentTarget;
        if (parseInt(target.value) >= target.dataset.min) return;
        target.value = 1;
      });
    });
  }

  // features fake functionality //

  const wishButtons = document.querySelectorAll("[name=product-wish]");
  const compareButtons = document.querySelectorAll("[name=product-compare]");

  if (wishButtons.length) {
    const productWishCounter = document.querySelectorAll(".wishlist-count");
    wishButtons.forEach((button) =>
      button.addEventListener("click", (event) =>
        fakeButtonsActivation(event, productWishCounter)
      )
    );
  }
  if (compareButtons.length) {
    const productCompareCounter =
      document.querySelectorAll(".comparison-count");
    compareButtons.forEach((button) =>
      button.addEventListener("click", (event) =>
        fakeButtonsActivation(event, productCompareCounter)
      )
    );
  }
  function fakeButtonsActivation(event, counter) {
    if (!event.currentTarget.classList.contains("active")) {
      counter.forEach((counter) => {
        counter.textContent = parseInt(counter.textContent) + 1;
      });
      event.currentTarget.classList.add("active");
    } else {
      counter.forEach((counter) => {
        counter.textContent = parseInt(counter.textContent) - 1;
      });
      event.currentTarget.classList.remove("active");
    }
  }

  // popular categories //

  const popularCategories = document.querySelectorAll(".popular-categories");

  if (popularCategories.length) {
    // eslint-disable-next-line no-unused-vars
    const pcSwiper = new Swiper(".popular-categories__items-wrapper", {
      modules: [Navigation],
      loop: false,
      rewind: false,
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 30,
      autoHeight: false,
      setWrapperSize: true,
      wrapperClass: "popular-categories__items",
      slideClass: "popular-categories__item",
      navigation: {
        nextEl: ".popular-categories__nav-btn_next",
        prevEl: ".popular-categories__nav-btn_prev",
        lockClass: "popular-categories__nav-btn_lock",
        disabledClass: "popular-categories__nav-btn_disabled",
      },
      breakpoints: {
        0: {
          spaceBetween: 10,
          centeredSlides: true,
        },
        576: {
          spaceBetween: 30,
          centeredSlides: false,
        },
      },
      on: {
        init: function () {
          updateSliderLockedState(this);
        },
        update: function () {
          updateSliderLockedState(this);
        },
        resize: function () {
          updateSliderLockedState(this);
        },
      },
    });
  }

  function showCorrectCategory(category) {
    if (ogSlides === null) return;
    ogSlides.forEach((slide) => addCategoryClass(slide, category));
  }

  function addCategoryClass(slide, buttonCategory) {
    const slideCategories = slide.dataset.slideCategory.split(",");
    slide.classList.remove("our-goods__slide-show");
    if (!slideCategories.includes(buttonCategory)) return;
    slide.classList.add("our-goods__slide-show");
  }

  function switchCategoryButton(button) {
    ogFilterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  function updateSliderLockedState(slider) {
    slider.isLocked
      ? slider.el.classList.add("locked")
      : slider.el.classList.remove("locked");
  }

  // map switcher
  // const osMapButtons = document.querySelectorAll(
  //   'button[name="our-shops-set-marker"]'
  // );
  // const osMap = document.getElementById("our-shops-map");
  // if (osMapButtons.length && osMap) {
  //   osMapButtons.forEach((button) =>
  //     button.addEventListener("click", (event) => {
  //       osMap.src = osMap.src.slice(0, -10) + event.currentTarget.value;
  //     })
  //   );
  // }

  // popular tags for catalog page

  myFunctions.toggleClassOnClick(
    "button[name=popular-collapse-button]",
    ".popular",
    "_expanded"
  );

  if (openPopupButtons.length) {
    openPopupButtons.forEach((button) => {
      button.addEventListener("click", () =>
        openPopup(button.dataset.openPopup, button.dataset.setTitle)
      );
    });
  }

  function openPopup(buttonTarget, title = null) {
    if (buttonTarget === "")
      return console.log("This button has an empty data attribute.");

    const currentPopup = document.getElementById(buttonTarget);
    if (!currentPopup) {
      return console.log(
        `There is no pop-up with current ID ("${buttonTarget}") or ID is wrong.`
      );
    }

    popupTitleChange(title, currentPopup);

    popupOverlay.show();
    currentPopup.classList.add(popupClassActive);
    const hasFocusableElement = currentPopup.querySelector(
      "input:not(disabled):not(hidden):not(.sr-only)"
    );
    if (!hasFocusableElement) return;
    setTimeout(() => {
      hasFocusableElement.focus();
    }, 300);
  }

  function popupTitleChange(title, popup) {
    if (!title) return;
    const targetInput = popup.querySelector("input[data-set-title]");
    const popupHeading = popup.querySelector(".popup__heading");
    if (!targetInput && !popupHeading) return;

    // targetInput.value = title;
    targetInput.setAttribute("value", title);
    popupHeading.textContent = title;
  }

  function changePlaceholderState(elemValue, label, event = "init") {
    if (
      (!elemValue && event == "init") ||
      (!!elemValue && event == "focusout")
    ) {
      return;
    }

    const placeholderClassActive = "form__label_placeholder_active";

    switch (event) {
      case "init":
      case "focusin":
        label.classList.add(placeholderClassActive);
        break;
      case "focusout":
        label.classList.remove(placeholderClassActive);
        break;
    }
  }

  function faqCollapseAnimation(currentAnswerButton, currentAnswerWrapper) {
    if (!currentAnswerButton && !currentAnswerWrapper) return;
    const currentAnswerItem = currentAnswerButton.parentElement;

    if (!currentAnswerItem.classList.contains("_active")) {
      allFaqItems.forEach((e) => {
        e.classList.add("_not-active");
        e.classList.remove("_active");
        e.querySelector(".faq-item__answer-wrapper").removeAttribute("style");
      });

      currentAnswerItem.classList.add("_active");
      currentAnswerItem.classList.remove("_not-active");
      currentAnswerWrapper.style.height = `${currentAnswerWrapper.firstElementChild.offsetHeight}px`;
    } else {
      allFaqItems.forEach((e) => {
        e.classList.remove("_active", "_not-active");
        e.querySelector(".faq-item__answer-wrapper").removeAttribute("style");
      });
    }
  }

  const radioButtons = document.querySelectorAll(".form__radio");
  radioButtons.forEach((button) =>
    myFunctions.onKeydownAction(button, function () {
      button.click();
    })
  );

  // interaction on label //

  const activeLabes = document.querySelectorAll("label[tabindex]");
  if (activeLabes.length) {
    activeLabes.forEach((label) =>
      label.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
          e.preventDefault();
          label.click();
        }
      })
    );
  }

  // additional info buttons highlighting

  const aILinks = document.querySelectorAll(".additional-info__link");

  if (aILinks.length) {
    class aIChain {
      constructor(link, target) {
        this.link = link;
        this.target = target;
      }
    }
    let aITargets = [];

    aILinks.forEach((link) => {
      aITargets.push(
        new aIChain(
          link,
          document.getElementById(link.getAttribute("href").substring(1))
        )
      );
    });
    if (!aITargets.length) return;

    if ("IntersectionObserver" in window) {
      const options = {
        rootMargin: "65px 0px 0px 0px",
        threshold: 0.85,
      };

      aITargets.forEach((item) => {
        const observer = new IntersectionObserver(manageIntersection, options);
        observer.observe(item.target);

        function manageIntersection(entries) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              item.link.classList.add("active");
            } else {
              item.link.classList.remove("active");
            }
            return;
          });
        }
      });

      return true;
    }
  }

  // min date if min attr presented //

  const dateMin = document.querySelectorAll("input[type='date'][min]");

  if (dateMin.length) {
    dateMin.forEach((date) => {
      date.min = new Date().toISOString().split("T")[0];
    });
  }

  // file validation //
  const fileInputs = document.querySelectorAll("input[type='file']");

  if (fileInputs.length) {
    fileInputs.forEach((fileInput) =>
      fileInput.addEventListener("change", () =>
        myFunctions.validateFile(fileInput)
      )
    );
  }

  // phone validation //
  const phoneInputs = document.querySelectorAll("input[type='tel']");

  if (phoneInputs.length) {
    phoneInputs.forEach((phoneInput) =>
      myFunctions.validatePhoneNumber(phoneInput)
    );
  }

  // claim page auto annotation popup //

  const claimPopup = document.getElementById("claim-annotation");

  if (claimPopup) {
    openPopup("claim-annotation");
  }

  // reviews overall values //

  const rwElement = document.querySelector(".reviews-widget");

  reviewsWidget(rwElement);

  function reviewsWidget(element) {
    if (!element) return;

    const ratingEl = document.querySelector(".reviews-widget__overall-rating");
    const amountEl = document.querySelector(".reviews-widget__overall-amount");
    const starsEl = document.querySelectorAll(".reviews-widget__overall-star");
    const allRatingsEl = document.querySelectorAll(".reviews-widget__rating");

    fetch("/files/reviews-stats.json")
      .then((response) => response.json())
      .then((result) => {
        let summOfAllRates = 0;

        allRatingsEl.forEach((rate, index) => {
          const rateProgress = rate.querySelector(".reviews-widget__progress");
          const rateAmount = rate.querySelector(".reviews-widget__amount");

          if (!rateProgress && !rateAmount) return;

          summOfAllRates += result.reviews[index + 1] * (index + 1);

          rateProgress.style.flexGrow =
            +result.reviews[5 - index] / +result.reviews.amount;
          rateAmount.textContent = result.reviews[5 - index] + "x";
        });

        const amountOfReviews = +result.reviews.amount,
          finalRating = summOfAllRates / amountOfReviews,
          stepRate = 150,
          step = Math.ceil(amountOfReviews / stepRate),
          stepFloat = 0.23;

        // amount of all reviews animation //
        const amountTimer = setInterval(function () {
          let currentValue = +amountEl.textContent;
          if (currentValue >= amountOfReviews) {
            clearInterval(amountTimer);
            amountEl.textContent = amountOfReviews;
            return;
          }
          amountEl.textContent = currentValue + step;
        }, stepRate / step);

        // overall score animation //
        const overallTimer = setInterval(function () {
          let currentValue = +ratingEl.textContent;
          if (currentValue >= finalRating - stepFloat) {
            clearInterval(overallTimer);
            ratingEl.textContent = finalRating;
            return;
          }
          ratingEl.textContent = (currentValue + stepFloat).toFixed(1);
        }, 8 / stepFloat);

        // overall stars //
        starsEl.forEach((star, index) => {
          if (Math.ceil(finalRating) == index + 1)
            return (star.querySelector("svg").style.width =
              Math.floor((finalRating % 1) * Math.pow(10, 2)) + "%");
          if (finalRating < index + 1) return;
          star.querySelector("svg").style.width = 100 + "%";
        });
      });
  }

  // myFunctions.wheelToHide();
});

import * as myFunctions from "./functions.js";
import noUiSlider from "nouislider/dist/nouislider.mjs";
import Swiper, { Navigation } from "swiper";
