# -*- coding: utf-8 -*-
"""Test script for algebra module fixes"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

from modules.algebra import process_algebra, normalize_latex_input

print("=== Test 1: |2x - 3| = 5 ===")
try:
    result = process_algebra('|2x - 3| = 5')
    print(f'Solutions: {result["solutions"]}')
    print(f'Expected: x = 4 and x = -1')
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n=== Test 2: x^3 - 4x^2 - x + 4 >= 0 ===")
try:
    result = process_algebra('x^3 - 4x^2 - x + 4 >= 0')
    print(f'Interval Solution: {result["interval_notation"]}')
    print(f'Critical Points: {result["critical_points"]}')
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n=== Test 3: LaTeX Normalization ===")
try:
    # Test frac with sqrt
    latex = r'\frac{\sqrt{x-1}}{x+2}'
    normalized = normalize_latex_input(latex)
    print(f'Input: {latex}')
    print(f'Normalized: {normalized}')
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n=== Test 4: lvert/rvert normalization ===")
try:
    latex = r'\lvert x^2 - 9 \rvert < 4'
    normalized = normalize_latex_input(latex)
    print(f'Input: {latex}')
    print(f'Normalized: {normalized}')
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n=== Test 5: x^2 - 4 >= 0 ===")
try:
    result = process_algebra(r'x^2 - 4 >= 0')
    print(f'Interval Solution: {result["interval_notation"]}')
    print(f'Critical Points: {result["critical_points"]}')
except Exception as e:
    import traceback
    traceback.print_exc()
