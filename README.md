1. PROJECT OVERVIEW

      EnviroSense is a low-cost IoT-based indoor environmental monitoring system designed to monitor important indoor environmental parameters in real time.
      
      The system uses an ESP32 microcontroller along with sensors to measure temperature, humidity, air quality, and light intensity. The collected data is transmitted through WiFi to   ThingSpeak, where it is stored and visualized. A web-based dashboard built using HTML, CSS, and JavaScript displays the sensor readings through graphs and status indicators.
      
      The project aims to provide an affordable and simple solution for monitoring indoor environmental conditions in homes, classrooms, offices, and laboratories.

2. OBJECTIVES

      • Monitor indoor temperature and humidity.
      
      • Monitor indoor air quality and gas concentration.
      
      • Measure light intensity using an LDR.
      
      • Collect and transmit sensor data using ESP32 and WiFi.
      
      • Store sensor data in the ThingSpeak cloud platform.
      
      • Display real-time environmental data through a web dashboard.
      
      • Provide an Environment Score based on multiple sensor readings.
      
      • Generate rule-based recommendations for improving indoor conditions.

3. KEY FEATURES

      • Real-time monitoring of temperature, humidity, air quality, and light intensity.
      
      • ESP32-based IoT system.
      
      • Wireless data transmission using WiFi and HTTP.
      
      • Cloud storage using ThingSpeak.
      
      • Web dashboard using HTML, CSS, and JavaScript.
      
      • Graphical visualization of sensor readings.
      
      • Environment Score combining multiple sensor readings.
      
      • Rule-based recommendations based on current environmental conditions.
      
      • Low-cost hardware implementation.

4. SYSTEM ARCHITECTURE

      The system follows a layered architecture:
      
      Sensing Layer
      
      ↓
      
      Processing Layer
      
      ↓
      
      Communication Layer
      
      ↓
      
      Cloud Storage (ThingSpeak)
      
      ↓
      
      Visualization Layer
      
      Sensors connected to the ESP32 collect environmental readings. The ESP32 processes and formats the readings and sends them through WiFi using HTTP GET requests to ThingSpeak. The stored data is retrieved through an API and displayed on the web dashboard.

5. HARDWARE COMPONENTS

      • ESP32 microcontroller
      
      • DHT11 sensor – temperature and humidity
      
      • MQ135 gas sensor – air quality/gas concentration
      
      • LDR – light intensity
      
      • Approximately 10kΩ resistor for the LDR voltage divider
      
      • Breadboard
      
      • Jumper wires
      
      • Cardboard enclosure
      
      Approximate total hardware cost: ₹925.
      
      Sensor pin mapping:
      
      • DHT11 → GPIO 27 (Digital)
      
      • MQ135 → GPIO 34 (Analog ADC)
      
      • LDR → GPIO 35 (Analog ADC)

6. TECHNOLOGIES USED

      Hardware:
      
      • ESP32
      
      • DHT11
      
      • MQ135
      
      • LDR
      
      Software and Cloud:
      
      • Arduino/ESP32 programming environment
      
      • WiFi
      
      • HTTP GET
      
      • ThingSpeak
      
      • HTML
      
      • CSS
      
      • JavaScript
      
      • API-based data retrieval

7. HOW IT WORKS

      1. The DHT11 measures temperature and humidity.
      
      2. The MQ135 measures changes related to indoor air quality/gas concentration.
      
      3. The LDR measures light intensity through an analog voltage-divider circuit.
      
      4. The ESP32 reads the sensor values.
      
      5. The readings are processed, including filtering invalid or noisy readings.
      
      6. The ESP32 connects to WiFi and sends the data to ThingSpeak using HTTP GET requests.
      
      7. Sensor data is stored in ThingSpeak with timestamps.
      
      8. The web dashboard retrieves the data through an API.
      
      9. The dashboard displays graphs, status indicators, the Environment Score, and rule-based recommendations.
      
      10. Data is updated approximately every 15 seconds.

8. RESULTS

      The prototype was tested indoors and operated continuously without major interruptions.
      
      Observed results included:
      
      • Temperature remained relatively stable with slight variations.
      
      • Humidity showed moderate fluctuations.
      
      • The MQ135 detected changes in indoor conditions.
      
      • LDR readings varied according to lighting conditions.
      
      • ThingSpeak received updates approximately every 15 seconds.
      
      The system performed reliably within the defined project scope and provided real-time environmental monitoring and visualization.

9. LIMITATIONS
      
      • DHT11 has moderate accuracy compared with more advanced temperature and humidity sensors.
      
      • MQ135 requires calibration for precise gas detection.
      
      • The system depends on a stable WiFi connection for cloud communication.
      
      • The current implementation uses threshold-based rules and does not include advanced predictive models.
      
      • The prototype is intended for indoor monitoring within the defined project scope and is not a replacement for advanced industrial monitoring systems.

10. FUTURE ENHANCEMENTS

      • Replace DHT11 with DHT22 or more advanced sensors.
      
      • Add dedicated CO₂ and PM sensors for improved air-quality monitoring.
      
      • Add motion and noise sensors.
      
      • Automate devices such as fans, air purifiers, and lights.
      
      • Develop a mobile application.
      
      • Add alerts and notifications.
      
      • Introduce machine-learning-based predictive analysis.
      
      • Scale the system for offices, classrooms, and industrial spaces using multiple sensor nodes.

11. CONCLUSION

      EnviroSense demonstrates a low-cost IoT-based approach to indoor environmental monitoring. By combining ESP32, DHT11, MQ135, and LDR sensors with WiFi, ThingSpeak, and a web dashboard, the system can collect, store, visualize, and interpret environmental data in real time.

      The prototype performs reliably within its defined scope and provides a practical foundation for future improvements such as additional sensors, automation, mobile applications, alerts, and machine-learning-based analysis.
