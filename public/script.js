// Initialize current page and limit per page
let currentPage = 1;
const limit = 10;

// Function to fetch users from the server for a given page
async function fetchUsers(page = 1) {
  try {
    // Send a request to the server to fetch users with pagination
    const res = await fetch(`/api/users/?page=${page}&limit=${limit}`);
    const data = await res.json();

    // Render the fetched users into the table
    renderTable(data.users);

    // Render pagination controls based on total pages and current page
    renderPagination(data.totalPages, data.currentPage);
  } catch (err) {
    // Log an error if fetching users fails
    console.error("Greška pri preuzimanju korisnika:", err);
  }
}

// Function to render the users table
function renderTable(users) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // Clear previous table content

  users.forEach((user, index) => {
    const tr = document.createElement("tr");

    // Fill each row with user data
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username || ""}</td>
      <td>${user.firstName || ""}</td>
      <td>${user.lastName || ""}</td>
      <td>${user.mail || ""}</td>
      <td>${user.healthInstitution?.name || "—"}</td>
      <td>✖</td> <!-- (Placeholder for future use or status) -->
      <td>${user.lastLogin ? formatDate(user.lastLogin) : "—"}</td>
      <td><button class="role-btn" data-id="${user._id}">Uloge</button></td>
      <td><button class="edit-btn" data-id="${user._id}">Uredi</button></td>
      <td>✔</td> <!-- (Placeholder for future use or status) -->
    `;

    tbody.appendChild(tr); // Add the row to the table body
  });
}

// Function to render pagination buttons
function renderPagination(totalPages, currentPage) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = ""; // Clear previous pagination buttons

  // Helper function to create a button
  const createButton = (text, page, isActive = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    if (isActive) btn.classList.add("active"); // Highlight the active page
    btn.addEventListener("click", () => {
      currentPage = page;
      fetchUsers(page); // Fetch users for the selected page
    });
    return btn;
  };

  // Create the "previous" button
  pagination.appendChild(createButton("«", Math.max(1, currentPage - 1)));

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 3 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      // Always show first 3 pages, last page, and nearby pages
      pagination.appendChild(createButton(i, i, i === currentPage));
    } else if (i === 4 || i === totalPages - 1) {
      // Add dots ("...") to indicate skipped pages
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  // Create the "next" button
  pagination.appendChild(
    createButton("»", Math.min(totalPages, currentPage + 1))
  );
}

// Function to format a date string into Serbian locale format
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("sr-RS"); // Example: 01.01.2025. 12:34:56
}

// Event listener for creating a new user
document.getElementById("createUserBtn").addEventListener("click", () => {
  window.open("/kreiraj-korisnika", "_blank"); // Open new user creation page
});

// Event listener for editing a user (delegated on table body)
document.querySelector("table tbody").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const userId = e.target.getAttribute("data-id");

    if (userId) {
      window.open(`/uredi-korisnika/?id=${userId}`, "_blank"); // Open edit page
    } else {
      alert("ID korisnika nije pronađen."); // Alert if no ID found
    }
  }
});

// Event listener for editing user roles (delegated on table body)
document.querySelector("table tbody").addEventListener("click", (e) => {
  if (e.target.classList.contains("role-btn")) {
    const userId = e.target.getAttribute("data-id");

    if (userId) {
      window.open(`/izmeni-uloge/?id=${userId}`, "_blank"); // Open role editing page
    } else {
      alert("ID korisnika nije pronađen."); // Alert if no ID found
    }
  }
});

// Initially fetch users for the first page when the script loads
fetchUsers(currentPage);
