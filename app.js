let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  //Init controller
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");

  //Loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".slide__reveal");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".slide__revealTxt");

    //GSAP
    //Creating Timeline
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: .7 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");

    //Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addTo(controller);

    //New Animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

const burger = document.querySelector(".burger");

function activeCursor(e) {
  const item = e.target;
  if (item.classList.contains("slide__btn")) {
    gsap.to(".slide__titleSwipe", 1, { y: "0%" });
  } else {
    gsap.to(".slide__titleSwipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (burger.classList.contains("active")) {
    e.target.classList.remove("active");
    gsap.to(".burger__line_1", 0.5, { rotate: "0", y: 0, background: "#A4A4A4" });
    gsap.to(".burger__line_2", 0.5, { rotate: "0", y: 0, background: "#A4A4A4" });
    gsap.to(".navBar", 1.5, { backgroundColor: "#17181a" });
    gsap.to(".navBar", 1, { clipPath: "circle(1px at 88.2% 53px)" });
    gsap.to(".logo", 1, { color: "#A4A4A4" });
    document.body.classList.remove("hide");
  } else {
    e.target.classList.add("active");
    gsap.to(".burger__line_1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".burger__line_2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to(".navBar", 0.5, { backgroundColor: "white" });
    gsap.to(".navBar", 1, { clipPath: "circle(2500px at 88.2% 53px)" });
    gsap.to(".logo", 1, { color: "black" });
    document.body.classList.add("hide");
  }
}

//Barba Page Transitions
const logo = document.querySelector(".logo");

barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "games",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current }) {
        let done = this.async();
        //An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        ); //stagger delay to each swipe div
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".game_slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" }, "-=1");
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
}

//EventListeners
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
