document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId) {
    alert("User ID not found.");
    return;
  }

  try {
    // Fetch user data from the server
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();

    // If user not found, alert the user
    if (!userData) {
      alert("User not found.");
      return;
    }

    // Populate the form with the user's data
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

    // For password changes
    const passwordCheckbox = document.querySelector('input[type="checkbox"]');
    passwordCheckbox.addEventListener("change", () => {
      const passwordField = document.querySelector('input[type="password"]');
      if (passwordCheckbox.checked) {
        passwordField.disabled = false;
      } else {
        passwordField.disabled = true;
      }
    });

    // Handle form submission for user update
    const form = document.querySelector("form.modal-body");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect the updated data from the form
      const updatedData = {
        firstName: form.querySelector('input[type="text"][value="Slađan"]')
          .value,
        lastName: form.querySelector('input[type="text"][value="Dinulović"]')
          .value,
        mail: form.querySelector(
          'input[type="email"][value="borbolnica@sezampro.rs"]'
        ).value,
        phone: form.querySelector('input[type="text"][value="0668620058"]')
          .value,
        password: passwordCheckbox.checked
          ? form.querySelector('input[type="password"]').value
          : undefined, // If password is changed
      };

      // If password is empty, do not send it
      if (!updatedData.password) delete updatedData.password;

      // Send the request to update the user
      const updateResponse = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await updateResponse.json();

      if (updateResponse.ok) {
        alert("User updated successfully!");
      } else {
        alert(`Error: ${result.msg}`);
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    alert("An error occurred while fetching the user.");
  }
});
