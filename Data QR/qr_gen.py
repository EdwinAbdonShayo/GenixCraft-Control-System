import qrcode
import json

# Your array
my_array = ["apple", "banana", "cherry"]

# Convert to JSON
json_data = json.dumps(my_array)

# Generate QR code
qr = qrcode.QRCode(
    version=None,  # Automatically adjust size
    error_correction=qrcode.constants.ERROR_CORRECT_M,  # Medium error correction
    box_size=10,
    border=4,
)
qr.add_data(json_data)
qr.make(fit=True)

# Create image
img = qr.make_image(fill_color="black", back_color="white")

# Save to file
img.save("array_qr.png")

print("QR code saved as array_qr.png")
