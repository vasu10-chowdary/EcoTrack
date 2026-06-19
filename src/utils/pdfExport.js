import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export the dashboard section as a PDF
 */
export async function exportDashboardPDF(emissions, sustainabilityScore, userName) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;

  // ── Colors ──
  const green = [22, 163, 74];
  const teal = [13, 148, 136];
  const dark = [15, 23, 42];
  const gray = [100, 116, 139];
  const lightGray = [241, 245, 249];
  const white = [255, 255, 255];

  // ── Header gradient background ──
  pdf.setFillColor(...dark);
  pdf.rect(0, 0, pageWidth, 55, 'F');

  // Gradient overlay effect
  pdf.setFillColor(16, 185, 129, 0.3);
  pdf.circle(pageWidth - 30, 15, 40, 'F');

  // ── Logo / Title ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(...white);
  pdf.text('🌿 EcoTrack', margin, 22);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(134, 239, 172);
  pdf.text('Carbon Footprint Sustainability Report', margin, 30);

  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Generated for: ${userName}`, margin, 38);
  pdf.text(`Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, margin, 44);

  // ── Divider ──
  pdf.setDrawColor(...green);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 57, pageWidth - margin, 57);

  let y = 68;

  // ── Summary Stat Cards ──
  const total = emissions?.totalEmissions || 0;
  const breakdown = emissions?.breakdown || {};
  const score = sustainabilityScore || 0;

  const scoreColor = score >= 80 ? [34, 197, 94] : score >= 60 ? [59, 130, 246] : score >= 40 ? [245, 158, 11] : [239, 68, 68];

  // Card row
  const cardW = (pageWidth - margin * 2 - 10) / 2;
  const cards = [
    { label: 'Total CO₂ Emissions', value: `${total} kg`, sub: 'Today', color: green },
    { label: 'Sustainability Score', value: `${score}/100`, sub: getScoreLabel(score), color: scoreColor },
  ];

  cards.forEach((card, i) => {
    const cx = margin + i * (cardW + 10);
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(cx, y, cardW, 28, 4, 4, 'F');
    pdf.setFillColor(...card.color);
    pdf.roundedRect(cx, y, 4, 28, 2, 2, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(...dark);
    pdf.text(card.value, cx + 10, y + 12);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...gray);
    pdf.text(card.label, cx + 10, y + 19);
    pdf.setTextColor(...card.color);
    pdf.text(card.sub, cx + 10, y + 25);
  });

  y += 38;

  // ── Category Breakdown ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(...dark);
  pdf.text('Category Breakdown', margin, y);

  y += 6;
  pdf.setDrawColor(...green);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y, margin + 60, y);
  y += 8;

  const categories = [
    { name: 'Transportation', value: breakdown.transportation || 0, icon: '🚗', color: [16, 185, 129] },
    { name: 'Home Energy', value: breakdown.energy || 0, icon: '⚡', color: [59, 130, 246] },
    { name: 'Food & Diet', value: breakdown.food || 0, icon: '🥗', color: [245, 158, 11] },
    { name: 'Waste', value: breakdown.waste || 0, icon: '♻️', color: [239, 68, 68] },
  ];

  categories.forEach((cat) => {
    const pct = total > 0 ? (cat.value / total) * 100 : 0;
    const barWidth = (pageWidth - margin * 2 - 50);
    const fillWidth = (pct / 100) * barWidth;

    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 18, 3, 3, 'F');

    // Category label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...dark);
    pdf.text(`${cat.icon} ${cat.name}`, margin + 4, y + 7);

    // Bar background
    pdf.setFillColor(220, 220, 220);
    pdf.roundedRect(margin + 45, y + 9, barWidth, 4, 2, 2, 'F');

    // Bar fill
    if (fillWidth > 0) {
      pdf.setFillColor(...cat.color);
      pdf.roundedRect(margin + 45, y + 9, Math.max(fillWidth, 2), 4, 2, 2, 'F');
    }

    // Value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...cat.color);
    pdf.text(`${cat.value} kg (${Math.round(pct)}%)`, pageWidth - margin - 32, y + 7);

    y += 22;
  });

  // ── Environmental Context ──
  y += 6;
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 32, 4, 4, 'F');
  pdf.setDrawColor(...green);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 32, 4, 4, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...green);
  pdf.text('🌍 Environmental Context', margin + 5, y + 9);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(30, 80, 30);

  const avgDaily = 12.88;
  const comparison = total < avgDaily
    ? `Your emissions (${total} kg) are below the global daily average (${avgDaily} kg). Great work!`
    : `Your emissions (${total} kg) exceed the global daily average (${avgDaily} kg) by ${Math.round((total - avgDaily) * 100) / 100} kg.`;

  const splitText = pdf.splitTextToSize(comparison, pageWidth - margin * 2 - 12);
  pdf.text(splitText, margin + 5, y + 18);

  const treesNeeded = Math.max(0, Math.round((total - avgDaily) * 0.06));
  if (treesNeeded > 0) {
    pdf.text(`🌲 Plant ${treesNeeded} trees to offset excess emissions.`, margin + 5, y + 27);
  }

  y += 42;

  // ── Top Recommendations ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(...dark);
  pdf.text('Top Recommendations', margin, y);

  y += 6;
  pdf.setDrawColor(...green);
  pdf.line(margin, y, margin + 70, y);
  y += 8;

  const topRecs = [
    { icon: '🚌', text: 'Use public transport or cycle for short trips' },
    { icon: '💡', text: 'Switch to LED lights and unplug standby devices' },
    { icon: '🥗', text: 'Reduce meat consumption to lower food emissions' },
    { icon: '♻️', text: 'Sort waste and recycle at least 80% of recyclables' },
    { icon: '☀️', text: 'Explore solar energy options for your home' },
  ];

  topRecs.forEach((rec) => {
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 12, 2, 2, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...dark);
    pdf.text(`${rec.icon}  ${rec.text}`, margin + 5, y + 8);
    y += 16;
  });

  // ── Footer ──
  pdf.setFillColor(...dark);
  pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(134, 239, 172);
  pdf.text('🌿 EcoTrack – Carbon Footprint Awareness Platform', margin, pageHeight - 8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Together, we can make a difference for our planet.', pageWidth - margin - 62, pageHeight - 8);

  pdf.save(`EcoTrack_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent 🌟';
  if (score >= 60) return 'Good 👍';
  if (score >= 40) return 'Moderate ⚠️';
  return 'Needs Work 🔴';
}
