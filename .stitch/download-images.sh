#!/bin/bash

# Download Stitch Home Page Images
# Navigate to the images directory
cd "$(dirname "$0")/designs" || exit

echo "📥 Downloading Stitch home page images..."

# Create images subdirectory
mkdir -p images

# 1. Hero background image
echo "  ⬇️  Downloading hero background..."
curl -L 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGymRtDCkPbRLsmxP3gl-2ApblflDRO2t41jizGKmOUxRTvZIB4vV2FsPUaC61d1nn1GPgNRlo_nILW2byy6wZq0PPofzAhvxYQXtOny7lhydSdfQj6oD1FF98_weieoXYflNJlbDsPvzZC-LoWgt5gzwhemzEgSmvLAyUefpvHMqooxdQWCnbIylsQrzMcn7l6nVYrOP0lljI-7z-tPFMuZjgetSEUSrUj-fnjUy-rvOqw5DIuHK3DROg4lM5DjwzibXD4jLYtg-4' -o images/hero-background.jpg

# 2. Product 1 - Oasis Sport Water 500ml
echo "  ⬇️  Downloading product 1 (Sport Water 500ml)..."
curl -L 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBNEhCPLT-F0aWUsFatOZifnX0tRwfb-Za5j3rW6MPiL8hY25fGYxH9tyY_aO1gdt3HTzrDML41dbzUfRqSVPIcxwUdamhAPXMAzxhz93O2BPoj28zaSqze-f149yeOxk62Jd8POliwk0pQLWud8Ekg2xdzJFGR9VyYPWxjd12HCHKTVaVvpcKRex6VNWrv5qOm46mNrUTlSEJANwDhN4dV0ocrecwq0I9Z7EUtk23lmY56mbKcok3Ytqdd-CU6FIz5VBPWaHre_ZO' -o images/product-sport-500ml.jpg

# 3. Product 2 - Oasis Still Water 5L
echo "  ⬇️  Downloading product 2 (Still Water 5L)..."
curl -L 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjoxEvW5xcmJyHFAn382cARW23bhYKHH4sGcoaNEHG055JC0JGnxsZCqhJcV_xpndxsRn6rWTwC16HIKv_EogIDpfH6BKzXMhrYQjf1vsnm9QnL8KYB2VPqZy69iTJavUXGryOcdhpQkMnAn8_tyYWby0fNtKxIECK1QqcB4zb-Xk_ebQ8ahCp-BeDV38F2n1TWfAN_U9Y5LFnx5PrNlrxou5dDpPF7Nt2vkuWfpCh1e4hvmd1-7aK7e2Jr-DEDplDbmYOt1uN-VI1' -o images/product-still-5l.jpg

# 4. Product 3 - Pluto Ice Cubes 2kg
echo "  ⬇️  Downloading product 3 (Ice Cubes 2kg)..."
curl -L 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm_tE_P1VhZ506ikzNOHABdj3LdVcNfTjh3arO2zC0lW6CBbMqcm30J44E5FXlPz4TVBc0NPrA_OkrtYuXWjAbAuw55PRWbRemtJnm71x5EfSqUOXZUlwFfsW-rTXveESvpWzP6kBVAd1mb-BewZALivx3gkgnw5pYA8V197BcJs1yufOCk2wrEO6RL9IGJI3tBFI4PV8m0DzNxXqJV_jBe6BhXw_1e9N3ZXzbcvuHIOIbgV78lAruYlQ4zwdAZKtOqusZQSp5wSUp' -o images/product-ice-2kg.jpg

echo ""
echo "✅ All images downloaded successfully!"
echo "📁 Images saved to: .stitch/designs/images/"
echo ""
ls -lh images/
