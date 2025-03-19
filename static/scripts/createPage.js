$(document).ready(function () {
  $("#myVideoForm").validate({
    rules: {
    //   title: {
    //     required: true,
    //     minlength: 3,
    //   },
    //   description: {
    //     required: true,
    //     minlength: 5,
    //   },
    //   genre: {
    //     required: true,
    //   },
    },
    messages: {
    //   title: {
    //     required: "Please enter a title",
    //     minlength: "Title must be at least 3 characters long",
    //   },
    //   description: {
    //     required: "Please enter a description",
    //     minlength: "Description must be at least 5 characters long",
    //   },
    //   genre: {
    //     required: "Please select a genre",
    //   },
    },
    submitHandler: function (form) {
      var formData = new FormData(form);
      base_url = window.location.origin;
      $.ajax({
        url: base_url+"/api/video/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          // Handle the response from the server
          console.log("Form submitted successfully", response);
        },
        error: function (xhr, status, error) {
          // Handle errors if any
          console.error("Error occurred: " + error);
        },
      });
    },
  });
});
