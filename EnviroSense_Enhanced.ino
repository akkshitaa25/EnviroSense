
/*
 EnviroSense Enhanced Firmware (Template)
 Upgraded from original project.

 IMPORTANT:
 - Replace WIFI_SSID, WIFI_PASSWORD, WRITE_API_KEY and CHANNEL_ID.
 - Pins preserved:
      DHT11 -> GPIO27
      MQ135 -> GPIO34
      LDR   -> GPIO35

 ThingSpeak Fields:
 F1 Temp
 F2 Humidity
 F3 Air Quality
 F4 Light
 F5 Indoor Health Index
 F6 Sensor Confidence
 F7 Predicted AQ
 F8 Trend
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 27
#define DHTTYPE DHT11
#define MQ135_PIN 34
#define LDR_PIN 35

const char* WIFI_SSID="Pixel6833";
const char* WIFI_PASSWORD="12345678";
const char* WRITE_API_KEY="YY7D5HJ9555Q4YGK";
const long CHANNEL_ID= 3258324;

DHT dht(DHTPIN,DHTTYPE);

const int FILTER=5;
float tBuf[FILTER],hBuf[FILTER],aqBuf[FILTER],lBuf[FILTER];
int idx=0;

float lastAQ=0;
unsigned long lastUpload=0;
unsigned long intervalMs=15000;

float avg(float *a){
  float s=0;
  for(int i=0;i<FILTER;i++) s+=a[i];
  return s/FILTER;
}

void connectWiFi(){
  if(WiFi.status()==WL_CONNECTED) return;
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  while(WiFi.status()!=WL_CONNECTED){
    delay(500);
  }
}

float clamp(float v,float lo,float hi){
  if(v<lo) return lo;
  if(v>hi) return hi;
  return v;
}

int healthIndex(float t,float h,float aq,float light){
  float ts=100-abs(t-25)*5;
  float hs=100-abs(h-50)*2;
  float aqs=100-clamp(aq/40.0,0,100);
  float ls=100-abs(light-500)/5;
  float score=0.3*clamp(ts,0,100)+0.25*clamp(hs,0,100)+
              0.3*clamp(aqs,0,100)+0.15*clamp(ls,0,100);
  return (int)clamp(score,0,100);
}

int confidence(float t,float h,float aq){
  int c=100;
  if(isnan(t)||isnan(h)) c-=40;
  if(aq<0||aq>4095) c-=20;
  return max(c,0);
}

void upload(float t,float h,float aq,float light,int ihi,int conf,float pred,int trend){
  if(WiFi.status()!=WL_CONNECTED) connectWiFi();

  String url="http://api.thingspeak.com/update?api_key=";
  url+=WRITE_API_KEY;
  url+="&field1="+String(t,1);
  url+="&field2="+String(h,1);
  url+="&field3="+String(aq,0);
  url+="&field4="+String(light,0);
  url+="&field5="+String(ihi);
  url+="&field6="+String(conf);
  url+="&field7="+String(pred,0);
  url+="&field8="+String(trend);

  HTTPClient http;
  http.begin(url);
  http.GET();
  http.end();
}

void setup(){
  Serial.begin(115200);
  dht.begin();
  connectWiFi();
}

void loop(){
  if(millis()-lastUpload<intervalMs) return;

  float t=dht.readTemperature();
  float h=dht.readHumidity();
  float aq=analogRead(MQ135_PIN)-20;   // calibration offset
  float light=map(analogRead(LDR_PIN),0,4095,1000,0);

  if(isnan(t)||isnan(h)){
    Serial.println("Invalid DHT reading");
    delay(1000);
    return;
  }

  tBuf[idx]=t;
  hBuf[idx]=h;
  aqBuf[idx]=aq;
  lBuf[idx]=light;
  idx=(idx+1)%FILTER;

  t=avg(tBuf);
  h=avg(hBuf);
  aq=avg(aqBuf);
  light=avg(lBuf);

  int trend=0;
  if(aq>lastAQ+10) trend=1;
  else if(aq<lastAQ-10) trend=-1;

  float predictedAQ=aq+(aq-lastAQ)*3;
  lastAQ=aq;

  if(aq>300) intervalMs=3000;
  else if(aq>200) intervalMs=7000;
  else intervalMs=15000;

  int ihi=healthIndex(t,h,aq,light);
  int conf=confidence(t,h,aq);

  Serial.println("====== EnviroSense ======");
  Serial.printf("Temp: %.1f C\n",t);
  Serial.printf("Humidity: %.1f %%\n",h);
  Serial.printf("AQ: %.0f\n",aq);
  Serial.printf("Light: %.0f lux\n",light);
  Serial.printf("IHI: %d\n",ihi);
  Serial.printf("Confidence: %d%%\n",conf);
  Serial.printf("Predicted AQ: %.0f\n",predictedAQ);
  Serial.printf("Sampling: %lu ms\n",intervalMs);

  upload(t,h,aq,light,ihi,conf,predictedAQ,trend);

  lastUpload=millis();
}
