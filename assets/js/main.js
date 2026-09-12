/**
 * Lógica da página inicial (index.html): navbar, menu mobile,
 * rolagem suave até as seções, animação "reveal" ao rolar,
 * e renderização dos cards de serviço a partir de config.js.
 */

document.addEventListener("DOMContentLoaded", function () {
  setupNavbar();
  setupReveal();
  setupSelfieReveal();
  renderServices();
  setupLocations();
  setupWhatsappLinks();
  scrollToSectionFromHash();
});

/* ---------- Navbar / menu mobile ---------- */
function setupNavbar() {
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.innerHTML = isOpen ? iconX() : iconMenu();
    });
  }

  var sectionLinks = document.querySelectorAll("[data-scroll-to]");
  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (ev) {
      var id = link.getAttribute("data-scroll-to");
      var onIndexPage = document.body.dataset.page === "index";

      if (onIndexPage) {
        ev.preventDefault();
        var target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        if (menu) {
          menu.classList.remove("is-open");
          if (toggle) toggle.innerHTML = iconMenu();
        }
      } else {
        // Em outra página, navega para a home com o alvo na URL (#id)
        link.setAttribute("href", "index.html#" + id);
      }
    });
  });
}

/** Se a página abriu com um #hash (vindo de outra página), rola até lá */
function scrollToSectionFromHash() {
  if (document.body.dataset.page !== "index") return;
  var hash = window.location.hash.replace("#", "");
  if (!hash) return;
  window.setTimeout(function () {
    var target = document.getElementById(hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, 80);
}

/* ---------- Animação ao rolar (.reveal) ---------- */
function setupReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "-60px" },
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
}

/* ---------- Animação da foto (selfie) ao rolar ---------- */
function setupSelfieReveal() {
  var items = document.querySelectorAll(".selfie-reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
}

/* ---------- Cards de serviço ---------- */
function renderServices() {
  var grid = document.querySelector("[data-services-grid]");
  if (!grid) return;

  var html = siteConfig.services
    .map(function (s, i) {
      return (
        '<div class="service-card reveal">' +
        '<div class="service-card-top">' +
        '<span class="service-index">0' +
        (i + 1) +
        "</span>" +
        '<span class="service-duration">' +
        iconClock() +
        " " +
        s.durationMin +
        " min</span>" +
        "</div>" +
        '<h3 class="display">' +
        s.name +
        "</h3>" +
        '<p class="service-desc">' +
        s.description +
        "</p>" +
        '<div class="service-foot">' +
        '<span class="service-price display">' +
        PixUtils.formatBRL(s.price) +
        "</span>" +
        '<a class="service-link" href="agendar.html?service=' +
        s.id +
        '">Agendar ' +
        iconArrowRight() +
        "</a>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");

  html +=
    '<div class="service-card custom reveal">' +
    "<div>" +
    '<span class="service-index">+</span>' +
    '<h3 class="display">Projeto personalizado</h3>' +
    '<p class="service-desc">Não achou o que procura? Chame no WhatsApp e a gente desenha o seu orçamento sob medida.</p>' +
    "</div>" +
    '<div class="service-foot">' +
    '<span class="muted" style="font-size:0.9rem">Sob medida</span>' +
    '<a class="service-link" href="https://wa.me/' +
    siteConfig.whatsappNumber +
    '" target="_blank" rel="noreferrer">' +
    iconMessage() +
    " WhatsApp</a>" +
    "</div>" +
    "</div>";

  grid.innerHTML = html;
  setupReveal();
}

/* ---------- Locais do estúdio ---------- */
function setupLocations() {
  var containers = document.querySelectorAll("[data-locations]");

  if (!containers.length || !siteConfig.locations) return;

  containers.forEach(function (container) {
    container.innerHTML = siteConfig.locations
      .map(function (location) {
        var mapsUrl =
          "https://www.google.com/maps/search/?api=1&query=" +
          location.lat +
          "," +
          location.lng;

        return (
          '<a class="location-link" href="' +
          mapsUrl +
          '" target="_blank" rel="noreferrer">' +
          '<svg class="icon" viewBox="0 0 24 24">' +
          '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />' +
          '<circle cx="12" cy="10" r="3" />' +
          "</svg>" +
          "<span>" +
          location.name +
          "</span>" +
          "</a>"
        );
      })
      .join("");
  });
}

/* ---------- Links do WhatsApp / Instagram / endereço via config ---------- */
function setupWhatsappLinks() {
  document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
    el.setAttribute("href", "https://wa.me/" + siteConfig.whatsappNumber);
  });
  document.querySelectorAll("[data-instagram-link]").forEach(function (el) {
    el.setAttribute("href", siteConfig.instagram);
  });
  document.querySelectorAll("[data-address]").forEach(function (el) {
    el.textContent = siteConfig.address;
  });
  document.querySelectorAll("[data-city]").forEach(function (el) {
    el.textContent = siteConfig.city;
  });
  document.querySelectorAll("[data-tagline]").forEach(function (el) {
    el.textContent = siteConfig.tagline;
  });
  document.querySelectorAll("[data-studio-name]").forEach(function (el) {
    el.textContent = siteConfig.studioName;
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Ícones inline (substituem o lucide-react) ---------- */
function iconMenu() {
  return '<svg class="icon" viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
}
function iconX() {
  return '<svg class="icon" viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
}
function iconClock() {
  return '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>';
}
function iconArrowRight() {
  return '<svg class="icon" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>';
}
function iconMessage() {
  return '<svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
}
