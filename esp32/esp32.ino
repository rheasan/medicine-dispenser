/*
Download all libraries from https://github.com/mobizt/Firebase-ESP-Client/tree/main/src
*/

#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>


#define WIFI_SSID "WIFI_AP"
#define WIFI_PASSWORD "WIFI_PASSWORD"

// API key
#define API_KEY "AIzaSyBFHJhmSYedAxXEJLC3NNnsYgryoPOlQ1o"

// Project ID
#define FIREBASE_PROJECT_ID "medicine-dispenser-e52a9"

#define USER_EMAIL "innovationlab.cs299.2022@gmail.com"
#define USER_PASSWORD "medicine-dispenser"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long dataMillis = 0;
int count = 0;

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

    Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

    /* Assign the project host and api key (required) */
    config.api_key = API_KEY;

    /* Assign the user sign in credentials */
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    Firebase.begin(&config, &auth);

    Firebase.reconnectWiFi(true);
}

void loop()
{

    // Firebase.ready() should be called repeatedly to handle authentication tasks.

    if (Firebase.ready() && !taskCompleted)
    {
        taskCompleted = true;
        // Should run the Create_Documents.ino prior to test this example to create the documents in the collection Id at a0/b0/c0

        // a0 is the collection id, b0 is the document id in collection a0 and c0 is the collection id id in the document b0.
        String collectionId = "medicine-list";

        // If the collection Id path contains space e.g. "a b/c d/e f"
        // It should encode the space as %20 then the collection Id will be "a%20b/c%20d/e%20f"

        Serial.print("List the documents in a collection... ");

        if (Firebase.Firestore.listDocuments(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, collectionId.c_str(), 4 /* The maximum number of documents to return */, "" /* The nextPageToken value returned from a previous List request, if any. */, "" /* The order to sort results by. For example: priority desc, name. */, "name" /* the field name to mask */, false /* showMissing, iIf the list should show missing documents. A missing document is a document that does not exist but has sub-documents. */))
            Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
        else
            Serial.println(fbdo.errorReason());
    }
}
