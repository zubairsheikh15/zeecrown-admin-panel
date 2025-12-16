import sharp from 'sharp';

const TARGET_SIZE_KB = 100;
const TARGET_SIZE_BYTES = TARGET_SIZE_KB * 1024;

/**
 * Compress image to WebP format targeting ~100KB while maintaining maximum quality
 * Uses adaptive quality - starts high and reduces only if needed
 */
export async function compressImageToWebP(
    buffer: Buffer,
    targetSizeBytes: number = TARGET_SIZE_BYTES
): Promise<Buffer> {
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 1920;
    const originalHeight = metadata.height || 1080;
    
    // Calculate optimal dimensions (maintain aspect ratio, max 1920px width)
    let targetWidth = originalWidth;
    let targetHeight = originalHeight;
    
    if (originalWidth > 1920) {
        const ratio = 1920 / originalWidth;
        targetWidth = 1920;
        targetHeight = Math.round(originalHeight * ratio);
    }
    
    // Start with high quality and reduce if needed
    let quality = 100;
    let compressed: Buffer;
    let iterations = 0;
    const maxIterations = 10;
    
    do {
        // Create sharp instance with rotation correction and resize if needed
        const sharpInstance = sharp(buffer)
            .rotate() // Auto-rotate based on EXIF
            .resize(targetWidth, targetHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        
        // Apply WebP compression with quality settings
        compressed = await sharpInstance
            .webp({
                quality: quality,
                effort: 6, // Higher effort = better compression (0-6, 6 is best)
                nearLossless: quality >= 90, // Use near-lossless for high quality
                smartSubsample: true, // Smart subsampling for better quality
            })
            .toBuffer();
        
        // If we're under target size or at minimum quality, we're done
        if (compressed.length <= targetSizeBytes || quality <= 50 || iterations >= maxIterations) {
            break;
        }
        
        // Reduce quality by 5% each iteration
        quality -= 5;
        iterations++;
    } while (compressed.length > targetSizeBytes && quality > 50);
    
    // If still too large, try reducing dimensions slightly
    if (compressed.length > targetSizeBytes && targetWidth > 800) {
        const reductionFactor = Math.sqrt(targetSizeBytes / compressed.length);
        targetWidth = Math.max(800, Math.round(targetWidth * reductionFactor));
        targetHeight = Math.round(targetHeight * reductionFactor);
        
        compressed = await sharp(buffer)
            .rotate()
            .resize(targetWidth, targetHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({
                quality: Math.max(quality, 85), // Don't go below 85 if we're resizing
                effort: 6,
                nearLossless: true,
                smartSubsample: true,
            })
            .toBuffer();
    }
    
    return compressed;
}

/**
 * Process image file to WebP format with compression
 */
export async function processImageFile(
    file: File,
    targetSizeKB: number = TARGET_SIZE_KB
): Promise<{ buffer: Buffer; fileName: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const compressed = await compressImageToWebP(buffer, targetSizeKB * 1024);
    
    // Generate safe filename
    const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.[^/.]+$/, ''); // Remove original extension
    
    const fileName = `${Date.now()}_${safeName}.webp`;
    
    return {
        buffer: compressed,
        fileName,
    };
}

