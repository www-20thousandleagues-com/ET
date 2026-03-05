---
name: chart-builder
description: Build interactive data visualizations and charts
argument-hint: <chart-type> <data-description> (e.g., "bar monthly revenue by category")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Chart Builder

Create: $ARGUMENTS

## Using Recharts (already installed)
- `BarChart`, `LineChart`, `PieChart`, `AreaChart`, `RadarChart`, `ScatterChart`
- Use shadcn/ui `ChartContainer`, `ChartTooltip`, `ChartLegend` wrappers

## Chart Requirements
- Responsive container (fills parent width)
- Interactive tooltips showing data details
- Legend with toggle visibility
- Accessible colors with sufficient contrast
- Dark mode color palette support
- Loading skeleton placeholder
- Empty state for no data
- Proper axis labels and formatting (currency, percentages, dates)
- Animation on initial render
- Custom color scheme matching design system
