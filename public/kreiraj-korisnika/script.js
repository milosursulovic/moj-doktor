// Wait until the entire HTML document has been fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Select the form element on the page
  const form = document.querySelector("form");

  // Add a submit event listener to the form
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default browser form submission behavior

    // Collect form inputs (input fields and select elements)
    const inputs = form.querySelectorAll("input, select");

    // Create a data object from the form inputs
    const data = {
      username: inputs[0].value.trim(),
      uniqueMasterCitizenNumber: inputs[1].value.trim(),
      password: inputs[2].value,
      mail: inputs[3].value.trim(),
      firstName: inputs[4].value.trim(),
      phone: inputs[5].value.trim(),
      lastName: inputs[6].value.trim(),
      role: inputs[7].value,
    };

    try {
      // Send a POST request to the server to create a new user
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert the data object to JSON string
      });

      // Parse the response from the server
      const result = await response.json();

      // If the response is successful (status 200–299)
      if (response.ok) {
        alert("Успешно креиран корисник: " + result.userId); // Show success message
        form.reset(); // Reset the form fields
      } else {
        // If server returns an error, show the error message
        alert("Грешка: " + result.msg);
      }
    } catch (error) {
      // Handle network or unexpected errors
      alert("Дошло је до грешке: " + error.message);
    }
  });
});
