# main.py
import serial
import time
from  . import img

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
time.sleep(2)

gripper_max_angle = 150
gripper_min_angle = 10
z_max_move = 0
z_min_move = 46

warning_msg = "System is droped"

def set_arduino_command(command):
    ser.write(f"{command}\n".encode())
    print(f"[Pi] Sent command: {command}")

def wait_for_arduino(message):
    print(f"[Pi] Waiting for Arduino: {message}")
    while True:
        line = ser.readline().decode().strip()
        if line:
            print(f"[Arduino] {line}")
        if line == message:
            print(f"[Pi] Received: {message}")
            break
        elif line == warning_msg:
            exit()

def send_and_wait(command, message):
    set_arduino_command(command)
    wait_for_arduino(message)

def default():
    send_and_wait("0_X", "MOVE_DONE")
    send_and_wait("0_Y", "MOVE_DONE")
    send_and_wait(f"move_z_{z_max_move}", "Z_MOVE_DONE")
    set_arduino_command(f"gripper_{gripper_max_angle}")

def pickplace(target_class, place_point):
    print("[Pi] Starting pick and place...")
    default()

    img.set_target_class(target_class)

    turntable_command = img.angle_rotate()
    # if turntable_command is None:
    #     turntable_command = img.angle_rotate()

    set_arduino_command(turntable_command)

    x_command = img.cordinate_x()
    y_command = img.cordinate_y()

    # for _ in range(5):  # Repeat 5 times
    #     if x_command is None:
    #         x_command = img.cordinate_x()
    #     if y_command is None:
    #         y_command = img.cordinate_y()

# Fallback values if still None
    if x_command is None:
        x_command = "290_X"
    if y_command is None:
        y_command = "395_Y"

  

    # img.cleanup()

    if not x_command or not y_command:
        print("[Pi] Error: Missing coordinates.")
        return

    send_and_wait(x_command, "MOVE_DONE")
    send_and_wait(y_command, "MOVE_DONE")

    send_and_wait(f"move_z_{z_min_move}", "Z_MOVE_DONE")
    send_and_wait(f"gripper_{gripper_min_angle}", "GRIP_DONE")
    send_and_wait(f"move_z_{z_max_move}", "Z_MOVE_DONE")

    A, B, C = [0, 0,35], [200, 125,56], [340,125, 56]

    place_point = place_point.upper()
    if place_point == "A":
        x, y ,z= A
    elif place_point == "B":
        x, y ,z= B
    elif place_point == "C":
        x, y ,z= C
    else:
        print("[Pi] Invalid input. Defaulting to A.")
        x, y ,z = A

    send_and_wait(f"{y}_Y", "MOVE_DONE")
    send_and_wait(f"{x}_X", "MOVE_DONE")

    send_and_wait(f"move_z_{z}", "Z_MOVE_DONE")
    send_and_wait(f"gripper_{gripper_max_angle}", "GRIP_DONE")
    send_and_wait(f"move_z_{z}", "Z_MOVE_DONE")

    default()

def main(target_class, place_point):
    try:
        pickplace(target_class, place_point)
    except KeyboardInterrupt:
        print("\n[Pi] Exiting...")
        ser.close()
