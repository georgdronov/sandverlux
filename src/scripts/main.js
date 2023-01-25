document.addEventListener("DOMContentLoaded", function () {
  myFunctions.addClassOnScroll(".header", 170, "_scrolled");
  myFunctions.addClassOnClick(".burger", ".header", "_menu-opened");
  myFunctions.myLazyLoad();
  myFunctions.scrollToTop();
  myFunctions.mapOverlay();
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

  myFunctions.addClassOnClick(".form__rating > label", "this", "active");

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

  const filterToggleItems = document.querySelectorAll(
    "[name=filter-toggle-item]"
  );
  const filterToggleCheckboxes = document.querySelectorAll(
    "[name=filter-toggle-checkboxes]"
  );

  if (filterToggleItems.length) {
    filterToggleItems.forEach((button) =>
      button.addEventListener("click", (event) =>
        event.currentTarget.parentElement.classList.toggle("active")
      )
    );
  }
  if (filterToggleCheckboxes.length) {
    filterToggleCheckboxes.forEach((button) =>
      button.addEventListener("click", (event) => {
        event.currentTarget.previousElementSibling.classList.toggle("active");
        event.currentTarget.remove();
      })
    );
  }
  myFunctions.addClassOnClick(
    "[name=filter-toggle]",
    ".products__filter",
    "_opened"
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
    ".product-slider__swiper-wrapper > *"
  );

  if (psSlides.length) {
    // eslint-disable-next-line no-unused-vars
    const psSwiper = new Swiper(".product-slider__swiper", {
      modules: [Navigation],
      loop: false,
      rewind: false,
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 60,
      setWrapperSize: true,
      containerModifierClass: "product-slider__swiper-",
      wrapperClass: "product-slider__swiper-wrapper",

      navigation: {
        nextEl: ".product-slider__nav-btn_next",
        prevEl: ".product-slider__nav-btn_prev",
        lockClass: "product-slider__nav-btn_lock",
        disabledClass: "product-slider__nav-btn_disabled",
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

  // toggle content //

  const toggleContainers = document.querySelectorAll("[data-toggle-container]");

  if (toggleContainers.length) {
    toggleContainers.forEach((container) => {
      const toggleButtons = container.querySelectorAll("[data-toggle]");
      const toggleTargets = container.querySelectorAll("[data-target]");
      if (!toggleButtons.length && !toggleTargets.length) return;

      toggleButtons.forEach((button) =>
        button.addEventListener("click", (event) => {
          toggleButtons.forEach((button) =>
            button.setAttribute("aria-expanded", false)
          );
          event.currentTarget.setAttribute("aria-expanded", true);
          toggleTargets.forEach((target) =>
            target.id === button.dataset.toggle.substring(1)
              ? target.classList.add("active")
              : target.classList.remove("active")
          );
        })
      );
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

  const productWishButtons = document.querySelectorAll("[name=product-wish]");
  const productCompareButtons = document.querySelectorAll(
    "[name=product-compare]"
  );

  if (productWishButtons.length) {
    const productWishCounter = document.querySelectorAll(".wishlist-count");
    productWishButtons.forEach((button) =>
      button.addEventListener(
        "click",
        () =>
          productWishCounter.forEach((counter) => {
            counter.textContent = parseInt(counter.textContent) + 1;
          }),
        {
          once: true,
        }
      )
    );
  }
  if (productCompareButtons.length) {
    const productCompareCounter =
      document.querySelectorAll(".comparison-count");
    productCompareButtons.forEach((button) =>
      button.addEventListener(
        "click",
        () =>
          productCompareCounter.forEach((counter) => {
            counter.textContent = parseInt(counter.textContent) + 1;
          }),
        {
          once: true,
        }
      )
    );
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

  myFunctions.addClassOnClick(
    "button[name=popular-collapse-button]",
    ".popular",
    "_expanded"
  );

  if (openPopupButtons.length) {
    openPopupButtons.forEach((elem) => {
      elem.addEventListener("click", (event) => {
        const currentButton = event.currentTarget;
        if (!currentButton) return;
        const currentPopup = document.getElementById(
          currentButton.dataset.openPopup
        );
        if (!currentPopup) {
          console.log(
            `There is no pop-up with current ID ("${currentButton.dataset.openPopup}") or ID is wrong.`
          );
          return;
        }
        popupOverlay.show();
        currentPopup.classList.add(popupClassActive);
      });
    });
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

  const activeLabes = document.querySelectorAll("label[role=button]");
  if (activeLabes.length) {
    activeLabes.forEach((label) =>
      label.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
          label.click();
        }
      })
    );
  }

  // myFunctions.wheelToHide();
});

import * as myFunctions from "./functions.js";
import noUiSlider from "nouislider/dist/nouislider.mjs";
// eslint-disable-next-line no-unused-vars
import Swiper, { Navigation, Pagination } from "swiper";
