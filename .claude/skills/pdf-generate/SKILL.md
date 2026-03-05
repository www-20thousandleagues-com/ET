---
name: pdf-generate
description: Generate PDF documents — invoices, reports, certificates, exports
argument-hint: <document-type> (e.g., "invoice", "report", "certificate", "data export")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# PDF Generation

Document: $ARGUMENTS

## Approaches
### Server-Side (Edge Function)
- **Puppeteer/Playwright**: Render HTML → PDF (best for complex layouts)
- **jsPDF**: Programmatic PDF creation (simple documents)
- **React-PDF (@react-pdf/renderer)**: React components → PDF

### Client-Side
- **html2canvas + jsPDF**: Screenshot element → PDF
- **window.print()**: Browser print dialog (simplest)

## Template Pattern (React-PDF)
```tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
const Invoice = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}><Text>{data.title}</Text></View>
      {/* ... */}
    </Page>
  </Document>
)
```

## Features
- Dynamic data injection
- Page numbering and headers/footers
- Table layouts
- Image embedding
- Barcode/QR code support
- Download trigger with proper filename
