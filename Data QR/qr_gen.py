import qrcode
import json
from datetime import datetime, timedelta

# Sample product list
products = [
    {"product_id": "P001", "product_name": "ketchup box", "expiry_date": "2025-12-01"},
    {"product_id": "P002", "product_name": "water box", "expiry_date": "2026-01-15"},
    {"product_id": "P003", "product_name": "mustard package", "expiry_date": "2025-11-10"},
    {"product_id": "P004", "product_name": "mayonnaise jars", "expiry_date": "2026-02-28"},
    {"product_id": "P005", "product_name": "olive oil", "expiry_date": "2026-03-20"},
    {"product_id": "P006", "product_name": "soy sauce", "expiry_date": "2025-09-05"}
]

# Loop to create a QR code for each product
for product in products:
    json_data = json.dumps(product)

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(json_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Save each QR code image with a unique filename
    filename = f"{product['product_id']}_{product['product_name'].replace(' ', '_')}.png"
    img.save(filename)

    print(f"QR code saved as {filename}")
