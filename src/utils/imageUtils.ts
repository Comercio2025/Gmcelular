import { api } from '../services/api';

// Helper to process image (add white background and resize to 800x800)
// Image processing options
interface ProcessImageOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maintainAspectRatio?: boolean; // If true, canvas will resize to fit image, no white bars
}

export const processImage = (file: File, options: ProcessImageOptions = {}): Promise<Blob> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const {
                    maxWidth = 2000,
                    maxHeight = 2000,
                    quality = 0.98,
                    maintainAspectRatio = false
                } = options;

                let width = img.width;
                let height = img.height;

                // Calculate dimensions
                if (maintainAspectRatio) {
                    // Resize if larger than max, but keep ratio
                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (maxHeight / height) * width;
                        height = maxHeight;
                    }
                } else {
                    // Standard square box logic (Products)
                    // ... (will need to separate this logic)
                }

                // If maintainAspectRatio is true, canvas size = image size
                // If false (product mode), canvas size = max size (square) with padding

                let canvasWidth = maintainAspectRatio ? width : maxWidth;
                let canvasHeight = maintainAspectRatio ? height : maxHeight;

                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Better smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                if (maintainAspectRatio) {
                    // Just draw resized image
                    ctx.drawImage(img, 0, 0, width, height);
                } else {
                    // Square box logic
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    const x = (canvasWidth - w) / 2;
                    const y = (canvasHeight - h) / 2;

                    ctx.drawImage(img, x, y, w, h);
                }

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/jpeg', quality);
            };
        };
    });
};

export const uploadFile = async (file: Blob, filename: string = 'image.jpg'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file, filename);
    try {
        const response = await api.post('upload.php', formData);
        return response.data.url;
    } catch (error) {
        console.warn("Upload falhou (provavelmente sem backend). Usando preview local.");
        // Fallback for local testing: create a local blob URL
        return URL.createObjectURL(file);
    }
};
