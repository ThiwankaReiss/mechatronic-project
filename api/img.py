# img.py
import cv2
from ultralytics import YOLO
import math
import os
import time

# Load YOLO model
try:
    model = YOLO('best.pt')
    print("YOLO model loaded successfully")
except Exception as e:
    print(f"Failed to load YOLO model: {e}")
    model = None

target_class = None  # will be set dynamically

def set_target_class(name):
    global target_class
    target_class = name

def capture_image():
    os.system("libcamera-still -t 3000 -o h.jpg --width 640 --height 480 --nopreview")
    time.sleep(1)
    img = cv2.imread("h.jpg")
    if img is None:
        print("Failed to read captured image")
        return None, None, None
    h, w, _ = img.shape
    center_x = w / 2
    center_y = h / 2
    return img, center_x, center_y

def rotate(target_class, detections, center_x, center_y):
    for detection in detections:
        x_min, y_min, x_max, y_max, conf, class_id = detection.tolist()
        class_label = model.names[int(class_id)]
        if class_label == target_class:
            x_centroid = (x_min + x_max) / 2
            y_centroid = (y_min + y_max) / 2
            dx = x_centroid - center_x
            dy = y_centroid - center_y
            angle_rad = math.atan2(dy, dx)
            angle_deg = (math.degrees(angle_rad) + 360) % 360
            if angle_deg <= 180:
                rotate_angle = 180 - angle_deg
            else:
                rotate_angle = 360 - (angle_deg - 180)
            return 360 - rotate_angle
    return None

def angle_rotate():
    img, center_x, center_y = capture_image()
    if img is None or model is None:
        return None
    results = model.predict(img, imgsz=640, conf=0.31)
    detections = results[0].boxes.data
    angle = rotate(target_class, detections, center_x, center_y)
    if angle is not None:
        angle = 2 * angle
        return f"TURN_{angle}"
    else:
        return None

def cordinate_x():
    img, _, _ = capture_image()
    if img is None or model is None:
        return None
    results = model.predict(img, imgsz=640, conf=0.31)
    detections = results[0].boxes.data
    for detection in detections:
        x_min, _, x_max, _, _, class_id = detection.tolist()
        class_label = model.names[int(class_id)]
        if class_label == target_class:
            x = (x_min + x_max) / 2
            real_x = 170+((420/640)*x)
            real_x = max(240, min(330, real_x))
            return f"{real_x:.2f}_X"
    return None

def cordinate_y():
    img, _, _ = capture_image()
    if img is None or model is None:
        return None
    results = model.predict(img, imgsz=640, conf=0.31)
    detections = results[0].boxes.data
    for detection in detections:
        _, y_min, _, y_max, _, class_id = detection.tolist()
        class_label = model.names[int(class_id)]
        if class_label == target_class:
            y = (y_min + y_max) / 2
            real_y = 250 + ((300 / 480) * y)
            real_y = max(350, min(410, real_y))
            return f"{real_y:.2f}_Y"
    return None

def cleanup():
    pass  # optional: cv2.destroyAllWindows()
