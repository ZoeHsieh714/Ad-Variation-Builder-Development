import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Download a single image
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        saveAs(blob, filename);
    } catch (error) {
        console.error('Download failed:', error);
        throw new Error('Failed to download image');
    }
}

/**
 * Download multiple images as a ZIP file
 */
export async function downloadImagesAsZip(
    imageUrls: string[],
    zipFilename: string = 'ad-variations.zip',
    filenamePrefix: string = 'variation'
): Promise<void> {
    try {
        const zip = new JSZip();

        // Fetch all images
        const imagePromises = imageUrls.map(async (url, index) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const extension = blob.type.split('/')[1] || 'png';
            const filename = `${filenamePrefix}_${index + 1}.${extension}`;
            return { filename, blob };
        });

        const images = await Promise.all(imagePromises);

        // Add images to ZIP
        images.forEach(({ filename, blob }) => {
            zip.file(filename, blob);
        });

        // Generate and download ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, zipFilename);
    } catch (error) {
        console.error('ZIP download failed:', error);
        throw new Error('Failed to create ZIP file');
    }
}

/**
 * Download images with custom naming based on source
 */
export async function downloadVariationsAsZip(
    imageUrls: string[],
    source: 'prompt' | 'image',
    timestamp: Date = new Date()
): Promise<void> {
    const dateStr = timestamp.toISOString().split('T')[0];
    const zipFilename = `ad-variations_${source}_${dateStr}.zip`;
    const filenamePrefix = `variation_${source}`;

    await downloadImagesAsZip(imageUrls, zipFilename, filenamePrefix);
}
