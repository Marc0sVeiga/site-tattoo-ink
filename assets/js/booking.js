/**
 * Lógica da página de agendamento (agendar.html).
 * Porta direta do fluxo de 4 passos do Booking.tsx original,
 * sem framework: alterna a visibilidade dos passos e guarda o
 * estado em uma variável comum (bookingState).
 */

var bookingState = {
  step: 0,
  service: null,
  name: "",
  phone: "",
  date: "",
  time: "",
  message: "",
};

var STEP_LABELS = [
  { label: "Serviço", short: "Serviço" },
  { label: "Dados", short: "Dados" },
  { label: "Pagamento", short: "PIX" },
  { label: "Confirmado", short: "Feito" },
];

document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var preselectedId = params.get("service");
  if (preselectedId) {
    bookingState.service =
      siteConfig.services.find(function (s) {
        return s.id === preselectedId;
      }) || null;
  }

  renderStepsBar();
  renderStepService();
  goToStep(0, true);
});

/* ---------- Navegação entre passos ---------- */
function goToStep(step, skipScroll) {
  bookingState.step = step;

  document.querySelectorAll(".booking-step").forEach(function (el) {
    el.classList.toggle("active", el.dataset.step === String(step));
  });

  renderStepsBar();

  if (step === 1) renderStepDetails();
  if (step === 2) renderStepPayment();
  if (step === 3) renderStepConfirmation();

  if (!skipScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderStepsBar() {
  var bar = document.querySelector("[data-steps-bar]");
  if (!bar) return;
  bar.innerHTML = STEP_LABELS.map(function (s, i) {
    var active = i <= bookingState.step;
    return (
      '<li class="' +
      (active ? "active" : "") +
      '">' +
      "<span>" +
      (i + 1) +
      ". " +
      '<span class="step-short">' +
      s.short +
      "</span>" +
      '<span class="step-full">' +
      s.label +
      "</span>" +
      "</span></li>"
    );
  }).join("");
}

/* ============================================================
   Passo 1 — Serviço
   ============================================================ */
function renderStepService() {
  var grid = document.querySelector("[data-service-select-grid]");
  if (!grid) return;

  grid.innerHTML = siteConfig.services
    .map(function (s) {
      var selected = bookingState.service && bookingState.service.id === s.id;
      return (
        '<button type="button" class="service-pick ' +
        (selected ? "selected" : "") +
        '" data-service-id="' +
        s.id +
        '">' +
        '<span class="check-badge">' +
        iconCheck() +
        "</span>" +
        '<p class="name display">' +
        s.name +
        "</p>" +
        '<p class="desc">' +
        s.description +
        "</p>" +
        '<div class="row">' +
        '<span class="price display">' +
        PixUtils.formatBRL(s.price) +
        "</span>" +
        '<span class="duration">' +
        iconClock() +
        " " +
        s.durationMin +
        " min</span>" +
        "</div>" +
        "</button>"
      );
    })
    .join("");

  grid.querySelectorAll("[data-service-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-service-id");
      bookingState.service = siteConfig.services.find(function (s) {
        return s.id === id;
      });
      renderStepService();
      updateServiceNextButton();
    });
  });

  updateServiceNextButton();
}

function updateServiceNextButton() {
  var nextBtn = document.querySelector("[data-service-next]");
  if (nextBtn) nextBtn.disabled = !bookingState.service;
}

/* ============================================================
   Passo 2 — Dados
   ============================================================ */
function renderStepDetails() {
  var nameInput = document.getElementById("field-name");
  var phoneInput = document.getElementById("field-phone");
  var dateInput = document.getElementById("field-date");
  var timeSelect = document.getElementById("field-time");
  var messageInput = document.getElementById("field-message");

  if (nameInput) nameInput.value = bookingState.name;
  if (phoneInput) phoneInput.value = bookingState.phone;
  if (dateInput) {
    dateInput.value = bookingState.date;
    dateInput.min = formatDateInput(new Date());
  }
  if (messageInput) messageInput.value = bookingState.message;

  if (timeSelect && !timeSelect.dataset.filled) {
    var options = ['<option value="">Selecione…</option>'].concat(
      siteConfig.businessHours.map(function (h) {
        return '<option value="' + h + '">' + h + "</option>";
      }),
    );
    timeSelect.innerHTML = options.join("");
    timeSelect.dataset.filled = "true";
  }
  if (timeSelect) timeSelect.value = bookingState.time;

  clearFieldErrors();
}

function formatDateInput(dt) {
  var y = dt.getFullYear();
  var m = String(dt.getMonth() + 1).padStart(2, "0");
  var d = String(dt.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function clearFieldErrors() {
  document.querySelectorAll("[data-error-for]").forEach(function (el) {
    el.textContent = "";
  });
}

function setFieldError(field, message) {
  var el = document.querySelector('[data-error-for="' + field + '"]');
  if (el) el.textContent = message;
}

function handleDetailsSubmit(ev) {
  ev.preventDefault();
  clearFieldErrors();

  var name = document.getElementById("field-name").value.trim();
  var phone = document
    .getElementById("field-phone")
    .value.replace(/\D/g, "")
    .slice(0, 11);
  var date = document.getElementById("field-date").value;
  var time = document.getElementById("field-time").value;
  var message = document.getElementById("field-message").value.trim();

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var selected = date ? new Date(date + "T00:00:00") : null;
  var closedDay = selected
    ? siteConfig.openDays.indexOf(selected.getDay()) === -1
    : false;

  var hasError = false;

  if (name.length < 2) {
    setFieldError("name", "Informe seu nome.");
    hasError = true;
  }
  if (phone.length < 10 || phone.length > 11) {
    setFieldError("phone", "Informe um WhatsApp válido, com DDD.");
    hasError = true;
  }
  if (!date) {
    setFieldError("date", "Escolha uma data.");
    hasError = true;
  } else if (selected < today) {
    setFieldError("date", "A data não pode estar no passado.");
    hasError = true;
  } else if (closedDay) {
    setFieldError("date", "Estúdio fechado nesse dia.");
    hasError = true;
  }
  if (!time) {
    setFieldError("time", "Escolha um horário.");
    hasError = true;
  }

  if (hasError) return;

  bookingState.name = name;
  bookingState.phone = phone;
  bookingState.date = date;
  bookingState.time = time;
  bookingState.message = message;

  goToStep(2);
}

/* ============================================================
   Passo 3 — Pagamento (Pix)
   ============================================================ */
function renderStepPayment() {
  var s = bookingState.service;
  var signal = PixUtils.calcSignal(s.price);
  var txid = PixUtils.buildTxid(siteConfig.txidPrefix);
  var payload = PixUtils.buildPixPayload({
    key: siteConfig.pix.key,
    keyType: siteConfig.pix.keyType,
    merchantName: siteConfig.pix.merchantName,
    merchantCity: siteConfig.pix.merchantCity,
    amount: signal,
    txid: txid,
  });

  bookingState._signal = signal;
  bookingState._txid = txid;
  bookingState._payload = payload;

  var dateLabel = new Date(bookingState.date + "T00:00:00").toLocaleDateString(
    "pt-BR",
  );

  document.querySelector("[data-payment-service-name]").textContent = s.name;
  document.querySelector("[data-payment-datetime]").textContent =
    dateLabel + " · " + bookingState.time;
  document.querySelector("[data-payment-total]").textContent =
    PixUtils.formatBRL(s.price);
  document.querySelector("[data-payment-balance]").textContent =
    PixUtils.formatBRL(s.price - signal);
  document.querySelector("[data-payment-signal]").textContent =
    PixUtils.formatBRL(signal);
  document.querySelector("[data-pix-payload]").textContent = payload;
  document.querySelector("[data-signal-amount]").textContent =
    PixUtils.formatBRL(signal);

  var canvas = document.querySelector("[data-pix-qrcode]");

  if (!canvas) {
    console.error("QR Code: canvas não encontrado.");
  } else if (!window.QRCode) {
    console.error(
      "QR Code: biblioteca QRCode não carregou. Verifique a conexão ou o CDN.",
    );
  } else {
    // Limpa o canvas antes de gerar novamente
    var ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    QRCode.toCanvas(
      canvas,
      payload,
      {
        width: 176,
        height: 176,
        margin: 2,

        // QR branco
        color: {
          dark: "#FFFFFF",
          light: "#0A0A0A",
        },

        errorCorrectionLevel: "M",
      },
      function (error) {
        if (error) {
          console.error("Erro ao gerar QR Code PIX:", error);
          return;
        }

        console.log("QR Code PIX gerado com sucesso.");

        console.log("PIX:", payload);
      },
    );
  }

  var checkbox = document.getElementById("confirm-paid");
  var sendBtn = document.querySelector("[data-send-whatsapp]");
  if (checkbox && sendBtn) {
    checkbox.checked = false;
    sendBtn.disabled = true;
    checkbox.onchange = function () {
      sendBtn.disabled = !checkbox.checked;
    };
  }

  var copyBtn = document.querySelector("[data-copy-pix]");
  if (copyBtn) {
    copyBtn.onclick = function () {
      copyPixPayload(payload, copyBtn);
    };
  }
}

function copyPixPayload(payload, btn) {
  var label = btn.querySelector("[data-copy-label]");
  var icon = btn.querySelector("[data-copy-icon]");

  function markCopied() {
    if (label) label.textContent = "Copiado";
    if (icon) icon.innerHTML = iconCheck();
    window.setTimeout(function () {
      if (label) label.textContent = "Copiar";
      if (icon) icon.innerHTML = iconCopy();
    }, 2000);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(payload)
      .then(markCopied)
      .catch(function () {
        /* Clipboard indisponível — o texto permanece visível para cópia manual */
      });
  }
}

function sendWhatsAppConfirmation() {
  var s = bookingState.service;
  var dateLabel = new Date(bookingState.date + "T00:00:00").toLocaleDateString(
    "pt-BR",
  );

  var lines = [
    "Olá! Quero confirmar um agendamento no " + siteConfig.studioName + ".",
    "",
    "• Serviço: " + s.name,
    "• Data: " + dateLabel,
    "• Horário: " + bookingState.time,
    "• Valor do orçamento: " + PixUtils.formatBRL(s.price),
    "• Sinal pago (50%): " + PixUtils.formatBRL(bookingState._signal),
    "• Código da reserva: " + bookingState._txid,
    "",
    "Nome: " + bookingState.name,
    "WhatsApp: " + bookingState.phone,
  ];
  if (bookingState.message) lines.push("Observações: " + bookingState.message);
  lines.push(
    "",
    "Segue em anexo o comprovante do PIX. Aguardando confirmação!",
  );

  var msg = lines.join("\n");
  var url =
    "https://wa.me/" +
    siteConfig.whatsappNumber +
    "?text=" +
    encodeURIComponent(msg);
  window.open(url, "_blank", "noopener");

  try {
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify(
        Object.assign({}, bookingState, {
          confirmedAt: new Date().toISOString(),
        }),
      ),
    );
  } catch (e) {
    // armazenamento indisponível — segue o fluxo normalmente
  }

  goToStep(3);
}

/* ============================================================
   Passo 4 — Confirmação
   ============================================================ */
function renderStepConfirmation() {
  var s = bookingState.service;
  var dateLabel = new Date(bookingState.date + "T00:00:00").toLocaleDateString(
    "pt-BR",
  );

  var rows = [
    ["Serviço", s.name],
    ["Data", dateLabel],
    ["Horário", bookingState.time],
    ["Orçamento", PixUtils.formatBRL(s.price)],
    ["Sinal pago (50%)", PixUtils.formatBRL(bookingState._signal)],
    ["Nome", bookingState.name],
    ["WhatsApp", bookingState.phone],
  ];

  var container = document.querySelector("[data-confirmation-rows]");
  container.innerHTML = rows
    .map(function (r) {
      return (
        '<div class="row"><span>' +
        r[0] +
        "</span><span>" +
        r[1] +
        "</span></div>"
      );
    })
    .join("");
}

function restartBooking() {
  bookingState = {
    step: 0,
    service: null,
    name: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  };
  renderStepService();
  goToStep(0);
}

/* ---------- Ícones inline ---------- */
function iconCheck() {
  return '<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
}
function iconCopy() {
  return '<svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="1"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
}
function iconClock() {
  return '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>';
}
