/**
 * calendario.js — Módulo de Calendario (solo lectura)
 * Rock & Vida España
 *
 * Novedades:
 *  - Propiedad "ciudad" en cada evento ("arganda" | "barcelona")
 *  - Filtro dinámico por ciudad
 *  - Lugar convertido en enlace a Google Maps
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // MAPA DE GOOGLE MAPS POR CIUDAD
  // Si añades una ciudad nueva, pon aquí su URL de Maps.
  // ─────────────────────────────────────────────────────────────
  const MAPS_URLS = {
    arganda:   'https://maps.google.com/?q=Leonor+de+Cortinas+25,+Arganda+del+Rey,+Madrid',
    barcelona: 'https://maps.google.com/?q=Barcelona,+Cataluña',
  };

  // ─────────────────────────────────────────────────────────────
// TELÉFONOS DE CONTACTO POR CIUDAD
// Para cambiar un número, edita solo este objeto.
// ─────────────────────────────────────────────────────────────
const CONTACTOS = {
  arganda:   '679 829 993',   // ← pon aquí el teléfono de Arganda
  barcelona: '680 155 598',   // ← pon aquí el teléfono de Barcelona
};

  // ─────────────────────────────────────────────────────────────
  // BLOQUE 1 — DÍAS SUELTOS
  //
  // CÓMO AÑADIR UN DÍA SUELTO:
  //   1. Clave: "YYYY-MM-DD"
  //   2. Campos: hora, lugar, desc, ciudad ("arganda" | "barcelona")
  //
  // EJEMPLO:
  // "2026-07-04": [
  //   { hora: "20:00", lugar: "Sede Arganda del Rey", desc: "Torneo especial", ciudad: "arganda" }
  // ],
  // ─────────────────────────────────────────────────────────────
  const DIAS_SUELTOS = {

    // → Escribe aquí tus días sueltos:

  };


  // ─────────────────────────────────────────────────────────────
  // BLOQUE 2 — EVENTOS RECURRENTES
  //
  // CÓMO AÑADIR UNA RECURRENCIA:
  //   diaSemana: 0=Dom 1=Lun 2=Mar 3=Mié 4=Jue 5=Vie 6=Sáb
  //   ciudad:    "arganda" | "barcelona"
  //
  // PLANTILLA:
  // {
  //   diaSemana: 0,
  //   hora:      "HH:MM",
  //   lugar:     "",
  //   desc:      "",
  //   ciudad:    "arganda",
  // },
  // ─────────────────────────────────────────────────────────────
  const REGLAS_RECURRENTES = [

    // → Jueves — Ajedrez
    {
      diaSemana: 4,
      hora:      "19:00 – 21:00",
      lugar:     "Sede Arganda del Rey",
      desc:      "Quedada de ajedrez",
      ciudad:    "arganda",
    },

    // → Viernes — Ping pong
    {
      diaSemana: 5,
      hora:      "19:00 – 21:00",
      lugar:     "Sede Arganda del Rey",
      desc:      "Quedada de ping pong y juegos de mesa",
      ciudad:    "arganda",
    },

    // → Sabado — Ping pong  y Ajedrez en Barcelona
    {
      diaSemana: 6,
      hora:      "18:00 – 20:00",
      lugar:     "Sede Barcelona",
      desc:      "Quedada de ping pong y ajedrez",
      ciudad:    "barcelona",
    }

  ];


  // ─────────────────────────────────────────────────────────────
  // MOTOR — No tocar a partir de aquí
  // ─────────────────────────────────────────────────────────────
  function generarActividades() {
    const datos = {};

    // Copiar días sueltos
    Object.entries(DIAS_SUELTOS).forEach(([key, eventos]) => {
      datos[key] = [...eventos];
    });

    // Generar recurrentes
    const hoy      = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finDeAño = new Date(hoy.getFullYear(), 11, 31);
    const cursor   = new Date(hoy);

    while (cursor <= finDeAño) {
      const diaSemana = cursor.getDay();

      REGLAS_RECURRENTES.forEach(regla => {
        if (regla.diaSemana !== diaSemana) return;

        const key = [
          cursor.getFullYear(),
          String(cursor.getMonth() + 1).padStart(2, '0'),
          String(cursor.getDate()).padStart(2, '0'),
        ].join('-');

        if (!datos[key]) datos[key] = [];
        datos[key].push({
          hora:   regla.hora,
          lugar:  regla.lugar,
          desc:   regla.desc,
          ciudad: regla.ciudad,
        });
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return datos;
  }

  const ACTIVIDADES_DATA = generarActividades();


  // ─────────────────────────────────────────────────────────────
  // NOMBRES DE MESES
  // ─────────────────────────────────────────────────────────────
  const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  // ─────────────────────────────────────────────────────────────
  // ESTADO INTERNO
  // ─────────────────────────────────────────────────────────────
  const estado = {
    año:             new Date().getFullYear(),
    mes:             new Date().getMonth(),
    diaSeleccionado: null,
    filtro:          'todas',   // ← nuevo: ciudad activa
  };


  // ─────────────────────────────────────────────────────────────
  // REFERENCIAS AL DOM
  // ─────────────────────────────────────────────────────────────
  const els = {
    grid:        document.getElementById('cal-grid'),
    monthLabel:  document.getElementById('cal-month-label'),
    prevBtn:     document.getElementById('cal-prev'),
    nextBtn:     document.getElementById('cal-next'),
    emptyState:  document.getElementById('cal-empty-state'),
    dayView:     document.getElementById('cal-day-view'),
    dayTitle:    document.getElementById('cal-day-title'),
    eventsList:  document.getElementById('cal-events-list'),
    filtroBtns:  document.querySelectorAll('.cal-filtro-btn'),
  };


  // ─────────────────────────────────────────────────────────────
  // ACCESO Y FILTRADO DE DATOS
  // ─────────────────────────────────────────────────────────────

  /**
   * Devuelve los eventos de un día filtrados por ciudad activa.
   * Si el filtro es "todas", devuelve todos.
   */
  function getActividadesDia(fechaKey) {
    const todos = ACTIVIDADES_DATA[fechaKey] || [];
    if (estado.filtro === 'todas') return todos;
    return todos.filter(a => a.ciudad === estado.filtro);
  }

  /**
   * Devuelve un Set de claves "YYYY-MM-DD" con eventos visibles
   * en el mes dado, respetando el filtro activo.
   */
  function diasConActividades(año, mes) {
    const prefijo = `${año}-${String(mes + 1).padStart(2, '0')}`;
    const claves  = Object.keys(ACTIVIDADES_DATA).filter(k => k.startsWith(prefijo));

    return new Set(
      claves.filter(k => getActividadesDia(k).length > 0)
    );
  }


  // ─────────────────────────────────────────────────────────────
  // UTILIDADES DE FECHA
  // ─────────────────────────────────────────────────────────────

  function toKey(año, mes, dia) {
    return `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  function formatFechaLarga(fechaKey) {
    const [a, m, d] = fechaKey.split('-').map(Number);
    const fecha = new Date(a, m - 1, d);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }


  // ─────────────────────────────────────────────────────────────
  // RENDERIZADO DEL CALENDARIO
  // ─────────────────────────────────────────────────────────────

  function renderCalendario() {
    const { año, mes } = estado;
    els.monthLabel.textContent = `${MESES[mes]} ${año}`;

    const primerDia    = new Date(año, mes, 1).getDay();
    const offsetLunes  = primerDia === 0 ? 6 : primerDia - 1;
    const totalDias    = new Date(año, mes + 1, 0).getDate();
    const hoy          = new Date();
    const hoyKey       = toKey(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const conEventos   = diasConActividades(año, mes);

    els.grid.innerHTML = '';

    for (let i = 0; i < offsetLunes; i++) {
      const vacio = document.createElement('div');
      vacio.className = 'cal-day empty';
      els.grid.appendChild(vacio);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const key   = toKey(año, mes, dia);
      const celda = document.createElement('button');
      celda.className = 'cal-day';
      celda.setAttribute('aria-label', `Ver actividades del día ${dia}`);

      const numSpan = document.createElement('span');
      numSpan.textContent = dia;
      celda.appendChild(numSpan);

      if (conEventos.has(key)) {
        const dot = document.createElement('span');
        dot.className = 'cal-dot';
        dot.setAttribute('aria-hidden', 'true');
        celda.appendChild(dot);
      }

      if (key === hoyKey)               celda.classList.add('today');
      if (key === estado.diaSeleccionado) celda.classList.add('selected');

      celda.addEventListener('click', () => seleccionarDia(key));
      els.grid.appendChild(celda);
    }
  }


  // ─────────────────────────────────────────────────────────────
  // SELECCIÓN DE DÍA
  // ─────────────────────────────────────────────────────────────

  function seleccionarDia(fechaKey) {
    estado.diaSeleccionado = fechaKey;
    renderCalendario();

    els.emptyState.style.display = 'none';
    els.dayView.style.display    = 'flex';

    const titulo = formatFechaLarga(fechaKey);
    els.dayTitle.textContent = titulo.charAt(0).toUpperCase() + titulo.slice(1);

    renderEventos(fechaKey);
  }


  // ─────────────────────────────────────────────────────────────
  // RENDERIZADO DE EVENTOS
  // El lugar se convierte en enlace a Google Maps si la ciudad
  // tiene una URL definida en MAPS_URLS.
  // ─────────────────────────────────────────────────────────────

 function renderEventos(fechaKey) {
  const actividades = getActividadesDia(fechaKey);
  els.eventsList.innerHTML = '';

  if (actividades.length === 0) {
    const vacio = document.createElement('p');
    vacio.className   = 'cal-no-events';
    vacio.textContent = estado.filtro === 'todas'
      ? 'No hay actividades programadas para este día.'
      : `No hay actividades en ${estado.filtro === 'arganda' ? 'Arganda del Rey' : 'Barcelona'} este día.`;
    els.eventsList.appendChild(vacio);
    return;
  }

  const ordenadas = [...actividades].sort((a, b) => a.hora.localeCompare(b.hora));

  ordenadas.forEach(act => {
    // Lugar: enlace a Maps si existe URL para esa ciudad
    const mapsUrl   = MAPS_URLS[act.ciudad];
    const lugarHtml = mapsUrl
      ? `<a href="${mapsUrl}" target="_blank" rel="noopener" title="Ver en Google Maps">${escapeHtml(act.lugar)}</a>`
      : escapeHtml(act.lugar);

    // Teléfono: número de la ciudad del evento, o vacío si no está definido
    const telefono  = CONTACTOS[act.ciudad] || null;
    const telHtml   = telefono
      ? `<div class="cal-event-phone">
           <a href="tel:${telefono.replace(/\s/g, '')}" title="Llamar">
             📞 ${escapeHtml(telefono)}
           </a>
         </div>`
      : '';

    const item = document.createElement('div');
    item.className = 'cal-event-item';
    item.innerHTML = `
      <div class="cal-event-time">${escapeHtml(act.hora)}</div>
      <div class="cal-event-info">
        <div class="cal-event-desc">${escapeHtml(act.desc)}</div>
        <div class="cal-event-place">📍 ${lugarHtml}</div>
        ${telHtml}
      </div>
    `;
    els.eventsList.appendChild(item);
  });
}

  // ─────────────────────────────────────────────────────────────
  // UTILIDADES
  // ─────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  // ─────────────────────────────────────────────────────────────
  // EVENTOS DE NAVEGACIÓN Y FILTRO
  // ─────────────────────────────────────────────────────────────

  function initEventos() {

    // Navegación de meses
    els.prevBtn.addEventListener('click', () => {
      estado.mes--;
      if (estado.mes < 0) { estado.mes = 11; estado.año--; }
      estado.diaSeleccionado = null;
      els.emptyState.style.display = '';
      els.dayView.style.display    = 'none';
      renderCalendario();
    });

    els.nextBtn.addEventListener('click', () => {
      estado.mes++;
      if (estado.mes > 11) { estado.mes = 0; estado.año++; }
      estado.diaSeleccionado = null;
      els.emptyState.style.display = '';
      els.dayView.style.display    = 'none';
      renderCalendario();
    });

    // Filtro por ciudad
    els.filtroBtns.forEach(btn => {
      btn.addEventListener('click', () => {

        // Actualizar estado y estilos de botones
        estado.filtro = btn.dataset.ciudad;
        els.filtroBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Redibujar el calendario con el nuevo filtro
        renderCalendario();

        // Si hay un día seleccionado, actualizar su lista de eventos
        if (estado.diaSeleccionado) {
          renderEventos(estado.diaSeleccionado);
        }
      });
    });
  }


  // ─────────────────────────────────────────────────────────────
  // INICIALIZACIÓN
  // ─────────────────────────────────────────────────────────────

 function init() {
  initEventos();
  renderCalendario();
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
