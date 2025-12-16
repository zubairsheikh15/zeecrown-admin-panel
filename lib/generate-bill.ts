import jsPDF from 'jspdf';

interface OrderItem {
    quantity: number;
    price_at_purchase: number;
    products?: {
        name: string | null;
    } | null;
}

interface Address {
    house_no?: string | null;
    street_address?: string | null;
    landmark?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
    mobile_number?: string | null;
}

interface OrderData {
    id: string;
    created_at: string;
    total_price: number;
    status: string;
    payment_method: string | null;
    profiles?: {
        full_name: string | null;
    } | null;
    addresses?: Address | null;
    order_items?: OrderItem[];
}

export function generateBillPDF(order: OrderData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Colors
    const primaryGreen = [22, 163, 74];
    const darkGreen = [16, 185, 129];
    const lightGray = [243, 244, 246];
    const borderGray = [229, 231, 235];

    // ========== HEADER SECTION ==========
    // Top green bar
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('ZEE CROWN', margin, 18);

    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('Invoice / Bill', margin, 26);

    // Invoice number and date (right side)
    const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #', pageWidth - margin - 50, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(order.id.substring(0, 8).toUpperCase(), pageWidth - margin - 50, 22);
    doc.text(invoiceDate, pageWidth - margin - 50, 29);

    yPos = 50;

    // ========== CUSTOMER & ORDER INFO SECTION ==========
    // Left column - Order Info
    const leftColWidth = 85;
    
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, yPos, leftColWidth, 45, 2, 2, 'F');
    
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, leftColWidth, 45, 2, 2);

    let infoY = yPos + 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('ORDER INFORMATION', margin + 5, infoY);

    infoY += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text('Date:', margin + 5, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceDate, margin + 20, infoY);

    infoY += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', margin + 5, infoY);
    doc.setFont('helvetica', 'normal');
    
    // Status badge
    const statusColors: Record<string, [number, number, number]> = {
        'delivered': [34, 197, 94],
        'shipped': [59, 130, 246],
        'processing': [251, 191, 36],
        'paid': [34, 197, 94],
        'pending': [156, 163, 175]
    };
    const statusColor = statusColors[order.status.toLowerCase()] || [156, 163, 175];
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(margin + 20, infoY - 4, 50, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(order.status.toUpperCase(), margin + 45, infoY, { align: 'center' });

    infoY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text('Payment:', margin + 5, infoY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const paymentText = order.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid Online';
    doc.text(paymentText, margin + 25, infoY);

    // Right column - Customer Info
    const rightColX = margin + leftColWidth + 10;
    const rightColWidth = pageWidth - rightColX - margin;

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(rightColX, yPos, rightColWidth, 45, 2, 2, 'F');
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(rightColX, yPos, rightColWidth, 45, 2, 2);

    let customerY = yPos + 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('BILL TO', rightColX + 5, customerY);

    customerY += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const customerName = order.profiles?.full_name || 'Customer';
    doc.text(customerName, rightColX + 5, customerY);

    // Address
    const address = order.addresses;
    if (address) {
        customerY += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);

        const addressParts: string[] = [];
        if (address.house_no) addressParts.push(address.house_no);
        if (address.street_address) addressParts.push(address.street_address);
        if (address.landmark) addressParts.push(`Near ${address.landmark}`);

        if (addressParts.length > 0) {
            const addressLine = addressParts.join(', ');
            const wrapped = doc.splitTextToSize(addressLine, rightColWidth - 10);
            doc.text(wrapped[0], rightColX + 5, customerY);
            customerY += 4;
        }

        const cityState = [address.city, address.state, address.postal_code].filter(Boolean).join(', ');
        if (cityState) {
            doc.text(cityState, rightColX + 5, customerY);
            customerY += 4;
        }

        if (address.mobile_number) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
            doc.text(`Phone: ${address.mobile_number}`, rightColX + 5, customerY);
        }
    }

    yPos += 55;

    // ========== ITEMS TABLE ==========
    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Order Items', margin, yPos);

    yPos += 10;

    // Table header
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    
    const col1 = margin + 3;
    const col2 = margin + 100;
    const col3 = margin + 130;
    const col4 = pageWidth - margin - 3;

    doc.text('PRODUCT', col1, yPos + 7);
    doc.text('QTY', col2, yPos + 7);
    doc.text('PRICE', col3, yPos + 7);
    doc.text('TOTAL', col4, yPos + 7, { align: 'right' });

    yPos += 12;

    // Table rows
    const items = order.order_items || [];
    let rowNum = 0;

    items.forEach((item) => {
        if (yPos > pageHeight - 70) {
            doc.addPage();
            yPos = margin + 10;
        }

        const productName = item.products?.name || 'Product';
        const quantity = item.quantity || 0;
        const price = item.price_at_purchase || 0;
        const total = quantity * price;

        const rowHeight = 10;

        // Alternating row colors
        if (rowNum % 2 === 0) {
            doc.setFillColor(249, 250, 251);
            doc.rect(margin, yPos - 2, pageWidth - 2 * margin, rowHeight, 'F');
        }

        // Row border
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
        doc.setLineWidth(0.3);
        doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);

        // Product name
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const nameLines = doc.splitTextToSize(productName, 80);
        doc.text(nameLines[0], col1, yPos + 3);

        // Quantity
        doc.setFont('helvetica', 'bold');
        doc.text(quantity.toString(), col2, yPos + 3);

        // Price
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(`₹${price.toFixed(2)}`, col3, yPos + 3);

        // Total
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
        doc.text(`₹${total.toFixed(2)}`, col4, yPos + 3, { align: 'right' });

        yPos += rowHeight;
        rowNum++;
    });

    // Bottom border
    doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.setLineWidth(1);
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);

    yPos += 8;

    // ========== TOTAL SECTION ==========
    const totalX = pageWidth - margin - 80;
    const totalWidth = 80;

    // Subtotal (if needed)
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price_at_purchase || 0)), 0);
    
    if (Math.abs(subtotal - order.total_price) > 0.01) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text('Subtotal:', totalX, yPos);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`₹${subtotal.toFixed(2)}`, totalX + totalWidth, yPos, { align: 'right' });
        yPos += 7;
    }

    // Grand Total Box
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.roundedRect(totalX, yPos - 2, totalWidth, 16, 2, 2, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL', totalX + 5, yPos + 6);

    doc.setFontSize(16);
    doc.text(`₹${order.total_price.toFixed(2)}`, totalX + totalWidth - 5, yPos + 8, { align: 'right' });

    yPos += 25;

    // ========== FOOTER ==========
    const footerY = pageHeight - 30;

    // Footer background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, footerY, pageWidth, 30, 'F');

    // Top border
    doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.setLineWidth(1);
    doc.line(0, footerY, pageWidth, footerY);

    // Thank you message
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text('Thank You for Your Business!', pageWidth / 2, footerY + 10, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('For any queries, please contact our customer service team.', pageWidth / 2, footerY + 17, { align: 'center' });

    // ========== SAVE PDF ==========
    const fileName = `Invoice_${order.id.substring(0, 8)}_${new Date(order.created_at).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
