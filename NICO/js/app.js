const phoneInternational = "40726297306";
const phoneDisplay = "0726 297 306";

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );
  revealElements.forEach((element) => observer.observe(element));
}

const counterElements = document.querySelectorAll("[data-counter]");

const animateCounter = (element) => {
  const target = Number(element.dataset.counter);
  const suffix = element.dataset.suffix || "";
  if (reducedMotion) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const startedAt = performance.now();
  const duration = 1000;
  const tick = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (counterElements.length) {
  const counterObserver = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterElements.forEach((element) => counterObserver.observe(element));
}

const journey = document.querySelector("[data-journey]");

if (journey) {
  const nodes = [...journey.querySelectorAll(".journey-node")];
  const title = journey.querySelector("[data-journey-title]");
  const description = journey.querySelector("[data-journey-description]");
  const number = journey.querySelector("[data-journey-number]");
  const progress = journey.querySelector(".journey-progress");
  const services = [
    {
      title: "Psihoterapie individuală CBT & DBT",
      description: "Intervenție adaptată pentru copii, adolescenți și adulți, cu obiective stabilite împreună după evaluare."
    },
    {
      title: "Psihoterapie de cuplu",
      description: "Sprijin pentru comunicare, gestionarea conflictelor, reconectare și clarificarea nevoilor relaționale."
    },
    {
      title: "Psihoterapie de familie",
      description: "Lucru colaborativ asupra tiparelor relaționale și a schimbărilor care afectează întregul sistem familial."
    },
    {
      title: "Evaluare psihologică",
      description: "Clarificăm profilul emoțional, cognitiv și comportamental, cu recomandări potrivite nevoii evaluate."
    },
    {
      title: "Terapie ocupațională",
      description: "Exersarea autonomiei și a abilităților funcționale pentru adulții cu dizabilități intelectuale."
    }
  ];
  let activeIndex = 0;

  const renderJourney = (nextIndex) => {
    activeIndex = (nextIndex + services.length) % services.length;
    const current = services[activeIndex];
    nodes.forEach((node, index) => {
      node.classList.toggle("is-active", index === activeIndex);
      node.setAttribute("aria-pressed", String(index === activeIndex));
    });
    title.textContent = current.title;
    description.textContent = current.description;
    number.textContent = String(activeIndex + 1).padStart(2, "0");
    if (progress) {
      const total = 640;
      progress.style.strokeDasharray = String(total);
      progress.style.strokeDashoffset = String(total - (total * activeIndex) / (services.length - 1));
    }
  };

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => renderJourney(index));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        renderJourney(index);
      }
    });
  });
  journey.querySelector("[data-journey-prev]")?.addEventListener("click", () => renderJourney(activeIndex - 1));
  journey.querySelector("[data-journey-next]")?.addEventListener("click", () => renderJourney(activeIndex + 1));
  renderJourney(0);
}

const expandableServices = document.querySelector("[data-expandable-services]");
const servicesToggle = document.querySelector("[data-services-toggle]");

if (expandableServices && servicesToggle) {
  const toggleLabel = servicesToggle.querySelector("[data-services-toggle-label]");
  servicesToggle.addEventListener("click", () => {
    const willExpand = servicesToggle.getAttribute("aria-expanded") !== "true";
    servicesToggle.setAttribute("aria-expanded", String(willExpand));
    expandableServices.classList.toggle("is-expanded", willExpand);
    if (toggleLabel) toggleLabel.textContent = willExpand ? "Restrânge serviciile" : "Vezi toate serviciile";

    if (willExpand) {
      expandableServices.querySelectorAll(".service-card").forEach((card) => card.classList.add("is-visible"));
    } else {
      expandableServices.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

document.querySelectorAll("[data-service-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const cards = [...carousel.querySelectorAll(".service-card")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  if (!track || !cards.length || !previous || !next) return;

  const metrics = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const step = cardWidth + gap;
    const visible = Math.max(1, Math.round((track.clientWidth + gap) / step));
    const first = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    return { step, visible, first };
  };

  const updateCarousel = () => {
    const { visible, first } = metrics();
    const last = Math.min(cards.length, first + visible);
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
    if (status) status.textContent = `${first + 1}–${last} din ${cards.length}`;
  };

  const moveCarousel = (direction) => {
    const { step } = metrics();
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  previous.addEventListener("click", () => moveCarousel(-1));
  next.addEventListener("click", () => moveCarousel(1));

  let carouselFrame = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(carouselFrame);
    carouselFrame = requestAnimationFrame(updateCarousel);
  }, { passive: true });
  window.addEventListener("resize", updateCarousel);

  const hashTarget = cards.find((card) => `#${card.id}` === window.location.hash);
  if (hashTarget) requestAnimationFrame(() => hashTarget.scrollIntoView({ block: "nearest", inline: "center" }));
  updateCarousel();
});

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answerId = question.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);
    question.setAttribute("aria-expanded", String(!isExpanded));
    if (answer) answer.hidden = isExpanded;
  });
});

const whatsappForm = document.querySelector("[data-whatsapp-form]");

whatsappForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(whatsappForm);
  const status = whatsappForm.querySelector(".form-status");
  const consent = whatsappForm.querySelector("[name='consent']");

  if (!consent?.checked) {
    status.textContent = "Te rugăm să confirmi acordul înainte de a continua.";
    return;
  }

  const message = [
    "Bună ziua, doamna Nicoleta Amihăesi!",
    `Mă numesc ${data.get("name") || ""}.`,
    `Doresc informații despre: ${data.get("service") || "o programare"}.`,
    data.get("message") ? `Mesaj: ${data.get("message")}` : "",
    data.get("phone") ? `Telefon pentru răspuns: ${data.get("phone")}` : ""
  ].filter(Boolean).join("\n");

  status.textContent = `Se deschide WhatsApp către ${phoneDisplay}.`;
  window.location.href = `https://wa.me/${phoneInternational}?text=${encodeURIComponent(message)}`;
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
