'use client';

import { Download } from 'lucide-react';
import { generateBillPDF } from '@/lib/generate-bill';

interface OrderData {
    id: string;
    created_at: string;
    total_price: number;
    status: string;
    payment_method: string | null;
    profiles?: {
        full_name: string | null;
    } | null;
    addresses?: {
        house_no?: string | null;
        street_address?: string | null;
        landmark?: string | null;
        city?: string | null;
        state?: string | null;
        postal_code?: string | null;
        country?: string | null;
        mobile_number?: string | null;
    } | null;
    order_items?: {
        quantity: number;
        price_at_purchase: number;
        products?: {
            name: string | null;
        } | null;
    }[];
}

interface DownloadBillButtonProps {
    order: OrderData;
}

export default function DownloadBillButton({ order }: DownloadBillButtonProps) {
    const handleDownload = () => {
        try {
            generateBillPDF(order);
        } catch (error) {
            console.error('Error generating bill:', error);
            alert('Failed to generate bill. Please try again.');
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
            title="Download Bill"
        >
            <Download size={20} />
            <span className="text-sm">Bill</span>
        </button>
    );
}

