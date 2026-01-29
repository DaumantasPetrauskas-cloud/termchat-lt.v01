#!/usr/bin/env python3
"""
Simple MQTT test for public deployment
"""

import paho.mqtt.client as mqtt
import json
import time

def test_mqtt_chat():
    print("🔗 Testing MQTT Chat Connection")
    print("=" * 40)
    
    connected = False
    messages_received = 0
    
    def on_connect(client, userdata, flags, rc, properties=None):
        nonlocal connected
        if rc == 0:
            print("✅ Connected to MQTT broker")
            connected = True
            client.subscribe("termchat/output")
            client.subscribe("termchat/messages")
            
            # Send test message
            test_msg = {
                "id": "TESTER",
                "msg": "ai hello test",
                "timestamp": int(time.time() * 1000)
            }
            client.publish("termchat/input", json.dumps(test_msg))
            print("📤 Sent test message: 'ai hello test'")
        else:
            print(f"❌ Connection failed: {rc}")
    
    def on_message(client, userdata, message, properties=None):
        nonlocal messages_received
        messages_received += 1
        try:
            data = json.loads(message.payload.decode())
            if data.get('id') == 'TERMAI':
                print(f"🤖 AI Response: {data.get('msg', '')[:50]}...")
                return True
        except:
            pass
        print(f"📨 Message {messages_received}: {message.payload.decode()[:50]}...")
    
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect("broker.emqx.io", 1883, 60)
        client.loop_start()
        
        # Wait for connection and messages
        for i in range(10):
            time.sleep(1)
            if connected and messages_received > 0:
                break
        
        client.loop_stop()
        client.disconnect()
        
        if connected:
            print(f"✅ MQTT working - received {messages_received} messages")
        else:
            print("❌ MQTT connection failed")
            
    except Exception as e:
        print(f"❌ MQTT error: {e}")

if __name__ == "__main__":
    test_mqtt_chat()