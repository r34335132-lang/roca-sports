const dialog = document.querySelector(".mock-dialog");
const dialogTitle = document.querySelector("#mock-title");
const dialogBody = document.querySelector(".dialog-body");
const closeDialog = document.querySelector(".dialog-close");
const toast = document.querySelector(".mock-toast");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

let toastTimer;

function closeMobileMenu() {
  siteHeader.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMobileMenu();
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function openDialog(title, body) {
  dialogTitle.textContent = title;
  dialogBody.innerHTML = body;
  document.body.classList.add("modal-open");
  dialog.showModal();
}

function closeMockDialog() {
  dialog.close();
  document.body.classList.remove("modal-open");
}

function disciplinaBody(label) {
  return `
    <p><strong>${label}</strong> ya tiene una ficha mock lista para conectar con datos reales.</p>
    <div class="mock-list">
      <span>Categoría libre</span>
      <span>Inscripción abierta</span>
      <span>Tabla de posiciones demo</span>
      <span>Calendario de partidos demo</span>
    </div>
  `;
}

const mockContent = {
  registro: {
    title: "Registro de jugador",
    body: `
      <p>Este formulario es un mock visual. Simula el flujo para registrar equipos o jugadores.</p>
      <form>
        <input type="text" placeholder="Nombre completo" />
        <input type="tel" placeholder="Teléfono" />
        <select>
          <option>Fútbol</option>
          <option>Básquetbol</option>
          <option>Voleibol</option>
          <option>Futsal</option>
          <option>Pádel</option>
        </select>
        <button class="mock-submit" type="button">Enviar mock</button>
      </form>
    `,
  },
  calendario: {
    title: "Calendario",
    body: `
      <p>Vista mock de partidos próximos.</p>
      <div class="mock-schedule">
        <span><strong>Mié 29</strong> · Fútbol · Cancha Norte · 20:00</span>
        <span><strong>Jue 30</strong> · Básquetbol · Arena Centro · 19:30</span>
        <span><strong>Sáb 01</strong> · Pádel · Club Sur · 09:00</span>
      </div>
    `,
  },
  "todas-ligas": {
    title: "Todas las ligas",
    body: `
      <p>Mock de catálogo completo con filtros por disciplina, sede y nivel.</p>
      <div class="mock-list">
        <span>Fútbol 7</span>
        <span>Futsal</span>
        <span>Básquetbol 5x5</span>
        <span>Voleibol mixto</span>
        <span>Pádel principiantes</span>
        <span>Pádel competitivo</span>
      </div>
    `,
  },
  sedes: {
    title: "Sedes",
    body: `
      <p>Mock de mapa de sedes. Aquí iría la integración con Google Maps o una lista filtrable.</p>
      <div class="mock-list">
        <span>Cancha Norte</span>
        <span>Arena Centro</span>
        <span>Club Sur</span>
        <span>Unidad Poniente</span>
      </div>
    `,
  },
};

document.querySelectorAll("[data-mock]").forEach((control) => {
  control.addEventListener("click", (event) => {
    const mock = control.dataset.mock;
    const label = control.dataset.label || control.textContent.trim();

    if (mock === "ver-ligas") {
      event.preventDefault();
      document.querySelector("#ligas").scrollIntoView({ behavior: "smooth" });
      showToast("Mock: se muestran las ligas disponibles.");
      return;
    }

    if (mock === "disciplina") {
      openDialog(label, disciplinaBody(label));
      return;
    }

    if (mock === "match") {
      openDialog("Ficha del partido", `
        <p><strong>${label}</strong></p>
        <div class="mock-schedule">
          <span>Marcador, alineaciones y eventos minuto a minuto.</span>
          <span>Árbitro: Carlos Méndez · Sede: Arena Centro.</span>
          <span>Incidencias mock: goles, tarjetas, faltas y MVP.</span>
        </div>
      `);
      return;
    }

    if (mock === "filter") {
      showToast(`Filtro mock aplicado: ${label}.`);
      return;
    }

    if (mock === "report") {
      openDialog("Reporte estadístico", `
        <p>Vista mock para <strong>${label}</strong>.</p>
        <div class="mock-list">
          <span>Exportar CSV</span>
          <span>Filtrar por jornada</span>
          <span>Comparar equipos</span>
          <span>Compartir reporte</span>
        </div>
      `);
      return;
    }

    if (mock === "bracket") {
      openDialog("Bracket del torneo", `
        <p>Mock de llaves para <strong>${label}</strong>.</p>
        <div class="mock-schedule">
          <span>Cuartos · Titanes FC 4 - 1 Rockets</span>
          <span>Semifinal · Titanes FC vs Roca Norte</span>
          <span>Final · Sábado 20:30 · Cancha Norte</span>
        </div>
      `);
      return;
    }

    if (mock === "article") {
      openDialog(label, `
        <p>Mock editorial tipo previa/noticia. Aquí se mostrarían notas, highlights, fotos y análisis de rendimiento.</p>
      `);
      return;
    }

    if (mock === "venue") {
      openDialog(label, `
        <p>Mock de sede con ubicación, horarios, disponibilidad y reglas del espacio.</p>
        <div class="mock-list">
          <span>Reservar cancha</span>
          <span>Ver mapa</span>
          <span>Servicios</span>
          <span>Reglamento</span>
        </div>
      `);
      return;
    }

    if (mock === "download") {
      showToast(`Descarga mock preparada: ${label}.`);
      return;
    }

    if (mock === "contact-form") {
      showToast("Mensaje mock enviado. El formulario ya está listo para conectar.");
      return;
    }

    if (mock === "stat") {
      openDialog(label, `<p>Mock de detalle para <strong>${label}</strong>. Aquí se mostrarían métricas, filtros y comparativas.</p>`);
      return;
    }

    if (mock === "social") {
      openDialog(label, `<p>Mock de salida a <strong>${label}</strong>. En producción abriría el perfil oficial.</p>`);
      return;
    }

    if (mock === "contacto") {
      openDialog("Contacto", `<p>Mock de contacto seleccionado: <strong>${label}</strong>. Aquí se conectaría llamada, correo o mensaje directo.</p>`);
      return;
    }

    const content = mockContent[mock];
    if (content) {
      event.preventDefault();
      openDialog(content.title, content.body);
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("mock-submit")) {
    showToast("Mock enviado: falta conectar backend.");
    closeMockDialog();
  }
});

closeDialog.addEventListener("click", closeMockDialog);

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (isBackdrop) {
    closeMockDialog();
  }
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});
