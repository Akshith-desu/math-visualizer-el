# 🧮 Math Visualizer

A comprehensive, interactive mathematics visualization tool that supports calculus, algebra, geometry, vectors, statistics, and custom graphing with real-time LaTeX rendering and advanced plotting.

---

## ✨ Features

### 📊 **Standard Mode**

- **Calculus Module**
  - Derivatives (1st, 2nd, 3rd order)
  - Indefinite & Definite Integrals
  - Limits (including one-sided and at infinity)
  - Taylor/Maclaurin Series
  - Partial Derivatives
  - Critical points, inflection points, interval analysis
- **Algebra Module**
  - Polynomial equations (all degrees)
  - Systems of equations (linear & nonlinear)
  - Inequalities with interval notation
  - Rational inequalities with sign analysis
  - Absolute value equations

- **Geometry Module**
  - Coordinate geometry (distance, midpoint, slope, line equations)
  - Circles (construction, tangent length)
  - Triangles (Pythagoras, centroid, circumcenter, analysis)
  - 2D Mensuration (rectangle, square, circle)
  - 3D Solids (cube, cuboid, cylinder, cone, sphere, hemisphere)
  - Conic sections visualization

### 📈 **Custom Graph Mode**

- Plot **any** mathematical function
- Supports:
  - Trigonometric functions: `sin`, `cos`, `tan`, `sec`, `csc`, `cot`
  - Inverse trig: `asin`, `acos`, `atan`
  - Hyperbolic: `sinh`, `cosh`, `tanh`
  - Exponential/Log: `exp`, `ln`, `log`
  - Advanced: `factorial`, `abs`, `ceil`, `floor`, `sqrt`
- Real-time parameter controls:
  - Amplitude, Frequency, Phase Shift, Vertical Shift
  - X-axis range adjustment
- Handles discontinuities (like `tan(x)`)
- 15+ pre-loaded example functions

### 📊 **Statistics & Probability Mode**

- **Descriptive Statistics**
  - Mean, median, mode, standard deviation, variance
  - Quartiles, IQR, five-number summary
  - Skewness, kurtosis
  - Box plots & histograms
  - CSV file upload support

- **Probability Distributions**
  - Normal Distribution (with probabilities & confidence intervals)
  - Binomial Distribution
  - Poisson Distribution

- **Hypothesis Testing**
  - One-sample t-test
  - Two-sample t-test
  - Z-test (known σ)
  - Visual p-value representation

- **Regression Analysis**
  - Linear regression
  - Polynomial regression (any degree)
  - R², RMSE, residual analysis

- **Correlation Analysis**
  - Pearson correlation
  - Spearman correlation
  - Scatter plots with trend lines

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **Live Server extension** (VS Code) or any local server

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/math-visualizer.git
   cd math-visualizer
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

---

## 🎯 Usage

### Step 1: Start the Backend Server

```bash
cd backend
python app.py
```

**Expected output:**

```
 * Running on http://localhost:5000
 * Backend is ready!
```

### Step 2: Start the Frontend

**Option A: Using VS Code Live Server**

1. Open `index.html` in VS Code
2. Right-click and select **"Open with Live Server"**
3. Browser will open at `http://127.0.0.1:5500/index.html`

**Option B: Using Python's built-in server**

```bash
# In the root directory (not backend)
python -m http.server 8000
```

Then open `http://localhost:8000/index.html`

**Option C: Direct file opening**

- Simply open `index.html` in your browser (may have CORS issues)

---

## 📖 User Guide

### Standard Mode Examples

#### Calculus

```latex
# Derivatives
x^2 + 2x + 1
\sin(x) \cdot e^{-x}
\frac{d}{dx} \cos(x^2)

# Integrals
\int_{0}^{1} x^2 dx
\int e^x \sin(x) dx

# Limits
\lim_{x \to 0} \frac{\sin(x)}{x}
\lim_{x \to \infty} \frac{1}{x}

# Taylor Series
taylor sin(x) order 5 at 0
```

#### Algebra

```latex
# Equations
x^2 - 5x + 6 = 0
x^3 + 2x^2 - 5x - 6 = 0

# Systems
x + y = 5; 2x - y = 1
x^2 + y^2 = 25; x + y = 7

# Inequalities
x^2 - 4 > 0
\frac{x-1}{x+2} \leq 0

# Absolute Value
|2x - 3| = 5
```

#### Geometry

```latex
# Coordinate Geometry
distance((1,2),(4,6))
midpoint((0,0),(4,4))
line(1,2,3,4)

# Circles
x^2 + y^2 = 25

# 3D Solids
cube(side=5)
sphere(3)
cylinder(2,10)
```

### Custom Graph Examples

```javascript
sin(x); // Sine wave
x ^ 2; // Parabola
cos(x) * exp(-x / 10); // Damped oscillation
tan(x); // Tangent (handles discontinuities)
1 / x; // Hyperbola
sin(x) / x; // Sinc function
x * sin(x); // Spiral
abs(x); // Absolute value
sin(x) + sin(1.2 * x); // Beat frequency
```

### Statistics Examples

**Descriptive Statistics:**

```
Data: 23, 45, 67, 34, 56, 78, 90, 12, 45, 67
```

**Normal Distribution:**

- Mean (μ): 100
- Std Dev (σ): 15
- X value: 110 (optional)

**Hypothesis Testing:**

- One-sample t-test
- Data: 52, 58, 61, 54, 49, 55, 57
- Population mean (μ₀): 50
- Significance (α): 0.05

---

## 🎨 Features Deep Dive

### Auto-Detection

The system automatically detects the type of mathematical input:

- **Calculus:** Detects integrals, derivatives, limits, series
- **Algebra:** Detects equations, inequalities, systems
- **Geometry:** Detects geometric functions and equations

### LaTeX Support

Comprehensive LaTeX parsing with support for:

- Fractions: `\frac{a}{b}`
- Roots: `\sqrt{x}`, `\sqrt[n]{x}`
- Trigonometry: `\sin`, `\cos`, `\tan`
- Greek letters: `\alpha`, `\beta`, `\theta`
- Operators: `\int`, `\lim`, `\sum`, `\prod`

### Visualization Types

- **2D Plots:** Line graphs, scatter plots, filled areas
- **3D Plots:** Surface plots, vector fields
- **Statistical Charts:** Histograms, box plots, bar charts
- **Complex Plane:** For complex solutions
- **Contour Plots:** For 2D equations and surfaces

---

## 🔧 Configuration

### Backend Settings (app.py)

```python
# Port configuration
PORT = 5000

# CORS settings (allow all origins by default)
CORS(app)

# Debug mode
app.run(debug=True, port=PORT)
```

### Frontend Settings

```javascript
// Backend URL (in js/app.js)
const BACKEND_URL = "http://localhost:5000";

// Plotting resolution (in js/script.js)
const numPoints = 2000; // Higher = smoother curves
```

---

## 🐛 Troubleshooting

### Backend not connecting

**Problem:** "Backend Offline" message
**Solutions:**

1. Check if Flask is running: `python app.py`
2. Verify port 5000 is not in use
3. Check firewall settings
4. Confirm CORS is enabled

### LaTeX not rendering

**Problem:** Raw LaTeX text instead of formatted math
**Solutions:**

1. Check KaTeX library is loaded
2. Clear browser cache
3. Verify `libs/katex.min.js` exists

### Plots not showing

**Problem:** Empty plot area
**Solutions:**

1. Check Plotly library is loaded
2. Open browser console for errors
3. Verify data format is correct
4. Check if backend returned valid data

### Import errors

**Problem:** `ModuleNotFoundError`
**Solutions:**

```bash
pip install --upgrade flask flask-cors sympy numpy scipy anthropic
```
