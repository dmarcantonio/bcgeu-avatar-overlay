const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const LOGO_RATIO = 0.2;  // 20% of the canvas height for the logo

// Default overlay image (starts with steward logo)
let currentOverlaySrc = 'steward-logo-outline.png';
let overlay = new Image();
overlay.crossOrigin = 'anonymous';
overlay.src = currentOverlaySrc;

let profileImage = null;  // Store the uploaded profile image

// Function to load and draw the overlay
function loadOverlay() {
    overlay.onload = function () {
        redrawCanvas();  // Redraw canvas whenever overlay changes
    };
    overlay.src = currentOverlaySrc;
}

// Function to clear the canvas and redraw both the profile image and the overlay
function redrawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the profile image if it exists
    if (profileImage) {
        const imageAspectRatio = profileImage.width / profileImage.height;
        const canvasAspectRatio = canvas.width / canvas.height;

        let sourceWidth, sourceHeight, sourceX, sourceY;

        // Adjust cropping based on the aspect ratio
        if (imageAspectRatio > canvasAspectRatio) {
            // The image is wider, crop the sides
            sourceHeight = profileImage.height;
            sourceWidth = profileImage.height * canvasAspectRatio;
            sourceX = (profileImage.width - sourceWidth) / 2;
            sourceY = 0;
        } else {
            // The image is taller, crop the top and bottom
            sourceWidth = profileImage.width;
            sourceHeight = profileImage.width / canvasAspectRatio;
            sourceX = 0;
            sourceY = (profileImage.height - sourceHeight) / 2;
        }

        // Draw the cropped profile image
        ctx.drawImage(
            profileImage,
            sourceX, sourceY, sourceWidth, sourceHeight,  // Source (crop) coordinates
            0, 0, canvas.width, canvas.height  // Destination (canvas) coordinates
        );
    }

    // Draw the overlay
    drawOverlay();
}

// Function to draw the overlay logo
function drawOverlay() {
    const overlayHeight = canvas.height * LOGO_RATIO;
    const overlayWidth = (overlay.width / overlay.height) * overlayHeight;

    const x = (canvas.width - overlayWidth) / 2;
    const y = canvas.height - overlayHeight - 10;  // 10px margin from the bottom

    ctx.drawImage(overlay, x, y, overlayWidth, overlayHeight);
}

// Event listeners for switching overlays based on selection
document.getElementById('stewardLogo').addEventListener('click', () => {
    currentOverlaySrc = 'steward-logo-outline.png';
    loadOverlay();
});

document.getElementById('bcgeuStewardLogo').addEventListener('click', () => {
    currentOverlaySrc = 'bcgeu-steward-logo-outline.png';
    loadOverlay();
});

// Handle the file upload
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        profileImage = new Image();
        profileImage.src = e.target.result;

        profileImage.onload = function () {
            redrawCanvas();  // Redraw canvas with the new profile image and the current overlay
        };
    };

    reader.readAsDataURL(file);
});

// Handle image download
downloadBtn.addEventListener('click', () => {
    // Create a hidden canvas for higher resolution export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');

    // Set the export canvas size to a larger resolution (e.g., 2x the original)
    const exportScale = 2;  // Adjust this for the desired quality
    exportCanvas.width = canvas.width * exportScale;
    exportCanvas.height = canvas.height * exportScale;

    // Scale everything up proportionally
    exportCtx.scale(exportScale, exportScale);

    // Redraw the profile image and overlay on the export canvas
    if (profileImage) {
        const imageAspectRatio = profileImage.width / profileImage.height;
        const canvasAspectRatio = exportCanvas.width / exportCanvas.height;

        let sourceWidth, sourceHeight, sourceX, sourceY;

        // Adjust cropping based on the aspect ratio
        if (imageAspectRatio > canvasAspectRatio) {
            sourceHeight = profileImage.height;
            sourceWidth = profileImage.height * canvasAspectRatio;
            sourceX = (profileImage.width - sourceWidth) / 2;
            sourceY = 0;
        } else {
            sourceWidth = profileImage.width;
            sourceHeight = profileImage.width / canvasAspectRatio;
            sourceX = 0;
            sourceY = (profileImage.height - sourceHeight) / 2;
        }

        // Draw the cropped profile image
        exportCtx.drawImage(
            profileImage,
            sourceX, sourceY, sourceWidth, sourceHeight,  // Source (crop) coordinates
            0, 0, canvas.width, canvas.height  // Destination (canvas) coordinates
        );
    }

    // Draw the overlay logo
    const overlayHeight = canvas.height * LOGO_RATIO;
    const overlayWidth = (overlay.width / overlay.height) * overlayHeight;

    const x = (canvas.width - overlayWidth) / 2;
    const y = canvas.height - overlayHeight - 10;

    exportCtx.drawImage(overlay, x, y, overlayWidth, overlayHeight);

    // Convert the canvas to a Blob for higher quality image download
    exportCanvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.download = 'BCGEU-Steward-Profile.png';
        link.href = URL.createObjectURL(blob);
        link.click();
    }, 'image/png', 1.0);  // 1.0 for maximum quality
});

