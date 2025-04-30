// Get query parameters from the URL (e.g. ?id=123)
const params = new URLSearchParams(window.location.search);
// Extract the 'id' parameter value from the URL
const userId = params.get("id");

// Function to load user data and populate the form
async function loadUserRole() {
    try {
        // Fetch user data from the backend API
        const res = await fetch(`/api/users/${userId}`);
        const user = await res.json();

        // If the response is not OK, throw an error with the message
        if (!res.ok) throw new Error(user.msg || "Greška pri učitavanju korisnika");

        // Populate HTML elements with user data
        document.getElementById("username").textContent = user.username;
        document.getElementById("fullName").textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById("email").textContent = user.mail;

        // Check the correct radio button based on the user's current role
        const roleRadio = document.querySelector(`input[name="role"][value="${user.role}"]`);
        if (roleRadio) roleRadio.checked = true;
    } catch (error) {
        // Display error to the user
        alert("Greška: " + error.message);
    }
}

// Call the function to load user data on page load
loadUserRole();

// Add a submit event listener to the role change form
document.getElementById("roleForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get the selected role from the radio buttons
    const newRole = document.querySelector('input[name="role"]:checked')?.value;

    // Validate that a role was selected
    if (!newRole) {
        alert("Molimo odaberite rolu.");
        return;
    }

    try {
        // Send a PATCH request to update the user's role
        const res = await fetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }), // Send new role in request body
        });

        const data = await res.json();

        // If successful, show success message
        if (res.ok) {
            alert("Uloga uspešno ažurirana!");
        } else {
            alert("Greška: " + data.msg);
        }
    } catch (error) {
        // Display error if the request fails
        alert("Greška: " + error.message);
    }
});
