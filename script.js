const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Predefined overlay image (BCGEU Steward logo)
const overlay = new Image();
overlay.crossOrigin = 'anonymous';  // Allow cross-origin image loading
overlay.src = 'bcgeu-steward-logo.png';  // Ensure this file is in the same repository

// Handle the file upload
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const profileImage = new Image();
        profileImage.src = e.target.result;

        profileImage.onload = function () {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw uploaded profile image to fill the canvas
            ctx.drawImage(profileImage, 0, 0, canvas.width, canvas.height);

            // Draw the overlay once the profile image is loaded
            overlay.onload = function () {
                // Calculate the size for the overlay (10% of the canvas height)
                const overlayHeight = canvas.height * 0.1;
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
