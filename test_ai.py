#!/usr/bin/env python3
"""
AI Test Script for TermChat LT
Tests the AI functionality by sending messages and checking responses
"""

import paho.mqtt.client as mqtt
import json
import time
import threading

# Test configuration
BROKER = "broker.emqx.io"
PORT = 1883
INPUT_TOPIC = "termchat/input"
OUTPUT_TOPIC = "termchat/output"

# Test messages
TEST_MESSAGES = [
    "ai hello",
    "termai kas tu esi?",
    "What is 2+2?",
    "Explain quantum physics?",
    "ai papasakok apie Lietuvą",
    "termai koks oras šiandien?",
    "Kas yra dirbtinis intelektas?",
    "ai write a Python function",
    "termai sukurk žaidimą"
]

class AITester:
    def __init__(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.responses = []
        self.test_complete = False
        
    def on_connect(self, client, userdata, flags, rc, properties=None):
        print(f"✅ Connected to MQTT broker (code: {rc})")
        client.subscribe(OUTPUT_TOPIC)
        
    def on_message(self, client, userdata, message, properties=None):
        try:
            payload = message.payload.decode()
            data = json.loads(payload)
            
            if data.get('id') == 'TERMAI':
                response = data.get('msg', '')
                print(f"🤖 AI Response: {response}")
                self.responses.append(response)
            
        except Exception as e:
            print(f"❌ Message parse error: {e}")
    
    def send_test_message(self, text):
        message = {
            "id": "TESTER",
            "msg": text,
            "timestamp": int(time.time() * 1000)
        }
        
        print(f"📤 Sending: {text}")
        self.client.publish(INPUT_TOPIC, json.dumps(message))
        
    def run_tests(self):
        print("🚀 Starting AI Intelligence Test...")
        print("=" * 50)
        
        # Setup MQTT
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
        try:
            self.client.connect(BROKER, PORT, 60)
            self.client.loop_start()
            
            # Wait for connection
            time.sleep(2)
            
            # Send test messages
            for i, test_msg in enumerate(TEST_MESSAGES):
                print(f"\n🧪 Test {i+1}/{len(TEST_MESSAGES)}")
                self.send_test_message(test_msg)
                time.sleep(3)  # Wait for response
                
            # Wait for final responses
            time.sleep(5)
            
            # Results
            print("\n" + "=" * 50)
            print("📊 TEST RESULTS")
            print("=" * 50)
            print(f"Messages sent: {len(TEST_MESSAGES)}")
            print(f"AI responses: {len(self.responses)}")
            
            if len(self.responses) > 0:
                print("✅ AI is responding!")
                print(f"Response rate: {len(self.responses)/len(TEST_MESSAGES)*100:.1f}%")
                
                # Check intelligence
                smart_indicators = ['python', 'function', 'lietuvą', 'quantum', 'dirbtinis']
                smart_responses = sum(1 for resp in self.responses 
                                    if any(word in resp.lower() for word in smart_indicators))
                
                print(f"Smart responses: {smart_responses}/{len(self.responses)}")
                
                if smart_responses > 0:
                    print("🧠 AI shows intelligence!")
                else:
                    print("🤔 AI responses seem basic")
            else:
                print("❌ No AI responses received")
                print("Check if backend service is running")
                
        except Exception as e:
            print(f"❌ Test failed: {e}")
        finally:
            self.client.loop_stop()
            self.client.disconnect()

if __name__ == "__main__":
    tester = AITester()
    tester.run_tests()