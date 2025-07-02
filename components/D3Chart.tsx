'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';

export interface D3ChartHandle {
  downloadPng: () => void;
}

interface D3ChartProps {
  data: Array<{ date: string; value: number; category?: string }>;
  height?: number;
  title?: string;
  chartType?: 'line' | 'bar';
  onDataPointClick?: (dataPoint: { date: string; value: number; category?: string }) => void;
}

const D3Chart = forwardRef<D3ChartHandle, D3ChartProps>(
  ({ data, height = 400, title, chartType = 'line', onDataPointClick }, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; content: string }>({
      show: false,
      x: 0,
      y: 0,
      content: ''
    });

    // Responsive width
    useEffect(() => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.offsetWidth);
      const resizeObserver = new window.ResizeObserver(entries => {
        if (!Array.isArray(entries)) return;
        if (!entries.length) return;
        setContainerWidth(entries[0].contentRect.width);
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
      if (!data || data.length === 0 || !svgRef.current || !containerRef.current) return;
      d3.select(svgRef.current).selectAll('*').remove();
      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const chartWidth = containerWidth - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      svg.attr('width', containerWidth).attr('height', height);
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const parseDate = d3.timeParse('%Y-%m-%d');
      const chartData = data.map(d => ({ ...d, date: parseDate(d.date) || new Date(d.date) }));
      const xScale = d3.scaleTime().domain(d3.extent(chartData, d => d.date) as [Date, Date]).range([0, chartWidth]);
      const yScale = d3.scaleLinear().domain([0, d3.max(chartData, d => d.value) || 0]).range([chartHeight, 0]);
      if (chartType === 'line') {
        const line = d3.line<{ date: Date; value: number }>()
          .x(d => xScale(d.date))
          .y(d => yScale(d.value))
          .curve(d3.curveMonotoneX);
        const gradient = svg.append('defs').append('linearGradient')
          .attr('id', 'line-gradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0)
          .attr('y1', yScale(d3.max(chartData, d => d.value) || 0))
          .attr('x2', 0)
          .attr('y2', yScale(0));
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#7c3aed').attr('stop-opacity', 0.3);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed').attr('stop-opacity', 0.1);
        const area = d3.area<{ date: Date; value: number }>()
          .x(d => xScale(d.date))
          .y0(chartHeight)
          .y1(d => yScale(d.value))
          .curve(d3.curveMonotoneX);
        // Animate area
        const areaPath = g.append('path')
          .datum(chartData)
          .attr('fill', 'url(#line-gradient)')
          .attr('d', area)
          .attr('opacity', 0);
        areaPath.transition().duration(800).attr('opacity', 1);
        // Animate line
        const linePath = g.append('path')
          .datum(chartData)
          .attr('fill', 'none')
          .attr('stroke', '#7c3aed')
          .attr('stroke-width', 3)
          .attr('d', line);
        const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
        linePath
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(900)
          .ease(d3.easeCubic)
          .attr('stroke-dashoffset', 0);
        // Animate dots
        const dots = g.selectAll('.dot').data(chartData).enter().append('circle')
          .attr('class', 'dot')
          .attr('cx', d => xScale(d.date))
          .attr('cy', d => yScale(d.value))
          .attr('r', 0)
          .attr('fill', '#7c3aed')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer');
        dots.transition().duration(600).delay((_, i) => i * 30).attr('r', 6);
        // Interactivity: vertical guide line and animated tooltip
        dots.on('mouseover', function(event, d) {
          d3.select(this).transition().duration(200).attr('r', 8).attr('fill', '#6d28d9');
          // Draw vertical guide line
          g.append('line')
            .attr('class', 'line-guide')
            .attr('x1', xScale(d.date))
            .attr('x2', xScale(d.date))
            .attr('y1', 0)
            .attr('y2', chartHeight)
            .attr('stroke', '#a78bfa')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2')
            .attr('opacity', 0.5);
          const formatDate = d3.timeFormat('%B %d, %Y');
          const formatValue = d3.format(',.0f');
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - containerRect.left;
            const y = event.clientY - containerRect.top;
            setTooltip({ show: true, x, y, content: `${formatDate(d.date)}<br/>Value: ${formatValue(d.value)}` });
          }
        })
        .on('mousemove', function(event, d) {
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - containerRect.left;
            const y = event.clientY - containerRect.top;
            setTooltip(prev => ({ ...prev, x, y }));
          }
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(200).attr('r', 6).attr('fill', '#7c3aed');
          g.selectAll('.line-guide').remove();
          setTooltip(prev => ({ ...prev, show: false }));
        })
        .on('click', function(event, d) {
          if (onDataPointClick) {
            // Add small delay to prevent conflicts with chart animations
            setTimeout(() => {
              onDataPointClick({ date: d.date.toISOString().split('T')[0], value: d.value, category: d.category });
            }, 50);
          }
        });
      } else if (chartType === 'bar') {
        // Use a band scale for bars
        const xBand = d3.scaleBand<Date>()
          .domain(chartData.map(d => d.date))
          .range([0, chartWidth])
          .padding(0.2);
        // Draw bars
        const bars = g.selectAll('.bar').data(chartData).enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xBand(d.date)!)
          .attr('y', chartHeight)
          .attr('width', xBand.bandwidth())
          .attr('height', 0)
          .attr('fill', '#7c3aed')
          .style('cursor', 'pointer');
        // Animate bars
        bars.transition()
          .duration(800)
          .attr('y', d => yScale(d.value))
          .attr('height', d => chartHeight - yScale(d.value))
          .delay((_, i) => i * 30);
        // Add interactivity
        bars.on('mouseover', function(event, d) {
          d3.select(this)
            .transition().duration(200)
            .attr('fill', '#6d28d9');
          // Draw vertical guide line
          g.append('line')
            .attr('class', 'bar-guide')
            .attr('x1', xBand(d.date)! + xBand.bandwidth() / 2)
            .attr('x2', xBand(d.date)! + xBand.bandwidth() / 2)
            .attr('y1', 0)
            .attr('y2', chartHeight)
            .attr('stroke', '#a78bfa')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2')
            .attr('opacity', 0.5);
          const formatDate = d3.timeFormat('%B %d, %Y');
          const formatValue = d3.format(',.0f');
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - containerRect.left;
            const y = event.clientY - containerRect.top;
            setTooltip({ show: true, x, y, content: `${formatDate(d.date)}<br/>Value: ${formatValue(d.value)}` });
          }
        })
        .on('mousemove', function(event, d) {
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - containerRect.left;
            const y = event.clientY - containerRect.top;
            setTooltip(prev => ({ ...prev, x, y }));
          }
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition().duration(200)
            .attr('fill', '#7c3aed');
          g.selectAll('.bar-guide').remove();
          setTooltip(prev => ({ ...prev, show: false }));
        })
        .on('click', function(event, d) {
          if (onDataPointClick) {
            // Add small delay to prevent conflicts with chart animations
            setTimeout(() => {
              onDataPointClick({ date: d.date.toISOString().split('T')[0], value: d.value, category: d.category });
            }, 50);
          }
        });
        // Adjust xAxis for band scale
        const xAxis = d3.axisBottom(xBand)
          .tickFormat((date, _i) => d3.timeFormat('%b %d')(date as Date));
        g.append('g').attr('transform', `translate(0,${chartHeight})`).call(xAxis)
          .selectAll('text').style('text-anchor', 'end').attr('dx', '-.8em').attr('dy', '.15em').attr('transform', 'rotate(-45)');
        // yAxis remains the same
        const yAxis = d3.axisLeft(yScale).tickFormat((d, _i) => d3.format(',.0f')(d as number));
        g.append('g').call(yAxis);
        // Grid lines
        g.append('g').attr('class', 'grid').attr('transform', `translate(0,${chartHeight})`).call(d3.axisBottom(xBand).tickSize(-chartHeight).tickFormat(() => ''))
          .style('stroke-dasharray', '3,3').style('opacity', 0.1);
        g.append('g').attr('class', 'grid').call(d3.axisLeft(yScale).tickSize(-chartWidth).tickFormat(() => ''))
          .style('stroke-dasharray', '3,3').style('opacity', 0.1);
      }
    }, [data, height, containerWidth, chartType]);

    // Download PNG logic
    useImperativeHandle(ref, () => ({
      downloadPng: () => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const canvas = document.createElement('canvas');
        canvas.width = svg.width.baseVal.value;
        canvas.height = svg.height.baseVal.value;
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = function () {
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${title || 'chart'}.png`;
            a.click();
          }, 'image/png');
        };
        img.src = url;
      }
    }), [title]);

    return (
      <div className="card">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div ref={containerRef} className="w-full relative">
          <svg
            ref={svgRef}
            className="w-full h-auto"
          />
          {/* Tooltip */}
          {tooltip.show && (
            <div
              className={`absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-50 transition-opacity duration-200 ${tooltip.show ? 'opacity-100' : 'opacity-0'}`}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -120%)'
              }}
              dangerouslySetInnerHTML={{ __html: tooltip.content }}
            />
          )}
        </div>
      </div>
    );
  }
);

export default D3Chart; 