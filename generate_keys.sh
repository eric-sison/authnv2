#!/bin/bash

# Exit on any error
set -e

KEY_SIZE=4096
PRIVATE_KEY_FILE="private.pem"
PUBLIC_KEY_FILE="public.pem"

# Check if keys already exist
if [[ -f "$PRIVATE_KEY_FILE" || -f "$PUBLIC_KEY_FILE" ]]; then
  echo "Existing key files detected."
  read -p "Do you want to overwrite the existing key files? (y/n): " confirm
  if [[ "$confirm" != "y" ]]; then
    echo "Aborting key generation."
    exit 0
  fi
fi

# Generate RSA private key
echo "Generating RSA ${KEY_SIZE}-bit private key..."
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:$KEY_SIZE

# Extract public key
echo "Extracting public key..."
openssl rsa -pubout -in "$PRIVATE_KEY_FILE" -out "$PUBLIC_KEY_FILE"

# Encode keys to base64 (without line wrapping)
PRIVATE_KEY_B64=$(base64 -w 0 "$PRIVATE_KEY_FILE" 2>/dev/null || base64 "$PRIVATE_KEY_FILE" | tr -d '\n')
PUBLIC_KEY_B64=$(base64 -w 0 "$PUBLIC_KEY_FILE" 2>/dev/null || base64 "$PUBLIC_KEY_FILE" | tr -d '\n')

# Display base64 values (optional)
echo ""
echo "Private Key (Base64):"
echo "$PRIVATE_KEY_B64"
echo ""
echo "Public Key (Base64):"
echo "$PUBLIC_KEY_B64"
echo ""

echo "Done! Keys generated."
