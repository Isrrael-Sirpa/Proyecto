
import math

def bisection(f, a, b, tol=1e-6, max_iter=100):
    fa, fb = f(a), f(b)
    if fa * fb > 0:
        raise ValueError("El intervalo no encierra una raíz.")
    for i in range(max_iter):
        c = (a + b) / 2
        fc = f(c)
        if abs(fc) < tol or (b - a) / 2 < tol:
            return c
        if fa * fc < 0:
            b, fb = c, fc
        else:
            a, fa = c, fc
    return (a + b) / 2

def newton_raphson(f, df, x0, tol=1e-6, max_iter=100):
    x = x0
    for i in range(max_iter):
        fx = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-12:
            raise ZeroDivisionError("Derivada cercana a cero.")
        x_new = x - fx / dfx
        if abs(x_new - x) < tol:
            return x_new
        x = x_new
    return x

def secant(f, x0, x1, tol=1e-6, max_iter=100):
    f0, f1 = f(x0), f(x1)
    for i in range(max_iter):
        if abs(f1 - f0) < 1e-12:
            raise ZeroDivisionError("Diferencia de valores de función cercana a cero.")
        x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
        if abs(x2 - x1) < tol:
            return x2
        x0, f0, x1, f1 = x1, f1, x2, f(x2)
    return x1

def false_position(f, a, b, tol=1e-6, max_iter=100):
    fa, fb = f(a), f(b)
    if fa * fb > 0:
        raise ValueError("El intervalo no encierra una raíz.")
    for i in range(max_iter):
        c = (a * fb - b * fa) / (fb - fa)
        fc = f(c)
        if abs(fc) < tol:
            return c
        if fa * fc < 0:
            b, fb = c, fc
        else:
            a, fa = c, fc
    return (a * fb - b * fa) / (fb - fa)

PV, FV, n = 1000, 1500, 5
f1  = lambda r: PV * (1 + r)**n - FV
df1 = lambda r: PV * n * (1 + r)**(n - 1)

r_bis     = bisection(f1, 0, 1)
r_newton  = newton_raphson(f1, df1, 0.1)
r_secant  = secant(f1, 0, 0.5)
r_fpos    = false_position(f1, 0, 1)

print("Ejemplo 1: Tasa de interés efectiva (PV=1000, FV=1500, n=5)")
print(f"  Bisección:       r ≈ {r_bis:.6f}")
print(f"  Newton-Raphson:  r ≈ {r_newton:.6f}")
print(f"  Secante:         r ≈ {r_secant:.6f}")
print(f"  Falsa posición:  r ≈ {r_fpos:.6f}")
print()

f2  = lambda x: 200 + 30*x - 0.1*x**2 - 50*x
df2 = lambda x: 30 - 0.2*x - 50

x_bis     = bisection(f2, 0, 50)
x_newton  = newton_raphson(f2, df2, 10)
x_secant  = secant(f2, 0, 20)
x_fpos    = false_position(f2, 0, 50)

print("Ejemplo 2: Punto de equilibrio")
print(f"  Bisección:       x ≈ {x_bis:.6f}")
print(f"  Newton-Raphson:  x ≈ {x_newton:.6f}")
print(f"  Secante:         x ≈ {x_secant:.6f}")
print(f"  Falsa posición:  x ≈ {x_fpos:.6f}")
print()

g, v0 = 9.81, 20
f3  = lambda t: v0 * t - 0.5 * g * t**2
df3 = lambda t: v0 - g * t

t_bis     = bisection(f3, 0, 5)
t_newton  = newton_raphson(f3, df3, 2)
t_secant  = secant(f3, 0, 5)
t_fpos    = false_position(f3, 0, 5)

print("Ejemplo 3: Tiempo de vuelo de un proyectil (v0=20 m/s)")
print(f"  Bisección:       t ≈ {t_bis:.6f} s")
print(f"  Newton-Raphson:  t ≈ {t_newton:.6f} s")
print(f"  Secante:         t ≈ {t_secant:.6f} s")
print(f"  Falsa posición:  t ≈ {t_fpos:.6f} s")
