const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

const LOGO_RATIO = 0.2;

// Predefined overlay image (BCGEU Steward logo)
const overlay = new Image();
overlay.crossOrigin = 'anonymous';  // Allow cross-origin image loading
overlay.src = 'bcgeu-steward-logo-outline.png';  // Ensure this file is in the same repository

// Handle the file upload
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const profileImage = new Image();
        profileImage.src = e.target.result;

        profileImage.onload = function () {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate the aspect ratio of the uploaded image
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

            // Draw the image, cropping it to fill the canvas
            ctx.drawImage(
                profileImage,
                sourceX, sourceY, sourceWidth, sourceHeight,  // Source (crop) coordinates
                0, 0, canvas.width, canvas.height  // Destination (canvas) coordinates
            );

            // Draw the overlay once the profile image is loaded
            overlay.onload = function () {
                // Calculate the size for the overlay (of the canvas height)
                const overlayHeight = canvas.height * LOGO_RATIO;
                const overlayWidth = (overlay.width / overlay.height) * overlayHeight;

                // Calculate the position for the overlay (bottom-center)
                const x = (canvas.width - overlayWidth) / 2;
                const y = canvas.height - overlayHeight - 10;  // 10px margin from the bottom

                // Draw the overlay
                ctx.drawImage(overlay, x, y, overlayWidth, overlayHeight);
            };

            // In case the overlay image is already loaded (if cached)
            if (overlay.complete) {
                overlay.onload();
            }
        };
    };

    reader.readAsDataURL(file);
});

// Handle image download
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'BCGEU-Steward-Profile.png';
    link.href = canvas.toDataURL();  // This will work if the canvas is not "tainted"
    link.click();
});
