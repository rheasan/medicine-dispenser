#include <Servo.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include "time.h"
#include <vector>
#include <string>
#include <cstdio>

#define WIFI_SSID "CSE-WiFi"
#define WIFI_PASSWORD "cse@dept"
#define Servo_pin 13
// API key
#define API_KEY "AIzaSyBFHJhmSYedAxXEJLC3NNnsYgryoPOlQ1o"

// Project ID
#define FIREBASE_PROJECT_ID "medicine-dispenser-e52a9"

#define USER_EMAIL "innovationlab.cs299.2022@gmail.com"
#define USER_PASSWORD "medicine-dispenser"


const char* ssid     = "CSE-WiFi";
const char* password = "cse@dept";
int count = 0;
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 16200;
const int   daylightOffset_sec = 3600;
// Define Firebase Data object
FirebaseData fbdo, fbdoDocuments;
FirebaseAuth auth;
FirebaseConfig config;
Servo myServo;
bool runServo = false;
int oldMinutes = 0;
std::vector<bool> medicineDispensed;
FirebaseJson json;
FirebaseJsonData jsonData;
FirebaseJsonArray jsonArr;
int currentHours, currentMinutes;
int pos = 0;
unsigned long dataMillis = 0;
bool taskCompleted = false;
int btnPin = 34;
int buzzerPin = 33; 

void setup()
{

    Serial.begin(115200);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();
    myServo.attach(13);

    /* Assign the project host and api key (required) */
    config.api_key = API_KEY;

    /* Assign the user sign in credentials */
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    //printLocalTime();
    myServo.write(53);
    for(int i = 0; i < 4; i++){
      medicineDispensed.push_back(false);
    }
    pinMode(buzzerPin, OUTPUT);
}

void loop()
{   
  std::vector<String> medicineNames;
  std::vector<int> medicineMinutes, medicineHours;
    getLocalTime(&currentHours, &currentMinutes);
    //get list of all document in medicine-list collection
    if (Firebase.ready() && !taskCompleted)
    {
        taskCompleted = true;
        String collectionId = "medicine-list";
        if (Firebase.Firestore.listDocuments(&fbdo, FIREBASE_PROJECT_ID, "" , collectionId.c_str(), 16 , "" , "" , "name" , false ))
            {
              json.setJsonData(fbdo.payload().c_str());
              json.get(jsonData, "documents", true);
              jsonData.get<FirebaseJsonArray>(jsonArr);
              for(size_t i = 0; i < jsonArr.size(); i++){
                FirebaseJsonData tempJsonData, fields;
                FirebaseJson tempJson;
                jsonArr.get(tempJsonData, i);
                String stringValue = tempJsonData.to<String>().c_str();
                DynamicJsonDocument doc(2048);
                deserializeJson(doc, stringValue);
                String medicineName = doc["fields"]["name"]["stringValue"];
                medicineNames.push_back(medicineName);
              }
              
            }
        else
            Serial.println(fbdo.errorReason());
            }
    
    String authToken, refToken;
    getAuthToken(authToken, refToken);
    for (int i = 0; i < medicineNames.size(); i++){
        //Serial.printf("%s\n", medicineNames[i]);
        int tempMinutes, tempHours;
        getTime(medicineNames[i], authToken, &tempMinutes, &tempHours);
        medicineMinutes.push_back(tempMinutes);
        medicineHours.push_back(tempHours);
        count++;
    }
    Serial.printf("\n");
    
    Serial.printf("%d:%d\n", currentHours, currentMinutes);
    for(int i = 0; i < medicineNames.size(); i++) {
      Serial.printf("%d. %s %d:%d\n", i, medicineNames[i], medicineHours[i], medicineMinutes[i]);
    }

    for(int i = 0; i < count; i++){
      if(oldMinutes == currentMinutes){
        break;
      }
      if((medicineMinutes[i] == currentMinutes) && (medicineHours[i] == currentHours) && !medicineDispensed[i]){
        runServo = true;
        medicineDispensed[i] = true;  
        Serial.printf("%d, %d", i ,medicineMinutes.size());
        break;
      }
    }
      //getAuthToken();
    if(runServo){
      delay(10);
      myServo.write(0);
      delay(400);
      myServo.write(154);
      digitalWrite(buzzerPin, HIGH);
      delay(200);
      digitalWrite(buzzerPin, LOW);
      runServo = false;
    }
    oldMinutes = currentMinutes;
    delay(30000);
}


void getLocalTime(int* currentHours, int* currentMinutes){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
//  char* res;
//  sprintf(res, "%H:%M", &timeinfo);
//  Serial.println(res);

  *currentHours = timeinfo.tm_hour;
  *currentMinutes = timeinfo.tm_min;
}

int getMedicineNames(std::vector<String> medicineList) {
    bool taskCompleted = false;
    
  return 1;
}

void getAuthToken(String &authToken, String &refreshToken){
  
  String authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBFHJhmSYedAxXEJLC3NNnsYgryoPOlQ1o";
  HTTPClient http;
  http.begin(authUrl);
  
  int resCode = http.POST("{\"email\": \"innovationlab.cs299.2022@gmail.com\", \"password\": \"medicine-dispenser\", \"returnSecureToken\": \"true\"}");

  if(resCode > 0){
    String payload = http.getString();
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, payload);
    String tempAuthToken = doc["idToken"];
    String refToken = doc["refreshToken"];

    authToken = tempAuthToken;
    refreshToken = refToken;
//    Serial.println(tempAuthToken);
//    Serial.println(refToken);
  }
  http.end();
}


void getTime(String docName, String authToken, int* jsonMinutes, int* jsonHours){
  String url = "https://firestore.googleapis.com/v1/projects/medicine-dispenser-e52a9/databases/(default)/documents/medicine-list/" + docName;
  String auth = "Bearer " + authToken;
  String result;
  HTTPClient http;
  http.begin(url);
  
  http.addHeader("Authorization", auth.c_str());
  int resCode = http.GET();
  if(resCode > 0){
      String payload = http.getString();
//    Serial.printf("\n%d %s",resCode, docName);
      Serial.println(payload);
      DynamicJsonDocument doc(2048);
      deserializeJson(doc, payload);
      String res = doc["fields"]["timeString"]["stringValue"];
      int tempMinutes = doc["fields"]["minutes"]["integerValue"];
      int tempHours = doc["fields"]["hours"]["integerValue"];

      *jsonMinutes = tempMinutes;
      *jsonHours = tempHours;
      result = res;
  }
  http.end();
  //return result;
}
