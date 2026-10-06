'use strict';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('calendar-grid');
  if (!label || !grid) return;

  label.textContent = MONTHS[calMonth] + ' ' + calYear;
  grid.innerHTML = '';

  // Day headers
  DAYS_SHORT.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-day-header';
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay  = new Date(calYear, calMonth, 1).getDay();
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
  const today     = new Date();
  const todayStr  = today.toISOString().slice(0, 10);

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div');
    e.className = 'cal-day empty';
    grid.appendChild(e);
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const cell    = document.createElement('div');
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const thisDate= new Date(calYear, calMonth, d);
    const isPast  = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSun   = thisDate.getDay() === 0;

    cell.className = 'cal-day';
    cell.textContent = d;

    if (isPast || isSun) {
      cell.classList.add('disabled');
    } else {
      cell.classList.add('has-slots');
      if (dateStr === todayStr)    cell.classList.add('today');
      if (selectedDate === dateStr) cell.classList.add('selected');
      cell.addEventListener('click', () => selectDate(dateStr));
    }
    grid.appendChild(cell);
  }
}

function selectDate(dateStr) {
  selectedDate = dateStr;
  selectedTime = null;
  renderCalendar();

  const container = document.getElementById('time-slots-container');
  const lbl       = document.getElementById('selected-date-label');
  const slotsGrid = document.getElementById('slots-grid');
  const summary   = document.getElementById('booking-summary');

  if (!container || !lbl || !slotsGrid) return;

  // Format the date nicely
  const d = new Date(dateStr + 'T00:00:00');
  lbl.textContent = 'Available times — ' + d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
  container.style.display = 'block';
  if (summary) summary.style.display = 'none';

  const TIMES = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];
  const booked = (typeof appointments !== 'undefined' ? appointments : [])
    .filter(a => a.date === dateStr && a.status !== 'cancelled')
    .map(a => a.time);

  slotsGrid.innerHTML = TIMES.map(t => {
    const busy = booked.includes(t);
    return `<div class="slot${busy ? ' booked' : ''}" ${!busy ? `onclick="selectTime('${t}',this)"` : ''}>
      ${t}${busy ? '<br><span style="font-size:10px;opacity:0.6">Booked</span>' : ''}
    </div>`;
  }).join('');
}

function selectTime(time, el) {
  selectedTime = time;
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  if (el) el.classList.add('selected');
  const summary = document.getElementById('booking-summary');
  if (summary) {
    summary.style.display = 'block';
    const d = new Date(selectedDate + 'T00:00:00');
    summary.textContent = 'Selected: ' + d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) + ' at ' + time;
  }
}
