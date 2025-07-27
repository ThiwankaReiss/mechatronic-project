#include <Stepper.h>
#include <Servo.h>

#define STEPS_PER_REV 2048

Stepper stepper(STEPS_PER_REV, 8, 10, 9, 11);  // Stepper motor pins
Servo myServo;   // Linear actuator or Z-axis
Servo myServo2;  // Gripper

String inputString = "";

//define limit switches
const int ls_1=2;
const int ls_2=3;

//define flags
int flag_1=0;
int flag_2=0;

//define relay pin
const int relayPin1 = A0;
const int relayPin2 = A2;


const int stepX = 12;
const int dirPin = 4;

const int stepY = 13;


int curt_x = 0;
int curt_y = 0;




void setup() {
  Serial.begin(9600);
  stepper.setSpeed(10);
  myServo.attach(6);  // Z-axis servo
  myServo2.attach(5); // Gripper servo
  pinMode(ls_1,INPUT_PULLUP);   //limit switch pins
  pinMode(ls_2,INPUT_PULLUP);

  pinMode(relayPin1, OUTPUT);  //Relay pins  
  pinMode(relayPin2,OUTPUT);
  digitalWrite(relayPin1,LOW);
  digitalWrite(relayPin2,LOW);

  ///CNC//////////////////////////////////////

  // X axis
  pinMode(stepX, OUTPUT);
  pinMode(dirPin, OUTPUT);

  // Y axis
  pinMode(stepY, OUTPUT);

  ///pinMode(enPin, OUTPUT);

  
 /// digitalWrite(enPin, LOW); // Enable stepper drivers

}

void loop() {
  limit_switch_1();
  limit_switch_2();
  if (Serial.available()) {
    inputString = Serial.readStringUntil('\n');
    inputString.trim();
///CNC//////////////////////////////////////////////////////////////////


    if (inputString.startsWith("TURN_")) {
      digitalWrite(relayPin2,HIGH);
      rotate(inputString);
      digitalWrite(relayPin2,LOW);
    } 
    else if (inputString.startsWith("move_z_")) {
      moveServoFromCommand(inputString);
    } 
    else if (inputString.startsWith("gripper_")) {
      gripCommand(inputString);
    } 
    else {

      X_and_Y();

    }
  }
}

void rotate(String cmd){
  int firstSep=inputString.indexOf('_');
 

  if (firstSep>0){

    String angleStr = inputString.substring(firstSep + 1);

    int angle = angleStr.toInt();

    int steps = (int)(angle * (STEPS_PER_REV / 360.0));
    stepper.step(steps);
    delay(1000);
    Serial.println("ROTATE_DONE");  // Optional if used in Python


  }
}

void moveServoFromCommand(String cmd) {
  String valueStr = cmd.substring(7);           
  float distance = valueStr.toFloat();          
  distance = constrain(distance, 0, 57);        
  int angle = round(distance * 180.0 / 57.0);   

  myServo.write(180 - angle);                  
  delay(3000);  // Let servo reach position
  Serial.println("Z_MOVE_DONE");  // Confirm to Raspberry Pi
}

void gripCommand(String cmd) {
  String valueStr = cmd.substring(8); 
  int angle = valueStr.toInt();
  myServo2.write(angle);
  delay(3000);  // Let gripper finish
  Serial.println("GRIP_DONE");  // Confirm to Raspberry Pi
}

void limit_switch_1(){
  if (digitalRead(ls_1)==LOW && flag_1==0){
    Serial.println("safe_X");
    flag_1=1;
    delay(50);
  }
  if (digitalRead(ls_1)==HIGH && flag_1==1){
    digitalWrite(relayPin1,HIGH);
    Serial.println("System is droped");
    flag_1=0;
    delay(50);
  }
}

void limit_switch_2(){
  if (digitalRead(ls_2)==LOW && flag_2==0){
    Serial.println("safe_Y");
    flag_2=1;
    delay(50);
  }
  if (digitalRead(ls_2)==HIGH && flag_2==1){
    digitalWrite(relayPin1,HIGH);
    Serial.println("System is droped");
    flag_2=0;
    delay(50);
  }
}

///CNC///////////////////////////////////////////////////


void X_and_Y(){

  int firstSep = inputString.indexOf('_');
  int secondSep = inputString.lastIndexOf('_');

  if (firstSep > 0  ) {

    String distanceStr = inputString.substring(0, firstSep);
    String axisStr = inputString.substring(firstSep + 1);

    int position = distanceStr.toInt();

    if (axisStr.equalsIgnoreCase("X")) {


      int distance = dis(curt_x, position);  // Calculate distance for X axis
      bool direction = dir(curt_x, position);  // Determine direction for X axis

      Serial.println("Moving X axis");
      rotateAxis(stepX, distance, direction);
      curt_x = position; // Update current X position

  } else if (axisStr.equalsIgnoreCase("Y")) {



    int distance = dis(curt_y, position);  // Calculate distance for Y axis
    bool direction = dir(curt_y, position);  // Determine direction for Y axis

    Serial.println("Moving Y axis");
    rotateAxis(stepY, distance, direction);
    curt_y = position; // Update current Y position

  } else {

    Serial.println("Invalid axis. Use X or Y.");
      }
} else {
      
  Serial.println("Invalid format. Use format like 300_X.");
    }
}
void rotateAxis(int stepPin, int distance, bool direction) {
  digitalWrite(dirPin, direction ? HIGH : LOW);  // Set direction of rotation

  float pulses = (distance * 200.0) / 39.625; // Conversion factor for your setup
  int intPulses = round(pulses);  // Convert to integer pulses

  Serial.print("Pulses: ");
  Serial.println(intPulses);

  bool completed = true;

  for (int x = 0; x < intPulses; x++) {

    if (digitalRead(ls_1) == HIGH || digitalRead(ls_2) == HIGH) {
      digitalWrite(relayPin1, HIGH);  // Activate drop system
      Serial.println("System is droped");
      completed = false;
      break; 
    }

    digitalWrite(stepPin, HIGH);
    delayMicroseconds(1000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(1000);
  }
  if (completed){
    Serial.println("MOVE_DONE");
  }

  delay(500); // Optional pause
}

float dis(int curt_p, int position) {
  // Calculate and return the distance
  return abs(position - curt_p);
}

bool dir(int curt_p, int position) {
  // Determine and return the direction
  return position > curt_p;
}