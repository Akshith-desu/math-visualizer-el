function displayAlgebraResults(data, infoPanel, plotDiv) {
    // System of equations (both linear and nonlinear)
    if (data.type === 'algebra_system') {
        let solutionHTML = '';
        if (Array.isArray(data.solution) && data.solution.length > 0) {
            solutionHTML = data.solution.map((sol, idx) => {
                if (typeof sol === 'object' && sol !== null) {
                    const entries = Object.entries(sol).map(([k, v]) => {
                        const varName = k.toString();
                        const value = typeof v === 'number' ? v.toFixed(4) : v;
                        return `${varName} = ${value}`;
                    }).join(', ');
                    return `<div>Solution ${idx + 1}: ${entries}</div>`;
                }
                return `<div>Solution ${idx + 1}: ${JSON.stringify(sol)}</div>`;
            }).join('');
        } else {
            solutionHTML = '<div style="color: #f44336;">No solution found</div>';
        }
        
        infoPanel.innerHTML = `
            <div class="info-item">
                <div class="info-label">System Type:</div>
                <div class="info-value">${data.system_size} System ${data.is_nonlinear ? '(Nonlinear)' : '(Linear)'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Solution Method:</div>
                <div class="info-value">${data.solution_method}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Equations:</div>
                <div class="info-value" id="sys-equations"></div>
            </div>
            <div class="info-item">
                <div class="info-label">Solution:</div>
                <div class="info-value">${solutionHTML}</div>
            </div>
        `;
        
        const eqDiv = document.getElementById('sys-equations');
        if (eqDiv && data.latex && data.latex.equations) {
            data.latex.equations.forEach(eq => {
                const div = document.createElement('div');
                try {
                    katex.render(eq, div, { throwOnError: false });
                } catch (e) {
                    div.textContent = eq;
                }
                eqDiv.appendChild(div);
            });
        }
        
        // Plot system
        if (data.plot_data) {
            if (data.plot_data.type === 'system_2d_nonlinear') {
                plotNonlinearSystem(data.plot_data, plotDiv);
            } else if (data.plot_data.type === 'system_2d') {
                plotLinearSystem(data.plot_data, plotDiv);
            }
        } else {
            plotDiv.innerHTML = '<p style="text-align:center; padding:50px; color:#666;">System solved (3+ variables - no visualization)</p>';
        }
        return;
    }
    
    // Advanced Inequality with interval notation and sign chart
    if (data.type === 'algebra_inequality') {
        let signChartHTML = '';
        if (data.sign_chart && data.sign_chart.length > 0) {
            signChartHTML = `
                <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f0f0f0; font-weight: bold;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Interval</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Sign</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">In Solution?</th>
                    </tr>
                    ${data.sign_chart.map(row => `
                        <tr style="background: ${row.satisfies ? '#e8f5e9' : '#ffebee'};">
                            <td style="padding: 8px; border: 1px solid #ddd;">${row.interval}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${row.sign}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${row.satisfies ? '✓' : '✗'}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
        }
        
        infoPanel.innerHTML = `
            <div class="info-item">
                <div class="info-label">Type:</div>
                <div class="info-value">${data.is_rational ? 'Rational Inequality' : 'Polynomial Inequality'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Inequality:</div>
                <div class="info-value" id="ineq-expr"></div>
            </div>
            <div class="info-item">
                <div class="info-label">Interval Solution:</div>
                <div class="info-value" style="font-size: 1.1em; font-weight: bold; color: #667eea;">${data.interval_notation}</div>
            </div>
            ${data.critical_points && data.critical_points.length > 0 ? `
            <div class="info-item">
                <div class="info-label">Critical Points:</div>
                <div class="info-value">${data.critical_points.map(cp => cp.toFixed(2)).join(', ')}</div>
            </div>
            ` : ''}
            ${signChartHTML ? `
            <div class="info-item">
                <div class="info-label">Sign Chart:</div>
                <div class="info-value">${signChartHTML}</div>
            </div>
            ` : ''}
        `;
        
        const ineqDiv = document.getElementById('ineq-expr');
        if (ineqDiv && data.latex && data.latex.inequality) {
            try {
                katex.render(data.latex.inequality, ineqDiv, { throwOnError: false });
            } catch (e) {
                ineqDiv.textContent = data.inequality;
            }
        }
        
        // Plot inequality with number line
        plotInequalityAdvanced(data.plot_data, plotDiv);
        return;
    }
    
    // Absolute value / Radical
    if (data.type === 'algebra_absolute' || data.type === 'algebra_radical') {
        const typeLabel = data.type === 'algebra_absolute' ? 'Absolute Value' : 'Radical';
        const solutions = Array.isArray(data.solutions) ? data.solutions : [];
        const solutionText = solutions.length > 0 ? solutions.join(', ') : 'No real solutions';
        
        infoPanel.innerHTML = `
            <div class="info-item">
                <div class="info-label">Type:</div>
                <div class="info-value">${typeLabel} Equation</div>
            </div>
            <div class="info-item">
                <div class="info-label">Equation:</div>
                <div class="info-value" id="special-eq"></div>
            </div>
            <div class="info-item">
                <div class="info-label">Solutions:</div>
                <div class="info-value">${solutionText}</div>
            </div>
        `;
        
        const eqDiv = document.getElementById('special-eq');
        if (eqDiv && data.latex && data.latex.equation) {
            try {
                katex.render(data.latex.equation, eqDiv, { throwOnError: false });
            } catch (e) {
                eqDiv.textContent = data.equation || '';
            }
        }
        
        // Standard plot
        plotStandardAlgebra(data.plot_data, plotDiv, typeLabel);
        return;
    }
    
    // Regular algebra
    let additionalInfo = '';
    if (data.analysis && typeof data.analysis === 'object' && Object.keys(data.analysis).length > 0) {
        if (data.analysis.degree) {
            additionalInfo += `<div><strong>Degree:</strong> ${data.analysis.degree}</div>`;
        }
        if (data.analysis.partial_fractions) {
            additionalInfo += `<div><strong>Partial Fractions:</strong> ${data.analysis.partial_fractions}</div>`;
        }
    }
    
    const realSolutions = Array.isArray(data.real_solutions) && data.real_solutions.length > 0 
        ? data.real_solutions.map(s => typeof s === 'number' ? s.toFixed(4) : s).join(', ')
        : '';
    
    const complexSolutions = Array.isArray(data.complex_solutions) && data.complex_solutions.length > 0
        ? data.complex_solutions.join(', ')
        : '';
    
    infoPanel.innerHTML = `
        <div class="info-item">
            <div class="info-label">Equation Type:</div>
            <div class="info-value">${data.equation_type || 'Expression'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Expression:</div>
            <div class="info-value" id="alg-expression"></div>
        </div>
        <div class="info-item">
            <div class="info-label">Factored Form:</div>
            <div class="info-value" id="alg-factored"></div>
        </div>
        ${realSolutions ? `
        <div class="info-item">
            <div class="info-label">Real Solutions:</div>
            <div class="info-value">${realSolutions}</div>
        </div>
        ` : ''}
        ${complexSolutions ? `
        <div class="info-item">
            <div class="info-label">Complex Solutions:</div>
            <div class="info-value">${complexSolutions}</div>
        </div>
        ` : ''}
        ${additionalInfo ? `<div class="info-item"><div class="info-label">Additional:</div><div class="info-value">${additionalInfo}</div></div>` : ''}
    `;
    
    const exprDiv = document.getElementById('alg-expression');
    if (exprDiv && data.latex && data.latex.expression) {
        try {
            katex.render(data.latex.expression, exprDiv, { throwOnError: false });
        } catch (e) {
            exprDiv.textContent = data.original_expression || '';
        }
    }
    
    const factDiv = document.getElementById('alg-factored');
    if (factDiv && data.latex && data.latex.factored) {
        try {
            katex.render(data.latex.factored, factDiv, { throwOnError: false });
        } catch (e) {
            factDiv.textContent = data.factored || '';
        }
    }
    
    // Plot
    if (data.plot_data && data.plot_data.plot_type === 'complex_plane') {
        plotComplexPlane(data.plot_data, plotDiv);
    } else if (data.plot_data) {
        plotStandardAlgebra(data.plot_data, plotDiv, data.equation_type || 'Expression');
    }
}

function plotLinearSystem(plotData, plotDiv) {
    if (!plotData || !plotData.lines) {
        plotDiv.innerHTML = '<p style="text-align:center; padding:50px;">No plot data available</p>';
        return;
    }
    
    const traces = plotData.lines.map(line => ({
        x: line.x || [],
        y: line.y || [],
        name: line.name || 'Line',
        type: 'scatter',
        mode: 'lines',
        line: { width: 3 }
    }));
    
    if (plotData.solution_point && plotData.solution_point.x !== undefined) {
        traces.push({
            x: [plotData.solution_point.x],
            y: [plotData.solution_point.y],
            mode: 'markers',
            name: 'Solution',
            marker: { size: 15, color: 'red', symbol: 'x' }
        });
    }
    
    const layout = {
        title: 'Linear System of Equations',
        xaxis: { title: 'x', zeroline: true },
        yaxis: { title: 'y', zeroline: true },
        showlegend: true
    };
    
    Plotly.newPlot(plotDiv, traces, layout, { responsive: true });
}

function plotNonlinearSystem(plotData, plotDiv) {
    if (!plotData || !plotData.contours) {
        plotDiv.innerHTML = '<p style="text-align:center; padding:50px;">No plot data available</p>';
        return;
    }
    
    const traces = [];
    
    // Add contour plots for each equation
    plotData.contours.forEach((contour, idx) => {
        if (contour.x && contour.y && contour.z) {
            traces.push({
                x: contour.x[0] || [],
                y: (contour.y[0] || []).map((_, i) => contour.y[i] ? contour.y[i][0] : 0),
                z: contour.z || [],
                type: 'contour',
                name: contour.name || `Equation ${idx + 1}`,
                contours: {
                    start: -5,
                    end: 5,
                    size: 0.5,
                    coloring: 'lines'
                },
                line: { width: 2 },
                showscale: false
            });
        }
    });
    
    // Add solution points
    if (plotData.solution_points && Array.isArray(plotData.solution_points) && plotData.solution_points.length > 0) {
        traces.push({
            x: plotData.solution_points.map(p => p.x),
            y: plotData.solution_points.map(p => p.y),
            mode: 'markers',
            name: 'Solutions',
            marker: { size: 12, color: 'red', symbol: 'x' },
            type: 'scatter'
        });
    }
    
    const layout = {
        title: 'Nonlinear System of Equations',
        xaxis: { title: 'x' },
        yaxis: { title: 'y', scaleanchor: 'x' },
        showlegend: true
    };
    
    Plotly.newPlot(plotDiv, traces, layout, { responsive: true });
}

function plotInequalityAdvanced(plotData, plotDiv) {
    if (!plotData) {
        plotDiv.innerHTML = '<p style="text-align:center; padding:50px;">No plot data available</p>';
        return;
    }
    
    const traces = [
        {
            x: plotData.x || [],
            y: plotData.y || [],
            type: 'scatter',
            mode: 'lines',
            name: 'f(x)',
            line: { color: '#667eea', width: 3 }
        }
    ];
    
    // Add shaded solution regions
    if (plotData.shaded_regions && Array.isArray(plotData.shaded_regions) && plotData.shaded_regions.length > 0) {
        traces.push({
            x: plotData.shaded_regions.map(p => p.x),
            y: plotData.shaded_regions.map(p => p.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Solution Region',
            marker: { size: 3, color: 'rgba(102, 126, 234, 0.3)' }
        });
    }
    
    // Add critical points
    if (plotData.critical_points && Array.isArray(plotData.critical_points) && plotData.critical_points.length > 0) {
        traces.push({
            x: plotData.critical_points,
            y: Array(plotData.critical_points.length).fill(0),
            mode: 'markers',
            name: 'Critical Points',
            marker: { size: 10, color: 'red', symbol: 'circle' }
        });
    }
    
    const layout = {
        title: `Inequality: Solution = ${plotData.solution || 'See above'}`,
        xaxis: { title: 'x', zeroline: true },
        yaxis: { title: 'y', zeroline: true },
        showlegend: true
    };
    
    Plotly.newPlot(plotDiv, traces, layout, { responsive: true });
}

function plotStandardAlgebra(plotData, plotDiv, title) {
    if (!plotData) {
        plotDiv.innerHTML = '<p style="text-align:center; padding:50px;">No plot data available</p>';
        return;
    }
    
    const traces = [{
        x: plotData.x || [],
        y: plotData.y || [],
        type: 'scatter',
        mode: 'lines',
        line: { color: '#667eea', width: 3 },
        name: 'f(x)'
    }];
    
    if (plotData.solution_points && Array.isArray(plotData.solution_points) && plotData.solution_points.length > 0) {
        traces.push({
            x: plotData.solution_points.map(p => p.x),
            y: plotData.solution_points.map(p => p.y),
            mode: 'markers',
            name: 'Solutions',
            marker: { size: 12, color: '#f44336', symbol: 'x' }
        });
    }
    
    const layout = {
        title: title || 'Graph',
        xaxis: { title: 'x', zeroline: true },
        yaxis: { title: 'y', zeroline: true },
        showlegend: true
    };
    
    Plotly.newPlot(plotDiv, traces, layout, { responsive: true });
}

function plotComplexPlane(plotData, plotDiv) {
    if (!plotData || !plotData.real || !plotData.imag) {
        plotDiv.innerHTML = '<p style="text-align:center; padding:50px;">No complex solutions to plot</p>';
        return;
    }
    
    const trace = {
        x: plotData.real,
        y: plotData.imag,
        mode: 'markers+text',
        type: 'scatter',
        marker: { size: 12, color: '#667eea' },
        text: plotData.labels || [],
        textposition: 'top center'
    };
    
    const layout = {
        title: 'Complex Plane - Solutions',
        xaxis: { title: 'Real Part', zeroline: true },
        yaxis: { title: 'Imaginary Part', zeroline: true },
        showlegend: false
    };
    
    Plotly.newPlot(plotDiv, [trace], layout, { responsive: true });
}