/*
 games.js

 Descripción de los juegos interactivos con gráficas:

 Juego de Bisección:
   - Partimos de un intervalo [a, b] donde f(a)*f(b) < 0.
   - “Iniciar”: establece a=0, b=1.
   - “Siguiente”: calcula c=(a+b)/2; si f(a)*f(c)<0, b=c; si no, a=c.
   - Se dibuja la función y se marcan los puntos a, b y c.

 Juego de Newton–Raphson:
   - Aproximación inicial x0 (por ejemplo, 2).
   - “Iniciar”: fija x0.
   - “Siguiente”: calcula x_{n+1} = x_n - f(x_n)/f'(x_n).
   - Se dibuja la función y se marca la aproximación actual.

 Juego de Secante:
   - Dos puntos iniciales x0=0, x1=5.
   - “Iniciar”: fija x0 y x1.
   - “Siguiente”: calcula x2 = x1 - f(x1)*(x1-x0)/(f(x1)-f(x0)).
       Si denominador es cero, detiene el juego (convergencia).
   - Se dibuja la función y se marcan los puntos x0, x1 y x2.
*/

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('game-bisection')) initBisectionGame();
  if (document.getElementById('game-newton')) initNewtonGame();
  if (document.getElementById('game-secant')) initSecantGame();
});

let bisChart, newtonChart, secantChart;

// -------- Juego de Bisección --------
function initBisectionGame() {
  const f = x => 20 * x - 0.5 * 9.81 * x * x;
  // Preparar datos de la función en [0,1]
  const xs = Array.from({ length: 100 }, (_, i) => i / 99);
  const ys = xs.map(f);

  const ctx = document.getElementById('chart-bis').getContext('2d');
  bisChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'f(x)', data: xs.map((x,i) => ({ x, y: ys[i] })), showLine: true, fill: false },
        { label: 'Intervalo y Punto Medio', data: [], pointBackgroundColor: 'red', pointRadius: 6 }
      ]
    },
    options: { scales: { x: { type: 'linear', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'f(x)' } } } }
  });

  const startBtn = document.getElementById('start-bis');
  const nextBtn  = document.getElementById('next-bis');
  let a = 0, b = 1, iter = 0;

  startBtn.addEventListener('click', () => {
    iter = 1; a = 0; b = 1;
    const c = (a + b) / 2;
    updateBisection(iter, a, b, c, f);
    nextBtn.disabled = false;
  });

  nextBtn.addEventListener('click', () => {
    const c = (a + b) / 2;
    if (f(a) * f(c) < 0) b = c; else a = c;
    iter++;
    const cNew = (a + b) / 2;
    updateBisection(iter, a, b, cNew, f);
  });
}

function updateBisection(iter, a, b, c, f) {
  document.getElementById('bis-iter').textContent = iter;
  document.getElementById('bis-a').textContent = a.toFixed(4);
  document.getElementById('bis-b').textContent = b.toFixed(4);
  document.getElementById('bis-c').textContent = c.toFixed(4);

  // Actualizar gráfico
  bisChart.data.datasets[1].data = [
    { x: a, y: f(a) },
    { x: b, y: f(b) },
    { x: c, y: f(c) }
  ];
  bisChart.update();
}

// -------- Juego de Newton–Raphson --------
function initNewtonGame() {
  const f  = x => 20 * x - 0.5 * 9.81 * x * x;
  const df = x => 20 - 9.81 * x;
  const xs = Array.from({ length: 100 }, (_, i) => (5 * i) / 99);
  const ys = xs.map(f);

  const ctx = document.getElementById('chart-newton').getContext('2d');
  newtonChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'f(x)', data: xs.map((x,i) => ({ x, y: ys[i] })), showLine: true, fill: false },
        { label: 'Aproximación', data: [], pointBackgroundColor: 'blue', pointRadius: 6 }
      ]
    },
    options: { scales: { x: { type: 'linear', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'f(x)' } } } }
  });

  const startBtn = document.getElementById('start-new');
  const nextBtn  = document.getElementById('next-new');
  let x = 2, iter = 0;

  startBtn.addEventListener('click', () => {
    iter = 1; x = 2;
    updateNewton(iter, x, f);
    nextBtn.disabled = false;
  });

  nextBtn.addEventListener('click', () => {
    x = x - f(x) / df(x);
    iter++;
    updateNewton(iter, x, f);
  });
}

function updateNewton(iter, x, f) {
  document.getElementById('iter-new').textContent = iter;
  document.getElementById('x-new').textContent = x.toFixed(6);

  newtonChart.data.datasets[1].data = [{ x, y: f(x) }];
  newtonChart.update();
}

// -------- Juego de Secante --------
function initSecantGame() {
  const f = x => 20 * x - 0.5 * 9.81 * x * x;
  const xs = Array.from({ length: 100 }, (_, i) => (5 * i) / 99);
  const ys = xs.map(f);

  const ctx = document.getElementById('chart-secant').getContext('2d');
  secantChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'f(x)', data: xs.map((x,i) => ({ x, y: ys[i] })), showLine: true, fill: false },
        { label: 'Puntos Secante', data: [], pointBackgroundColor: 'green', pointRadius: 6 }
      ]
    },
    options: { scales: { x: { type: 'linear', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'f(x)' } } } }
  });

  const startBtn = document.getElementById('start-sec');
  const nextBtn  = document.getElementById('next-sec');
  let x0 = 0, x1 = 5, iter = 0;

  startBtn.addEventListener('click', () => {
    iter = 1; x0 = 0; x1 = 5;
    updateSecantDisplay(iter, x0, x1, '-', f);
    nextBtn.disabled = false;
  });

  nextBtn.addEventListener('click', () => {
    const f0 = f(x0), f1 = f(x1), denom = f1 - f0;
    if (Math.abs(denom) < 1e-12) {
      document.getElementById('x2-sec').textContent = 'Convergencia';
      nextBtn.disabled = true; return;
    }
    const x2 = x1 - f1 * (x1 - x0) / denom;
    iter++;
    updateSecantDisplay(iter, x0, x1, x2, f);
    x0 = x1; x1 = x2;
  });
}

function updateSecantDisplay(iter, x0, x1, x2, f) {
  document.getElementById('iter-sec').textContent = iter;
  document.getElementById('x0-sec').textContent = x0.toFixed(4);
  document.getElementById('x1-sec').textContent = x1.toFixed(4);
  document.getElementById('x2-sec').textContent = typeof x2 === 'number' ? x2.toFixed(4) : x2;

  secantChart.data.datasets[1].data = [
    { x: x0, y: f(x0) },
    { x: x1, y: f(x1) }
  ];
  if (typeof x2 === 'number') secantChart.data.datasets[1].data.push({ x: x2, y: f(x2) });
  secantChart.update();
}
