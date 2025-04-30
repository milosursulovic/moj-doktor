// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
  // Get URL parameters and extract the user ID
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  // If no user ID is found in the URL, alert and exit
  if (!userId) {
    alert("User ID not found.");
    return;
  }

  try {
    // Fetch user data from the server using the user ID
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();

    // If no user data is returned, alert and exit
    if (!userData) {
      alert("User not found.");
      return;
    }

    // Populate the form fields with the fetched user data
    document.querySelector(
      'input[type="text"][value="sladan.dinulovic"]'
    ).value = userData.username;
    document.querySelector('input[type="text"][value="Slađan"]').value =
      userData.firstName;
    document.querySelector('input[type="text"][value="Dinulović"]').value =
      userData.lastName;
    document.querySelector(
      'input[type="email"][value="borbolnica@sezampro.rs"]'
    ).value = userData.mail;
    document.querySelector('input[type="text"][value="0668620058"]').value =
      userData.phone;

    // Add a submit event listener to the form for updating the user
    const form = document.querySelector("form.modal-body");
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior

      // Collect updated data from the form inputs
      const updatedData = {
        firstName: form.querySelector('input[type="text"][value="Slađan"]').value,
        lastName: form.querySelector('input[type="text"][value="Dinulović"]').value,
        mail: form.querySelector(
          'input[type="email"][value="borbolnica@sezampro.rs"]'
        ).value,
        phone: form.querySelector('input[type="text"][value="0668620058"]').value,
        password: form.querySelector('input[type="password"]').value || undefined,
      };

      // If password is not provided, remove it from the data object
      if (!updatedData.password) delete updatedData.password;

      // Send PATCH request to update the user with the new data
      const updateResponse = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await updateResponse.json();

      // Show a success or error message based on the response
      if (updateResponse.ok) {
        alert("User updated successfully!");
      } else {
        alert(`Error: ${result.msg}`);
      }
    });
  } catch (error) {
    // Log and alert if an error occurs during the fetch or update process
    console.error("Error fetching user:", error);
    alert("An error occurred while fetching the user.");
  }
});
