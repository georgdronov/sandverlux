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
            toggleContent(event.currentTarget, toggleTargets, toggleElements);
          });
          break;
      }
    });
  });

  function toggleContent(current, targets, buttons = null, state = true) {
    if (state !== true) return;
    const tag = current.tagName.toLowerCase(),
      value = toggleValue(tag, current);

    targets.forEach((target) => toggleClass(target, value, state));

    if (buttons === null) return;

    buttons.forEach((button) => button.setAttribute("aria-expanded", false));
    current.setAttribute("aria-expanded", true);
  }

  function toggleValue(tag, element) {
    if (tag === "select") return element.value;
    return element.dataset.toggle;
  }
  function toggleClass(target, value) {
    if (target.dataset.target === value) {
      target.classList.add("active");
      return;
    }
    target.classList.remove("active");
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
    overlay.addEventListener(
      "wheel",
      () => {
        if (timer !== null) return;

        overlay.classList.add("active");
        timer = setTimeout(function () {
          overlay.classList.remove("active");
          clearTimeout(timer);
          timer = null;
        }, 2000);
      },
      {
        passive: true,
      }
    );
    overlay.addEventListener("click", () => overlay.remove());
  });
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
  const lazyObjects = document.querySelectorAll("[data-lazyload]");

  if (!lazyObjects.length) return;

  if ("IntersectionObserver" in window) {
    const options = {
      // root: document.querySelector( '#viewport' ),
      rootMargin: "50px",
      threshold: [0, 0.5],
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
    if (item.hasAttribute("data-src")) {
      item.setAttribute("src", item.getAttribute("data-src"));
      item.removeAttribute("data-src");
    }
  }
}

function gallery() {
  const galleryObjects = document.querySelectorAll("[data-gallery]");

  if (!galleryObjects.length) return;

  // init
  const galleryWrapper = document.createElement("div");
  const closeButton = document.createElement("button");
  const galleryClassActive = "my-gallery_active";

  galleryWrapper.className = "my-gallery";
  closeButton.type = "button";
  closeButton.className = "my-gallery__close";
  closeButton.innerHTML = "<span class='sr-only'>Закрыть</span>";

  document.body.appendChild(galleryWrapper);
  galleryWrapper.appendChild(closeButton);
  const galleryImage = new Image();

  this.show = () => galleryWrapper.classList.add(galleryClassActive);
  this.hide = () => galleryWrapper.classList.remove(galleryClassActive);

  closeButton.addEventListener("click", () => {
    myPopupOverlay.hide();
    this.hide();
  });
  galleryWrapper.addEventListener("click", () => {
    myPopupOverlay.hide();
    this.hide();
  });

  galleryObjects.forEach((elem) => {
    const imageElement = elem.querySelector("img");
    if (!imageElement) return;

    const imageLink =
      imageElement.getAttribute("data-src") ||
      imageElement.getAttribute("src") ||
      "images/placeholder.svg";
    const imageSource = imageLink.replace("/thumbnails", "");

    elem.addEventListener("click", (event) => {
      this.showGalleryElement(event, imageSource);
    });
    elem.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
        this.showGalleryElement(e, imageSource);
      }
    });
  });

  this.showGalleryElement = (event, imageSource) => {
    event.preventDefault();
    myPopupOverlay.show();

    galleryImage.onload = () => galleryWrapper.appendChild(galleryImage);
    galleryImage.src = imageSource;
    galleryImage.alt = event.target.alt;
    this.show();
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
