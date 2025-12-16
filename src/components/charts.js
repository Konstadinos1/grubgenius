// Chart Components (SVG-based)
export function renderLineChart(data = [], options = {}) {
    const { width = 400, height = 200, color = '#8b5cf6' } = options;

    if (data.length === 0) {
        data = [30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 70, 90];
    }

    const maxValue = Math.max(...data);
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / maxValue) * height * 0.9;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${areaPoints}" fill="url(#chartGradient)"/>
      <polyline 
        points="${points}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      ${data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / maxValue) * height * 0.9;
        return `<circle cx="${x}" cy="${y}" r="4" fill="${color}" opacity="${index === data.length - 1 ? 1 : 0}"/>`;
    }).join('')}
    </svg>
  `;
}

export function renderBarChart(data = [], options = {}) {
    const { width = 400, height = 200, colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] } = options;

    if (data.length === 0) {
        data = [
            { label: 'Mon', value: 65 },
            { label: 'Tue', value: 80 },
            { label: 'Wed', value: 55 },
            { label: 'Thu', value: 90 },
            { label: 'Fri', value: 100 },
            { label: 'Sat', value: 85 },
            { label: 'Sun', value: 70 }
        ];
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width / data.length) * 0.6;
    const gap = (width / data.length) * 0.4;

    return `
    <svg width="100%" height="${height + 30}" viewBox="0 0 ${width} ${height + 30}">
      ${data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height * 0.85;
        const x = index * (barWidth + gap) + gap / 2;
        const y = height - barHeight;
        const color = colors[index % colors.length];

        return `
          <g class="bar-group">
            <rect 
              x="${x}" 
              y="${y}" 
              width="${barWidth}" 
              height="${barHeight}" 
              rx="4"
              fill="${color}"
              opacity="0.8"
            />
            <text 
              x="${x + barWidth / 2}" 
              y="${height + 20}" 
              text-anchor="middle" 
              font-size="11"
              fill="rgba(255,255,255,0.5)"
            >
              ${item.label}
            </text>
          </g>
        `;
    }).join('')}
    </svg>
  `;
}

export function renderDonutChart(data = [], options = {}) {
    const { size = 160, strokeWidth = 20 } = options;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    if (data.length === 0) {
        data = [
            { label: 'Direct', value: 40, color: '#8b5cf6' },
            { label: 'Search', value: 30, color: '#06b6d4' },
            { label: 'Social', value: 20, color: '#10b981' },
            { label: 'Other', value: 10, color: '#f59e0b' }
        ];
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentOffset = 0;

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${data.map(item => {
        const percentage = item.value / total;
        const dashLength = circumference * percentage;
        const dashOffset = circumference * currentOffset;
        currentOffset += percentage;

        return `
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="${item.color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${dashLength} ${circumference - dashLength}"
            stroke-dashoffset="${-dashOffset}"
            transform="rotate(-90 ${size / 2} ${size / 2})"
          />
        `;
    }).join('')}
      <text 
        x="${size / 2}" 
        y="${size / 2}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        font-size="24"
        font-weight="700"
        fill="white"
      >
        ${total}%
      </text>
    </svg>
  `;
}
