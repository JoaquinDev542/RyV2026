/**
 * calendario.js — Módulo de Calendario (solo lectura)
 * Rock & Vida España
 *
 * Las actividades se definen manualmente en ACTIVIDADES_DATA.
 * Los usuarios solo pueden consultar, nunca editar.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // DATOS DE ACTIVIDADES
  // Edita este objeto para gestionar el calendario.
  //
  // Formato de clave: "YYYY-MM-DD"
  // Cada día contiene un array de objetos con:
  //   hora  → string "HH:MM"
  //   lugar → string con el lugar
  //   desc  → string con la descripción
  // ─────────────────────────────────────────────────────────────
 // ─────────────────────────────────────────────────────────────
// BLOQUE 1 — DÍAS SUELTOS
//
// Añade aquí actividades puntuales que no se repiten.
//
// CÓMO AÑADIR UN DÍA SUELTO:
//   1. Escribe la fecha como clave: "YYYY-MM-DD"
//   2. Dentro, añade un objeto por actividad con hora, lugar y desc
//   3. Si hay varias actividades el mismo día, añade más objetos al array
//
// EJEMPLO (descomenta y edita):
// "2026-06-21": [
//   { hora: "11:00", lugar: "Parque del Retiro, Madrid", desc: "Picnic de verano" }
// ],
// "2026-12-28": [
//   { hora: "18:00", lugar: "Sede Arganda del Rey", desc: "Cena de Navidad" },
//   { hora: "21:00", lugar: "Sede Arganda del Rey", desc: "Brindis de fin de año" }
// ],
// ─────────────────────────────────────────────────────────────
const DIAS_SUELTOS = {

  // → Escribe aquí tus días sueltos:


};


// ─────────────────────────────────────────────────────────────
// BLOQUE 2 — EVENTOS RECURRENTES
//
// Añade aquí actividades que se repiten cada semana.
//
// CÓMO AÑADIR UNA RECURRENCIA:
//   1. Copia uno de los bloques de ejemplo de abajo
//   2. Cambia diaSemana: (0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb)
//   3. Rellena hora, lugar y desc
//
// CÓMO ELIMINAR UNA RECURRENCIA:
//   Borra el bloque completo { ... } o comenta la línea con //
// ─────────────────────────────────────────────────────────────
const REGLAS_RECURRENTES = [

  // → Jueves
  {
    diaSemana: 4,
    hora:      "19:00 – 21:00",
    lugar:     "Sede Arganda del Rey",
    desc:      "Quedada de ajedrez",
  },

  // → Viernes
  {
    diaSemana: 5,
    hora:      "19:00 – 21:00",
    lugar:     "Sede Arganda del Rey",
    desc:      "Quedada de ping pong y juegos de mesa",
  },

  // → Plantilla para nueva recurrencia (descomenta y rellena):
  // {
  //   diaSemana: 0,          // 0=Dom 1=Lun 2=Mar 3=Mié 4=Jue 5=Vie 6=Sáb
  //   hora:      "HH:MM",
  //   lugar:     "",
  //   desc:      "",
  // },

];


// ─────────────────────────────────────────────────────────────
// MOTOR — No tocar a partir de aquí
// Combina los días sueltos con los recurrentes en un solo objeto.
// ─────────────────────────────────────────────────────────────
function generarActividades() {
  // Copia los días sueltos como base del resultado
  const datos = {};
  Object.entries(DIAS_SUELTOS).forEach(([key, eventos]) => {
    datos[key] = [...eventos];
  });

  // Genera los recurrentes y los fusiona con los días sueltos
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
      datos[key].push({ hora: regla.hora, lugar: regla.lugar, desc: regla.desc });
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
    año: new Date().getFullYear(),
    mes: new Date().getMonth(),  // 0–11
    diaSeleccionado: null,       // "YYYY-MM-DD" o null
  };

  // ─────────────────────────────────────────────────────────────
  // REFERENCIAS AL DOM
  // ─────────────────────────────────────────────────────────────
  const els = {
    grid:       document.getElementById('cal-grid'),
    monthLabel: document.getElementById('cal-month-label'),
    prevBtn:    document.getElementById('cal-prev'),
    nextBtn:    document.getElementById('cal-next'),
    emptyState: document.getElementById('cal-empty-state'),
    dayView:    document.getElementById('cal-day-view'),
    dayTitle:   document.getElementById('cal-day-title'),
    eventsList: document.getElementById('cal-events-list'),
  };

  // ─────────────────────────────────────────────────────────────
  // ACCESO A LOS DATOS
  // ─────────────────────────────────────────────────────────────

  /** Devuelve las actividades de una fecha concreta (array, puede estar vacío) */
  function getActividadesDia(fechaKey) {
    return ACTIVIDADES_DATA[fechaKey] || [];
  }

  /** Devuelve un Set con las claves "YYYY-MM-DD" que tienen actividades en un mes dado */
  function diasConActividades(año, mes) {
    const prefijo = `${año}-${String(mes + 1).padStart(2, '0')}`;
    return new Set(
      Object.keys(ACTIVIDADES_DATA).filter(k =>
        k.startsWith(prefijo) && ACTIVIDADES_DATA[k].length > 0
      )
    );
  }

  // ─────────────────────────────────────────────────────────────
  // UTILIDADES DE FECHA
  // ─────────────────────────────────────────────────────────────

  /** Formatea una fecha como "YYYY-MM-DD" */
  function toKey(año, mes, dia) {
    return `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  /** Formatea una fecha para mostrarla al usuario */
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

    // Offset para empezar la semana en lunes
    const primerDia = new Date(año, mes, 1).getDay();
    const offsetLunes = primerDia === 0 ? 6 : primerDia - 1;

    const totalDias = new Date(año, mes + 1, 0).getDate();
    const hoy = new Date();
    const hoyKey = toKey(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const conActividades = diasConActividades(año, mes);

    els.grid.innerHTML = '';

    // Celdas vacías de relleno al inicio
    for (let i = 0; i < offsetLunes; i++) {
      const vacio = document.createElement('div');
      vacio.className = 'cal-day empty';
      els.grid.appendChild(vacio);
    }

    // Celdas de días
    for (let dia = 1; dia <= totalDias; dia++) {
      const key = toKey(año, mes, dia);
      const celda = document.createElement('button');
      celda.className = 'cal-day';
      celda.setAttribute('aria-label', `Ver actividades del día ${dia}`);

      const numSpan = document.createElement('span');
      numSpan.textContent = dia;
      celda.appendChild(numSpan);

      // Indicador visual si hay actividades
      if (conActividades.has(key)) {
        const dot = document.createElement('span');
        dot.className = 'cal-dot';
        dot.setAttribute('aria-hidden', 'true');
        celda.appendChild(dot);
      }

      if (key === hoyKey) celda.classList.add('today');
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
    els.dayView.style.display = 'flex';

    const titulo = formatFechaLarga(fechaKey);
    els.dayTitle.textContent = titulo.charAt(0).toUpperCase() + titulo.slice(1);

    renderEventos(fechaKey);
  }

  // ─────────────────────────────────────────────────────────────
  // RENDERIZADO DE EVENTOS (solo lectura)
  // ─────────────────────────────────────────────────────────────

  function renderEventos(fechaKey) {
    const actividades = getActividadesDia(fechaKey);
    els.eventsList.innerHTML = '';

    if (actividades.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'cal-no-events';
      vacio.textContent = 'No hay actividades programadas para este día.';
      els.eventsList.appendChild(vacio);
      return;
    }

    // Ordenar por hora antes de mostrar
    const ordenadas = [...actividades].sort((a, b) => a.hora.localeCompare(b.hora));

    ordenadas.forEach(act => {
      const item = document.createElement('div');
      item.className = 'cal-event-item';
      item.innerHTML = `
        <div class="cal-event-time">${escapeHtml(act.hora)}</div>
        <div class="cal-event-info">
          <div class="cal-event-desc">${escapeHtml(act.desc)}</div>
          <div class="cal-event-place">📍 ${escapeHtml(act.lugar)}</div>
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
  // EVENTOS DE NAVEGACIÓN
  // ─────────────────────────────────────────────────────────────

  function initEventos() {
    els.prevBtn.addEventListener('click', () => {
      estado.mes--;
      if (estado.mes < 0) { estado.mes = 11; estado.año--; }
      estado.diaSeleccionado = null;
      els.emptyState.style.display = '';
      els.dayView.style.display = 'none';
      renderCalendario();
    });

    els.nextBtn.addEventListener('click', () => {
      estado.mes++;
      if (estado.mes > 11) { estado.mes = 0; estado.año++; }
      estado.diaSeleccionado = null;
      els.emptyState.style.display = '';
      els.dayView.style.display = 'none';
      renderCalendario();
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
