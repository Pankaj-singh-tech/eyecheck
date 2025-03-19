document.addEventListener("DOMContentLoaded", function () {
  const imageUpload = document.getElementById("image-upload");
  const uploadPreview = document.getElementById("upload-preview");
  const previewContainer = document.querySelector(".preview-container");
  const analyzeBtn = document.getElementById("analyze-btn");
  const analysisAnimation = document.querySelector(".analysis-animation");
  const analysisResult = document.getElementById("analysis-result");
  const resultHeading = document.getElementById("result-heading");
  const resultDescription = document.getElementById("result-description");
  const dropZone = document.getElementById("dropzone");

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropZone.classList.add("border-primary");
    dropZone.style.backgroundColor = "#f0f9ff";
    dropZone.style.borderColor = "#5f7adb";
  }

  function unhighlight() {
    dropZone.classList.remove("border-primary");
    dropZone.style.backgroundColor = "";
    dropZone.style.borderColor = "#cbd5e1";
  }

  dropZone.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      uploadFile(file);
    }
  }

  // File upload event
  imageUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  });

  function uploadFile(file) {
    // Display image preview
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadPreview.src = event.target.result;
      previewContainer.style.display = "block";
      analyzeBtn.style.display = "block";

      // Reset previous results
      analysisResult.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  analyzeBtn.addEventListener("click", function () {
    var formData = new FormData();

    // Get the file from the file input element
    var eyeimg = $("#image-upload")[0].files[0]; // Get the first file

    // Check if a file is selected
    if (eyeimg) {
      formData.append("eyeimg", eyeimg); // Append the file to FormData

      var base_url = window.location.origin;
      analyzeBtn.style.display = "none";
      analysisAnimation.style.display = "block";
      $.ajax({
        url: base_url + "/api/analyse/img",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          // Handle the response from the server
          console.log("Form submitted successfully", response);
          if (response[0] == "Cataract") {
            analysisResult.className = "result-positive";
            resultHeading.textContent = "Potential Cataract Detected";
            resultDescription.innerHTML =
              "The analysis indicates potential signs of cataract. <strong>This is not a diagnosis</strong>. " +
              "Please consult with an ophthalmologist for proper medical evaluation.";
          } else {
            analysisResult.className = "result-negative";
            resultHeading.textContent = "No Clear Signs of Cataract";
            resultDescription.innerHTML =
              "No obvious signs of cataract were detected in this image. " +
              "Regular eye check-ups are still recommended, especially if you experience vision changes.";
          }
          analyzeBtn.style.display = "block";
          analysisAnimation.style.display = "none";
          analysisResult.style.display = "block";
        },
        error: function (xhr, status, error) {
          // Handle errors if any
          console.error("Error occurred: " + error);
        },
      });
    } else {
      console.error("No file selected");
    }
  });
});

$(document).ready(function () {
  // Open file picker when "Take Photo" is clicked
  $("#take-photo-btn").click(function () {
    $("#camera-input").click();
  });

  // Handle file selection from camera
  $("#camera-input").change(function (event) {
    let file = event.target.files[0];
    if (file) {
      previewImage(file);
    }
  });

  // Handle file selection from upload
  $("#image-upload").change(function (event) {
    let file = event.target.files[0];
    if (file) {
      previewImage(file);
    }
  });

  // Function to preview image
  function previewImage(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      $("#upload-preview").attr("src", e.target.result);
      $(".preview-container").show();
      $("#analyze-btn").show();
    };
    reader.readAsDataURL(file);
  }
});
