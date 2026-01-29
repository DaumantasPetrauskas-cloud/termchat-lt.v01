#!/usr/bin/env python3
"""
Quick public test for TermChat LT
"""

import requests
import json

def test_public_deployment():
    print("🌐 Testing Public Deployment")
    print("=" * 40)
    
    # Test GitHub Pages frontend
    try:
        response = requests.get("https://dauptr.github.io/termchat-lt/", timeout=10)
        if response.status_code == 200:
            print("✅ Frontend (GitHub Pages): ONLINE")
            if "TERMOS LT" in response.text:
                print("   - Login screen detected")
            if "paho-mqtt" in response.text:
                print("   - MQTT library loaded")
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend: {e}")
    
    # Test Render backend (if URL known)
    backend_urls = [
        "https://termchat-mqtt-bot.onrender.com",
        "https://termchat-lt.onrender.com"
    ]
    
    for url in backend_urls:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"✅ Backend ({url}): ONLINE")
                if "TermOS LT" in response.text:
                    print("   - Health check working")
                break
        except Exception as e:
            print(f"❌ Backend ({url}): {e}")
    
    print("\n📱 Public URLs:")
    print("Frontend: https://dauptr.github.io/termchat-lt/")
    print("Backend: Check Render dashboard for URL")

if __name__ == "__main__":
    test_public_deployment()