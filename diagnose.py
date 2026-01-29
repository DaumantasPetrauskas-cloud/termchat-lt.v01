#!/usr/bin/env python3
"""
TermChat LT Diagnostic Script
Identifies all issues in the codebase
"""

import os
import json

def check_files():
    issues = []
    
    # Check if critical files exist
    critical_files = [
        'mqtt_service.py',
        'index.html', 
        'requirements.txt',
        'Procfile',
        'runtime.txt'
    ]
    
    for file in critical_files:
        if not os.path.exists(file):
            issues.append(f"MISSING: {file}")
    
    # Check HTML issues
    try:
        with open('index.html', 'r') as f:
            html_content = f.read()
            
        # Check for multiple function definitions
        if html_content.count('function login()') > 1:
            issues.append("DUPLICATE: Multiple login() functions in HTML")
            
        if html_content.count('function connectMQTT()') > 1:
            issues.append("DUPLICATE: Multiple connectMQTT() functions in HTML")
            
        # Check for missing elements
        if 'id="messages"' not in html_content:
            issues.append("MISSING: messages element in HTML")
            
    except Exception as e:
        issues.append(f"HTML ERROR: {e}")
    
    # Check Python service
    try:
        with open('mqtt_service.py', 'r') as f:
            py_content = f.read()
            
        if 'ZHIPU_API_KEY' not in py_content:
            issues.append("MISSING: API key handling in Python")
            
        if 'def on_message' not in py_content:
            issues.append("MISSING: MQTT message handler")
            
    except Exception as e:
        issues.append(f"PYTHON ERROR: {e}")
    
    # Check requirements
    try:
        with open('requirements.txt', 'r') as f:
            reqs = f.read()
            
        if 'paho-mqtt' not in reqs:
            issues.append("MISSING: paho-mqtt in requirements")
            
        if 'zhipuai' not in reqs:
            issues.append("MISSING: zhipuai in requirements")
            
    except Exception as e:
        issues.append(f"REQUIREMENTS ERROR: {e}")
    
    return issues

if __name__ == "__main__":
    print("🔍 TermChat LT Diagnostic Report")
    print("=" * 40)
    
    issues = check_files()
    
    if issues:
        print("❌ ISSUES FOUND:")
        for i, issue in enumerate(issues, 1):
            print(f"{i}. {issue}")
    else:
        print("✅ No critical issues found")
    
    print("\n📊 File Status:")
    files = ['mqtt_service.py', 'index.html', 'requirements.txt', 'Procfile']
    for file in files:
        status = "✅ EXISTS" if os.path.exists(file) else "❌ MISSING"
        print(f"  {file}: {status}")