// ---- pestañas en soluciones ----
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });

  // Cargar resultados y gráficas
  computeAndPlot();
  // Inicializar juego de bisección
  initBisectionGame();
});

// ---- Métodos numéricos ----
function bisection(f,a,b,tol=1e-6){
  let fa=f(a), fb=f(b), c;
  if(fa*fb>0) throw 'Intervalo no válido';
  while((b-a)/2>tol){
    c=(a+b)/2;
    if(f(c)===0) return c;
    if(f(a)*f(c)<0) b=c;
    else a=c;
  }
  return (a+b)/2;
}
function newton(f,df,x0,tol=1e-6,maxIter=50){
  let x=x0;
  for(let i=0;i<maxIter;i++){
    let fx=f(x), dfx=df(x);
    x -= fx/dfx;
    if(Math.abs(fx)<tol) break;
  }
  return x;
}
function secant(f,x0,x1,tol=1e-6,maxIter=50){
  let f0=f(x0), f1=f(x1), x2;
  for(let i=0;i<maxIter;i++){
    x2 = x1 - f1*(x1-x0)/(f1-f0);
    if(Math.abs(x2-x1)<tol) break;
    x0=x1; f0=f1; x1=x2; f1=f(x2);
  }
  return x2;
}
function falsePosition(f,a,b,tol=1e-6,maxIter=50){
  let fa=f(a), fb=f(b), c;
  for(let i=0;i<maxIter;i++){
    c=(a*fb - b*fa)/(fb-fa);
    if(Math.abs(f(c))<tol) break;
    if(f(a)*f(c)<0) fb=f(c), b=c;
    else fa=f(c), a=c;
  }
  return c;
}

// ---- Computar y graficar soluciones ----
function computeAndPlot(){
  // Ejercicio 1
  const f1 = r => 1000*Math.pow(1+r,5)-1500;
  const df1 = r => 1000*5*Math.pow(1+r,4);
  const r_b = bisection(f1,0,1);
  const r_n = newton(f1,df1,0.1);
  const r_s = secant(f1,0,0.5);
  const r_f = falsePosition(f1,0,1);
  document.getElementById('r_bis1').textContent = r_b.toFixed(6);
  document.getElementById('r_newton1').textContent = r_n.toFixed(6);
  document.getElementById('r_secant1').textContent = r_s.toFixed(6);
  document.getElementById('r_fpos1').textContent = r_f.toFixed(6);
  plot('chart1', f1, -0.1, 1);

  // Ejercicio 2
  const f2 = x => 200 + 30*x - 0.1*x*x - 50*x;
  const df2 = x => 30 - 0.2*x - 50;
  const x_b = bisection(f2,0,50);
  const x_n = newton(f2,df2,10);
  const x_s = secant(f2,0,20);
  const x_f = falsePosition(f2,0,50);
  document.getElementById('x_bis2').textContent = x_b.toFixed(6);
  document.getElementById('x_newton2').textContent = x_n.toFixed(6);
  document.getElementById('x_secant2').textContent = x_s.toFixed(6);
  document.getElementById('x_fpos2').textContent = x_f.toFixed(6);
  plot('chart2', f2, 0, 50);

  // Ejercicio 3
  const f3 = t => 20*t - 0.5*9.81*t*t;
  const df3 = t => 20 - 9.81*t;
  const t_b = bisection(f3,0,5);
  const t_n = newton(f3,df3,2);
  const t_s = secant(f3,0,5);
  const t_f = falsePosition(f3,0,5);
  document.getElementById('t_bis3').textContent = t_b.toFixed(6);
  document.getElementById('t_newton3').textContent = t_n.toFixed(6);
  document.getElementById('t_secant3').textContent = t_s.toFixed(6);
  document.getElementById('t_fpos3').textContent = t_f.toFixed(6);
  plot('chart3', f3, 0, 5);
}

function plot(id, f, minX, maxX){
  const ctx = document.getElementById(id).getContext('2d');
  const labels = [], data = [];
  for(let i=0;i<=100;i++){
    const x = minX + (maxX-minX)*i/100;
    labels.push(x.toFixed(2));
    data.push(f(x));
  }
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'f(x)', data, fill: false }] },
    options: { responsive: true }
  });
}

// ---- Juego de Bisección ----
function initBisectionGame(){
  const btnStart = document.getElementById('start-bis');
  const btnNext  = document.getElementById('next-bis');
  let a=0, b=1, iter=0;

  btnStart.addEventListener('click', () => {
    iter = 1; a = 0; b = 1;
    const c = (a+b)/2;
    updateBisDisplay(iter,a,b,c);
    btnNext.disabled = false;
  });

  btnNext.addEventListener('click', () => {
    const c = (a+b)/2;
    // ejemplo usando f3 para demostrar
    const f = t => 20*t - 0.5*9.81*t*t;
    if (f(a)*f(c) < 0) {
      b = c;
    } else {
      a = c;
    }
    iter++;
    const cNew = (a+b)/2;
    updateBisDisplay(iter,a,b,cNew);
  });
}

function updateBisDisplay(iter,a,b,c){
  document.getElementById('bis-iter').textContent = iter;
  document.getElementById('bis-a').textContent = a.toFixed(4);
  document.getElementById('bis-b').textContent = b.toFixed(4);
  document.getElementById('bis-c').textContent = c.toFixed(4);
}
