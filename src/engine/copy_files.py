import sys
import time
import shutil
import os

print("hi")


def copyFilesToFolder():
    print("copyFilesToFolder")
    start_time = time.time()
    file_paths = []
    # Read input from stdin until an empty line is encountered
    while True:
        line = sys.stdin.readline().rstrip()
        if line == "":
            break
        file_paths.append(line)
        
    if os.path.exists("runs/detect/predict"):
        shutil.rmtree("runs/detect/predict")
            
    # os.makedirs("runs/detect/predict")

    if file_paths:
        fileArray = file_paths[0].split(",")
        
        
        
        if os.path.exists("input"):
            shutil.rmtree("input")
            
        os.makedirs("input")
        
        

        print(f"tn:{len(fileArray)}")  # total no of images sent to python code
        sys.stdout.flush()

        for filename in fileArray:
            shutil.copy(filename, "input")

    print("Copied Files in:%s" % (time.time() - start_time))
    sys.stdout.flush()
    
# copyFilesToFolder()