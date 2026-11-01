document.addEventListener("DOMContentLoaded", () => {
  const DEMO_WHATSAPP_NUMBER = "";

  const showFormFeedback = (message, type) => {
    const formFeedback = document.getElementById("form-feedback");
    if (!formFeedback) {
      return;
    }

    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
  };

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const frame = image.closest(".image-panel, .about-media, .experience-panel");

      if (frame) {
        frame.classList.add("is-fallback");
      }

      image.style.display = "none";
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) {
      return;
    }

    if (item.classList.contains("is-open")) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqItems.forEach((faqItem) => {
        const faqButton = faqItem.querySelector(".faq-question");
        const faqAnswer = faqItem.querySelector(".faq-answer");

        if (!faqButton || !faqAnswer) {
          return;
        }

        faqItem.classList.remove("is-open");
        faqButton.setAttribute("aria-expanded", "false");
        faqAnswer.style.maxHeight = "0px";
      });

      if (!isExpanded) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  const bookingForm = document.getElementById("booking-form");

  if (bookingForm) {
    const submitButton = bookingForm.querySelector('button[type="submit"]');

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name");
      const whatsapp = document.getElementById("whatsapp");
      const treatment = document.getElementById("treatment");
      const contactWindow = document.getElementById("contactWindow");
      const requiredFields = [name, whatsapp, treatment, contactWindow];
      const hasEmptyField = requiredFields.some((field) => !field || !field.value.trim());

      if (hasEmptyField) {
        showFormFeedback("Preencha todos os campos obrigatórios para continuar.", "error");
        return;
      }

      const sanitizedWhatsapp = whatsapp.value.replace(/\D/g, "");

      if (sanitizedWhatsapp.length < 10 || sanitizedWhatsapp.length > 15) {
        showFormFeedback("Informe um WhatsApp válido com DDD e número.", "error");
        whatsapp.focus();
        return;
      }

      if (!submitButton) {
        return;
      }

      const configuredNumber = DEMO_WHATSAPP_NUMBER.replace(/\D/g, "");

      if (!configuredNumber) {
        showFormFeedback("A integração com WhatsApp está em modo de demonstração. Configure o número autorizado antes de abrir a conversa.", "error");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Abrindo WhatsApp...";

      const selectedTreatment = treatment.options[treatment.selectedIndex]?.text || "Tratamento de interesse";
      const selectedContactWindow = contactWindow.options[contactWindow.selectedIndex]?.text || "Melhor período";
      const message = encodeURIComponent(
        `Olá, INNOVA DERMA.\n\nNome: ${name.value.trim()}\nWhatsApp: ${sanitizedWhatsapp}\nTratamento de interesse: ${selectedTreatment}\nMelhor período para contato: ${selectedContactWindow}\n\nGostaria de agendar uma avaliação personalizada.`
      );

      const whatsappUrl = `https://wa.me/${configuredNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      showFormFeedback("A conversa no WhatsApp foi aberta em uma nova aba do navegador. Se a janela não abrir, configure o número demonstrativo.", "success");
      bookingForm.reset();

      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar para WhatsApp";
      }, 1200);
    });
  }
});
