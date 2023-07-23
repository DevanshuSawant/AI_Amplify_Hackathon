from ultralytics import YOLO
import copy_files as cf
import os


model = YOLO("src/engine/best.pt")

cf.copyFilesToFolder()


results = model.predict(source="input", save=True, save_txt=True)

print("done")
print(f'er:0')
print(f'finished')

# filename = os.listdir("runs/detect/predict")

print(f'filename')

import os
import subprocess

# Replace 'image_path.jpg' with the path to the image you want to open
filename = os.listdir("runs/detect/predict")

for file in filename:
    print(file)
    image_path = os.path.join("runs/detect/predict", file)
    # Check if the image file exists at the specified path
    if os.path.exists(image_path):
        # Open the image using the default image viewer associated with the operating system
        try:
            if os.name == "nt":  # For Windows
                os.startfile(image_path)
            elif os.name == "posix":  # For macOS and Linux
                subprocess.run(["xdg-open", image_path], check=True)
        except Exception as e:
            print("Error:", e)
    else:
        print("Image file not found at the specified path.")