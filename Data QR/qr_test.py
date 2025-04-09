import cv2
import json

# Load image
img = cv2.imread('array_qr.png')

# Initialize detector
detector = cv2.QRCodeDetector()

# Detect and decode
data, bbox, _ = detector.detectAndDecode(img)

if data:
    decoded_array = json.loads(data)
    print("Decoded array:", decoded_array)
else:
    print("No QR code found.")
