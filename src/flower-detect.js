// const fs = require('fs');
const path = require('path');


let options_py = {
  mode: "text",
  pythonOptions: ["-u"], // get print results in real-time
  pythonPath: ".venv/Scripts/python.exe",
};

// possible type of messages passed by python code to javascript
// tn = total number of images sent to python
// cd = current number of images currently processed
// er = error message to see if manual stitching is required
// fd = file directory of the stitched image
// finished = save file location of the stitched image


let { PythonShell } = require("python-shell");

// Use when testing with python
let pyshell = new PythonShell("./src/engine/model.py", options_py); // for when py is converted to exe

// Use with pyinstaller created exe
// let pyshell = new PythonShell("./src/upload_multiple.exe", options_exe);  // for when py is converted to exe

// use when building app with exe
// let pyshell = new PythonShell("./resources/app/src/upload_multiple.exe", options_exe);  // for when py is converted to exe

// PythonShell.run("./segment/predict.py", options_py, function (err, results) {
//   if (err) throw err;
//   // results is an array consisting of messages collected during execution
//   console.log("results: %j", results);
// });

fileNames = [];
hasPythonCodeRun = false;
hasPythonCodeStarted = false;
var imageUpload = document.getElementById("image-upload");
imageUpload.addEventListener("change", function (event) {
  // Reset state to before python code was run
  const path = require("path");
  hasPythonCodeRun = false;
  var files = event.target.files;
  for (var i = 0; i < files.length; i++) {
    fileNames.push(files[i].path);
  }
  console.log(event.target.files);
  pyshell.send(fileNames);
  console.log(fileNames);

  hasPythonCodeStarted = true;
  pythonRunner();
  var imageUploadLabel = document.getElementById("uploadtour");
  imageUploadLabel.classList.add("d-none");
  var startButton = document.getElementById("start-webcam");
  startButton.classList.add("d-none");
});

function pythonRunner() {
  // console.log(pyPaths);
  let cd = 0;
  // var progressBarParent = document.getElementById("progress-bar-parent");
  // progressBarParent.classList.remove("d-none");
  pyshell.on("message", function (message) {

    console.log(message);
    const [typeofmessage, messagecode] = message.split(":");

    // if (typeofmessage == "fd") {
    //   console.log(message);
    //   console.log("Measured image saved");
    //   let strippedPath = message.replace(/^fd:/, "");
    //   // let outputMessage = document.getElementById('file-directory');
    //   // outputMessage.innerHTML = "Stitched image will be saved at: " + strippedPath;
    //   // fd = path.join(strippedPath, 'image1.png');
    //   localStorage.setItem("finalImageFolder", strippedPath);
    //   historyFolder = strippedPath.replace(
    //     "result-images",
    //     "result-images-history"
    //   );
    //   localStorage.setItem("historyFolder", historyFolder);
    // }

    if (typeofmessage == "tn") {
      tn = messagecode;
      outputMessage = document.getElementById("python-output");
      outputMessage.classList.remove("d-none");
      outputMessage.innerHTML =
        '<i class="bi bi-info-circle-fill"></i> ' +
        tn +
        " : Images Selected for Flower Detection";
    }

    if (typeofmessage == "cd") {
      cd += parseInt(messagecode);
      let percentageDone = (cd / tn) * 100;
      console.log(percentageDone);
      // var progressBar = document.getElementById("progress-bar");
      // progressBar.setAttribute("aria-valuenow", percentageDone);
      // progressBar.style.width = percentageDone + "%";
      // progressBar.value = percentageDone;
      outputMessage = document.getElementById("python-output");
      // outputMessage.classList.replace("alert-info", "alert-success");
      outputMessage.innerHTML =
        '<i class="bi bi-info-circle-fill"></i> ' +
        cd +
        " of " +
        tn +
        " Images Processed";
    }
    // if (typeofmessage == "an1") {
    //   angle1 = messagecode
    //   console.log(messagecode);
    //   // localStorage.setItem("angle1", angle1)
    // }
    // if (typeofmessage == "an2") {
    //   angle2 = messagecode
    //   console.log(messagecode);
    //   // localStorage.setItem("angle2", angle2)
    // }
    if (typeofmessage == "er") {
      hasPythonCodeRun = true;
      if (messagecode == 0) {
        console.log(messagecode);
        // console.log(fd);
        var resetButton = document.getElementById("reset-button");
        var showImageButton = document.getElementById("show-image-button");
        outputMessage = document.getElementById("python-output");
        outputMessage.classList.replace("alert-info", "alert-success");
        outputMessage.innerHTML = '<i class="bi bi-check-lg"></i> Flowers Detected Successfully!';
          // '<i class="bi bi-check-lg"></i> Contact Angle Measured Successfully!<br>Left Angle = '+
          // parseFloat(angle2).toFixed(2) +
          // '°<br>Right Angle = ' +
          // parseFloat(angle1).toFixed(2) + 
          // '°<br>Average Angle = ' +
          // ((parseFloat(angle1)+parseFloat(angle2))/2).toFixed(2) +
          // '°';
        resetButton.style.display = "block";
        showImageButton.style.display = "block";
        // finalImagePath = localStorage.getItem("finalImagePath");
        // const { shell } = require("electron"); // deconstructing assignment
        // shell.openPath(finalImagePath);
      }
    }
    // if (typeofmessage == "finished") {

    //   // let strippedPath = message.replace(/^finished:/, "");
    //   // shell.openPath(strippedPath);
    //   console.log(messagecode);

    //   fullSavePath = path.join("C:\Users\dusng\Documents\GitHub\yolov8-flower-electron\runs\detect" ,messagecode);
    //   print(fullSavePath)
    //   localStorage.setItem("finalImagePath", messagecode);
    //   defaultImage = document.getElementById("default-image");
    //   defaultImage.src = fullSavePath;
    // }
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) {
      console.log(err);
      console.log("An error occured");
      var outputMessage = document.getElementById("python-output");
      outputMessage.classList.replace("alert-info", "alert-danger");
      outputMessage.innerHTML = '<i class="bi bi-exclamation-triangle"></i> An Error Occured. Please Try Again.';
      var resetButton = document.getElementById("reset-button");
      resetButton.style.display = "block";

      percentageDone = 100;
    //   var progressBar = document.getElementById("progress-bar");
    //   progressBar.setAttribute("aria-valuenow", percentageDone);
    //   progressBar.style.width = percentageDone + "%";
    //   progressBar.classList.add("bg-danger");
    }
  });
}

openImage = () => {
  finalImagePath = localStorage.getItem("finalImagePath");
  const { shell } = require("electron"); // deconstructing assignment
  shell.openPath(finalImagePath);
};



resetPage = () => {
  pyshell.kill();
  window.location.reload();
};

// Video Capture Part

const video = document.getElementById('videoElement');
const startButton = document.getElementById('start-webcam');
const stopButton = document.getElementById('stop-webcam'); // New stop button
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
let stream;

startButton.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    video.play();
    var imageUploadLabel = document.getElementById("uploadtour");
    imageUploadLabel.classList.add("d-none");
    startButton.classList.add("d-none");
    var defaultImage = document.getElementById("default-image");
    defaultImage.classList.add("d-none");
    var mainContent = document.getElementById("main-content");
    mainContent.classList.replace("col-md-8", "col-md-12")
    startButton.classList.add("d-none");
    captureButton.classList.remove("d-none");
    stopButton.classList.remove("d-none");
    video.style.display = 'block';
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
});

stopButton.addEventListener('click', () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
    var imageUploadLabel = document.getElementById("uploadtour");
    imageUploadLabel.classList.remove("d-none");
    var defaultImage = document.getElementById("default-image");
    defaultImage.classList.remove("d-none");
    var mainContent = document.getElementById("main-content");
    mainContent.classList.replace("col-md-12", "col-md-8")
    startButton.classList.remove("d-none");
    captureButton.classList.add("d-none");
    stopButton.classList.add("d-none");
    video.style.display = 'none';
  }
});

const fs = require('fs'); // Include the fs module at the beginning of your script.

captureButton.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // Save the image data to a folder
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  const imagePath = path.join(__dirname, '../output/input_data'); // Replace 'images' with the folder path where you want to save the images
  console.log(imagePath);
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }
  const filename = `image_${Date.now()}.png`; // Use a unique filename for each image
  const filePath = path.join(imagePath, filename);

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
    } else {
      console.log('Image saved successfully:', filePath);
    }
  });

  hasPythonCodeStarted = true;
  pythonRunner();
  var imageUploadLabel = document.getElementById("uploadtour");
  imageUploadLabel.classList.add("d-none");
  var startButton = document.getElementById("start-webcam");
  startButton.classList.add("d-none");

});


// Tour
// Initialize the Shepherd.js Tour

// const Shepherd = require("shepherd.js");

// let tour = null;

// function startTour() {
//   if (tour) {
//     var resetButton = document.getElementById("reset-button");
//     // var showImageButton = document.getElementById("show-image-button");
//     var imageUploadLabel = document.getElementById("uploadtour");
//     imageUploadLabel.classList.remove("d-none");
//     resetButton.style.display = "block";
//     // showImageButton.style.display = "block";
//     tour.start();
//   }
// }

// tour = new Shepherd.Tour({
//   useModalOverlay: true,
// });

// tourCancelAction = () => {
//   tour.cancel();
//   console.log("tour cancelled");
//   if (hasPythonCodeRun == false) {
//     var resetButton = document.getElementById("reset-button");
//     // var showImageButton = document.getElementById("show-image-button");
//     resetButton.style.display = "none";
//     // showImageButton.style.display = "none";
//   }
//   if (hasPythonCodeStarted == true) {
//     var imageUploadLabel = document.getElementById("uploadtour");
//     imageUploadLabel.classList.add("d-none");
//     // console.log("hi")
//   }
// };

// steps = [
//   {
//     id: "step1",
//     title: "Upload Images",
//     text: "Click this button to upload your images to the automatic stitcher.",
//     attachTo: {
//       element: "#uploadtour",
//       on: "bottom",
//     },
//     classes: "step-class",
//     buttons: [
//       {
//         text: "Next",
//         action: tour.next,
//       },
//       {
//         text: "Exit Tour",
//         action: tourCancelAction,
//       },
//     ],
//   },
//   {
//     id: "step2",
//     title: "Copy Image",
//     text: "After the image is stitched, this button will be shown,Click this to Copy the saved image to your clipboard.",
//     attachTo: {
//       element: "#show-image-button",
//       on: "right",
//     },
//     classes: "step-class",
//     buttons: [
//       {
//         text: "Next",
//         action: tour.next,
//       },
//       {
//         text: "Exit Tour",
//         action: tourCancelAction,
//       },
//     ],
//   },
//   {
//     id: "step3",
//     title: "Open Folder",
//     text: "After the image is stitched, this button will be shown,Click this to open the folder where the imaegs are saved.",
//     attachTo: {
//       element: "#reset-button",
//       on: "right",
//     },
//     classes: "step-class",
//     buttons: [
//       {
//         text: "Next",
//         action: tour.next,
//       },
//       {
//         text: "Exit Tour",
//         action: tourCancelAction,
//       },
//     ],
//   },
//   {
//     id: "step4",
//     title: "Go Back",
//     text: "Click this  button to Go back to Homepage.",
//     attachTo: {
//       element: "#backtour",
//       on: "right",
//     },
//     classes: "step-class",
//     buttons: [
//       {
//         text: "Next",
//         action: tour.next,
//       },
//       {
//         text: "Exit Tour",
//         action: tourCancelAction,
//       },
//     ],
//   },
//   {
//     id: "step5",
//     title: "Tour Button",
//     text: "In case you forget the button function, you can click this button again anytime and it will guide you through all the buttons.",
//     attachTo: {
//       element: "#tourtour",
//       on: "top",
//     },
//     classes: "step-class",
//     buttons: [
//       {
//         text: "Exit Tour",
//         action: tourCancelAction,
//       },
//     ],
//   },
// ];

// tour.addSteps(steps);

// tour.defaultStepOptions = {
//   classes: "shepherd-theme-arrows",
//   scrollTo: true,
//   buttons: [
//     {
//       text: "Next",
//       action: tour.next,
//     },
//     {
//       text: "Exit Tour",
//       action: tourCancelAction,
//     },
//   ],
// };

