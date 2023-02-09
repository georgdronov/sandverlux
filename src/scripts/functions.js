export const myPopupOverlay = new popupOverlay();
export const myGallery = new gallery();
export const mySetAnchorsEvents = new setAnchorsEvents();

export function toggleClassOnClick(itemsClick, classToItem, nameOfClass) {
  const buttons = document.querySelectorAll(itemsClick);
  if (!buttons.length) return;
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      switch (classToItem) {
        case "parent":
          button.parentElement.classList.toggle(nameOfClass);
          break;
        case "previous":
          button.previousElementSibling.classList.toggle(nameOfClass);
          break;
        default:
          document.querySelectorAll(classToItem).forEach((item) => {
            item.classList.toggle(nameOfClass);
          });
          break;
      }
    })
  );
}

export function toggleClassOnScroll(item, topOffset, nameOfClass) {
  let scrollState = null;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollY > topOffset && scrollState !== "scrolled") {
        document.querySelector(item).classList.add(nameOfClass);
        scrollState = "scrolled";
        return;
      }
      if (scrollY <= topOffset && scrollState !== "not-scrolled") {
        document.querySelector(item).classList.remove(nameOfClass);
        scrollState = "not-scrolled";
        return;
      }
    },
    {
      passive: true,
    }
  );
  if (scrollY > topOffset && scrollState !== "scrolled") {
    document.querySelector(item).classList.add(nameOfClass);
    scrollState = "scrolled";
    return;
  }
}

export function toggleElements() {
  const toggleContainers = document.querySelectorAll("[data-toggle-container]");
  if (!toggleContainers.length) return;

  toggleContainers.forEach((container) => {
    const toggleElements = container.querySelectorAll("[data-toggle]");
    const toggleTargets = container.querySelectorAll("[data-target]");
    if (!toggleElements.length && !toggleTargets.length) return;
    const isToggle = container.dataset.toggleContainer.includes("toggle")
      ? true
      : false;
    const isSelf = container.dataset.toggleContainer.includes("self")
      ? true
      : false;

    toggleElements.forEach((elem) => {
      switch (elem.tagName.toLowerCase()) {
        case "select":
          toggleContent(elem, toggleTargets);
          elem.addEventListener("change", (event) => {
            toggleContent(event.target, toggleTargets);
          });
          break;
        case "input":
          toggleContent(elem, toggleTargets, toggleElements, elem.checked);
          elem.addEventListener("click", (event) => {
            toggleContent(event.target, toggleTargets);
          });
          break;
        default:
          elem.addEventListener("click", (event) => {
            toggleContent(
              event.currentTarget,
              toggleTargets,
              toggleElements,
              isToggle,
              isSelf
            );
          });
          break;
      }
    });
  });

  function toggleContent(
    current,
    targets,
    buttons = null,
    toggle = false,
    self = false
  ) {
    const tag = current.tagName.toLowerCase(),
      value = toggleValue(tag, current);

    targets.forEach((target) => toggleClass(target, value, toggle, self));

    if (buttons === null) return;

    toggleExpanded(current, buttons, toggle, self);
  }

  function toggleValue(tag, element) {
    if (tag === "select") return element.value;
    return element.dataset.toggle;
  }
  function toggleClass(target, value, toggle, self) {
    if (self === true && target.dataset.target !== value) return;
    if (self === true && target.dataset.target === value) {
      target.classList.toggle("active");
      return;
    }
    if (toggle === true && target.classList.contains("active")) {
      target.classList.remove("active");
      return;
    }
    if (target.dataset.target === value) {
      target.classList.add("active");
      return;
    }
    target.classList.remove("active");
  }
  function toggleExpanded(current, buttons, toggle, self) {
    let isAreaExpanded = current.getAttribute("aria-expanded") === "true";

    if (self) {
      current.setAttribute("aria-expanded", !isAreaExpanded);
      return;
    }
    buttons.forEach((button) => button.setAttribute("aria-expanded", false));

    if (toggle) {
      current.setAttribute("aria-expanded", !isAreaExpanded);
      return;
    }
    current.setAttribute("aria-expanded", true);
  }
}

function setAnchorsEvents() {
  let scrollElements = document.querySelectorAll("a[href^='#']");

  scrollElements.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      event.preventDefault();

      const link = event.currentTarget.getAttribute("href");
      if (link === "#" || link === undefined) return;

      const linkTarget = document.getElementById(link.substring(1));
      if (!linkTarget) return;

      const currentScrollTop = window.scrollY,
        targetScrollTop =
          linkTarget.getBoundingClientRect().top +
          document.documentElement.scrollTop -
          100;

      const burgerElem = document.querySelector("._menu-opened");
      if (burgerElem) burgerElem.classList.remove("_menu-opened");

      animate({
        duration: 1000,
        timing: easeOutQuart,
        draw: function (progress) {
          window.scrollTo(
            0,
            currentScrollTop - (currentScrollTop - targetScrollTop) * progress
          );
        },
      });
    });
  });
}

export function toHorizontalScroll(element) {
  element.addEventListener("wheel", (event) => {
    event.preventDefault();
    element.scrollLeft += event.deltaY / 2;
  });
}

export function onKeydownAction(element, customFunction) {
  element.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      e.preventDefault();
      customFunction();
    }
  });
}

export function wheelToHide() {
  const elements = document.querySelectorAll("._wheel-to-hide");
  if (!elements.length) return;

  elements.forEach((element) => {
    if (
      element.scrollWidth <= element.clientWidth ||
      document.cookie.includes("wheelToHideHidden")
    ) {
      element.classList.remove("active");
      setTimeout(() => element.classList.remove("_wheel-to-hide"), 500);
      return;
    }

    element.scrollLeft = 0;
    element.classList.add("active");
    element.addEventListener("scroll", (event) => hide(event.target), {
      once: true,
      passive: true,
    });
    element.addEventListener("click", (event) => hide(event.target), {
      once: true,
    });
  });

  function hide(element) {
    element.classList.remove("active");
    document.cookie = "wheelToHideHidden=; max-age=604800; samesite=lax";
    setTimeout(() => element.classList.remove("_wheel-to-hide"), 500);
  }
}

export function mapOverlay() {
  const maps = document.querySelectorAll(".map");
  if (!maps.length) return;

  maps.forEach((map) => {
    const overlay = map.querySelector(".map__overlay");
    if (!overlay) return;

    let timer = null;
    overlay.addEventListener("wheel", () => toggleMapOverlay(timer, overlay), {
      passive: true,
    });
    overlay.addEventListener(
      "touchmove",
      () => toggleMapOverlay(timer, overlay),
      {
        passive: true,
      }
    );
    overlay.addEventListener("click", () => overlay.remove());
  });

  function toggleMapOverlay(timer, overlay) {
    if (timer !== null) return;

    overlay.classList.add("active");
    timer = setTimeout(function () {
      overlay.classList.remove("active");
      clearTimeout(timer);
      timer = null;
    }, 2000);
  }
}

export function scrollToTop() {
  const scrollTopElement = document.querySelector(".scroll-top");
  const scrollTopPath = scrollTopElement.querySelector(".scroll-top__path");
  let scrollTopPathLength = 0;
  let documentHeight =
    document.documentElement.offsetHeight - window.innerHeight;

  if (scrollTopPath) {
    scrollTopPathLength = scrollTopPath.getTotalLength();
    const resizeObserver = new ResizeObserver(function () {
      documentHeight =
        document.documentElement.offsetHeight - window.innerHeight;
    });

    window.addEventListener("load", function () {
      documentHeight =
        document.documentElement.offsetHeight - window.innerHeight;
      setPreloaderPath(
        scrollTopPath,
        scrollTopPathLength,
        (document.documentElement.scrollTop * 100) / documentHeight
      );
    });
    window.addEventListener(
      "resize",
      function () {
        documentHeight =
          document.documentElement.offsetHeight - window.innerHeight;
      },
      {
        passive: true,
      }
    );
    resizeObserver.observe(document.body);
  }
  let hasClass = scrollTopElement.classList.contains("_active"),
    isScrolled = scrollY > 35;
  window.addEventListener(
    "scroll",
    function () {
      hasClass = scrollTopElement.classList.contains("_active");
      isScrolled = scrollY > 35;
      if (isScrolled && !hasClass) {
        scrollTopElement.classList.add("_active");
      } else if (!isScrolled && hasClass) {
        scrollTopElement.classList.remove("_active");
      }

      if (!scrollTopPath) return;
      setPreloaderPath(
        scrollTopPath,
        scrollTopPathLength,
        (document.documentElement.scrollTop * 100) / documentHeight
      );
    },
    {
      passive: true,
    }
  );
  scrollTopElement.addEventListener("click", () => {
    let currentScrollTop = window.scrollY;
    animate({
      duration: 1000,
      timing: easeOutQuart,
      draw: function (progress) {
        window.scrollTo(0, currentScrollTop - currentScrollTop * progress);
      },
    });
  });
  if (scrollY > 35 && !scrollTopElement.classList.contains("_active")) {
    scrollTopElement.classList.add("_active");
  }

  function setPreloaderPath(path, pathLength, value) {
    path.style.strokeDashoffset = pathLength + 0.01 * pathLength * value;
  }
}

function animate({ timing, draw, duration }) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction < 0) timeFraction = 0;
    if (timeFraction > 1) timeFraction = 1;
    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);
    draw(progress); // отрисовать её
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
// eslint-disable-next-line no-unused-vars
function linear(timeFraction) {
  return timeFraction;
}
// eslint-disable-next-line no-unused-vars
function easeOut(timeFraction) {
  return Math.pow(timeFraction, 1 / 1.99);
}
// eslint-disable-next-line no-unused-vars
function easeOutQuart(timeFraction) {
  return timeFraction === 1 ? 1 : 1 - Math.pow(2, -10 * timeFraction);
}

export function myLazyLoad() {
  const lazyObjects = document.querySelectorAll("img[loading='lazy']");

  if (!lazyObjects.length) return;

  if (!("loading" in HTMLImageElement.prototype)) {
    lazyObjects.forEach((img) => replaceAttributes(img));
    return;
  }

  if ("IntersectionObserver" in window) {
    const options = {
      // root: document.querySelector( '#viewport' ),
      rootMargin: "250px",
      threshold: 0,
    };

    lazyObjects.forEach((item) => {
      const observer = new IntersectionObserver(manageIntersection, options);
      observer.observe(item);

      function manageIntersection(entries, observer) {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            replaceAttributes(item.target);
            observer.disconnect();
          }
          return;
        });
      }
    });

    return true;
  } else {
    lazyObjects.forEach((item) => replaceAttributes(item));
    return true;
  }

  function replaceAttributes(item) {
    if (!item.hasAttribute("data-src")) return;
    item.setAttribute("src", item.getAttribute("data-src"));
    item.removeAttribute("data-src");

    // if (item.parentElement.nodeName !== "PICTURE") return;

    // for (const child of item.parentElement.children) {
    //   if (!child.hasAttribute("srcset")) return;

    //   const targetPath = child.getAttribute("srcset"),
    //     sourcePath = item.getAttribute("src");

    //   if (!targetPath.includes("placeholder")) return;

    //   child.setAttribute(
    //     "srcset",
    //     `${sourcePath.substring(0, sourcePath.lastIndexOf("."))}.webp`
    //   );
    // }
  }
}

export function validateFile(inputElement) {
  const fileErrorClass = "error";
  const inputLabel =
    inputElement.parentElement.querySelector(".form__label") ||
    inputElement.parentElement.querySelector("span");

  if (!inputElement.files.length) {
    inputElement.classList.add(fileErrorClass);
    inputLabel.textContent = "Файл не выбран.";
    return;
  }

  // init state //
  const maxFileSize = inputElement.dataset?.maxSize * Math.pow(1024, 2) || 5e6,
    firstFile = inputElement.files[0],
    fileName = firstFile.name,
    fileSize = firstFile.size;

  // clear validation //
  inputElement.classList.remove(fileErrorClass);
  inputLabel.textContent = "";

  const fileNameToShow =
      fileName.length > 25
        ? `${fileName.slice(0, 10)}...${fileName.slice(-10)}`
        : fileName,
    fileSizeToShow = formatBytes(fileSize);

  if (fileSize > maxFileSize) {
    inputElement.classList.add(fileErrorClass);
    inputLabel.textContent = `Файл больше ${formatBytes(maxFileSize)}`;
    return;
  }

  inputLabel.textContent = `Файл: ${fileNameToShow} (${fileSizeToShow})`;
}

export function validatePhoneNumber(inputElement) {
  const phoneFormat = (value) =>
    value
      .replace(/((?!\+)\D+)+/g, "")
      .match(/^(\+375)(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);

  inputElement.addEventListener("click", (e) => {
    if (e.target.value === "" || !phoneFormat(e.target.value))
      e.target.value = "+375";
  });
  inputElement.addEventListener("input", (e) => {
    const elem = e.target;
    let cursorPosition = elem.selectionStart;
    elem.value =
      elem.value.slice(0, cursorPosition) +
      elem.value.slice(cursorPosition + 1);
    elem.selectionEnd = cursorPosition;

    let x = phoneFormat(elem.value);
    let phoneArray = "";

    if (x === null || !x[1]) {
      phoneArray = "";
    } else if (x[1] && !x[2]) {
      phoneArray = `${x[1]}`;
    } else if (x[1] && x[2] && !x[3]) {
      phoneArray = `${x[1]} (${x[2]}`;
    } else if (x[1] && x[2] && x[3] && !x[4]) {
      phoneArray = `${x[1]} (${x[2]}) ${x[3]}`;
    } else if (x[1] && x[2] && x[3] && x[4] && !x[5]) {
      phoneArray = `${x[1]} (${x[2]}) ${x[3]}-${x[4]}`;
    } else {
      phoneArray = `${x[1]} (${x[2]}) ${x[3]}-${x[4]}-${x[5]}`;
    }
    elem.value = phoneArray;
  });
}

function gallery() {
  const galleryObjects = document.querySelectorAll("[data-gallery]");

  if (!galleryObjects.length) return;

  // init
  const galleryWrapper = document.createElement("div");
  const closeButton = document.createElement("button");
  // const prevButton = document.createElement("button");
  // const nextButton = document.createElement("button");
  const galleryClassActive = "my-gallery_active";

  galleryWrapper.className = "my-gallery";
  closeButton.type = "button";
  closeButton.className = "my-gallery__close";
  closeButton.innerHTML = "<span class='sr-only'>Закрыть</span>";
  // prevButton.type = "button";
  // prevButton.className = "my-gallery__prev";
  // prevButton.innerHTML = "<span class='sr-only'>Предыдущее</span>";
  // nextButton.type = "button";
  // nextButton.className = "my-gallery__next";
  // nextButton.innerHTML = "<span class='sr-only'>Следующее</span>";

  document.body.appendChild(galleryWrapper);
  galleryWrapper.appendChild(closeButton);
  // galleryWrapper.appendChild(prevButton);
  // galleryWrapper.appendChild(nextButton);
  const galleryImage = new Image();

  this.show = () => {
    myPopupOverlay.element.style.zIndex = "1055";
    galleryWrapper.classList.add(galleryClassActive);
  };
  this.hide = () => {
    myPopupOverlay.element.style = "";
    galleryWrapper.classList.remove(galleryClassActive);
  };

  closeButton.addEventListener("click", () => this.hideGalleryElement());
  galleryWrapper.addEventListener("click", () => this.hideGalleryElement());
  // prevButton.addEventListener("click", () => this.galleryPrev());
  // nextButton.addEventListener("click", () => this.galleryNext());

  // eslint-disable-next-line no-unused-vars
  galleryObjects.forEach((elem, index) => {
    const imageElement = elem.querySelector("img");
    if (!imageElement) return;

    const imageLink =
      imageElement.getAttribute("data-src") ||
      imageElement.getAttribute("src") ||
      "images/placeholder.png";
    const imageSrc = imageLink.replace("/thumbnails", "");

    elem.addEventListener("click", (event) => {
      this.showGalleryElement(event, imageSrc, imageElement);
    });
    elem.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
        this.showGalleryElement(e, imageSrc, imageElement);
      }
    });
  });

  this.showGalleryElement = (event, imageSrc, imageElement) => {
    event.preventDefault();
    myPopupOverlay.show();

    galleryImage.onload = () => galleryWrapper.appendChild(galleryImage);
    galleryImage.src = imageSrc;
    galleryImage.alt = imageElement.alt;
    this.show();
  };

  this.hideGalleryElement = () => {
    this.hide();
    if (document.querySelectorAll(".popup_active").length) return;
    myPopupOverlay.hide();
  };
}

function popupOverlay() {
  const name = "popup-overlay";
  this.element = document.querySelector(`.${name}`);
  const elementClassActive = `${name}_active`;
  const bodyElement = document.body,
    headerElement = document.querySelector("header");

  this.show = () => {
    let scrollWidth = window.innerWidth - document.body.clientWidth;
    this.element.classList.add(elementClassActive);
    bodyElement.style = `overflow: hidden; margin-right: ${scrollWidth}px`;
    headerElement.style = `padding-right: ${scrollWidth}px`;
  };
  this.hide = () => {
    this.element.classList.remove(elementClassActive);
    setTimeout(() => {
      bodyElement.style = "";
      headerElement.style = "";
    }, 300);
  };
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Байт";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Байт", "КБ", "МБ", "ГБ", "ТБ", "ПБ", "ЭБ", "ЗБ", "ЙБ"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
