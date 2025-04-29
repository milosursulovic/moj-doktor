let currentPage = 1;
const limit = 10; // or any number you want per page

async function fetchUsers(page = 1) {
  try {
    const res = await fetch(`/api/users/?page=${page}&limit=${limit}`);
    const data = await res.json();

    renderTable(data.users);
    renderPagination(data.totalPages, data.currentPage);
  } catch (err) {
    console.error("Greška pri preuzimanju korisnika:", err);
  }
}

function renderTable(users) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username || ""}</td>
      <td>${user.firstName || ""}</td>
      <td>${user.lastName || ""}</td>
      <td>${user.mail || ""}</td>
      <td>${user.healthInstitution?.name || "—"}</td>
      <td>✖</td>
      <td>${user.lastLogin ? formatDate(user.lastLogin) : "—"}</td>
      <td><button class="role-btn">Uloge</button></td>
      <td><button class="edit-btn" data-id="${user._id}">Uredi</button></td>
      <td>✔</td>
    `;

    tbody.appendChild(tr);
  });
}

function renderPagination(totalPages, currentPage) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const createButton = (text, page, isActive = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    if (isActive) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = page;
      fetchUsers(page);
    });
    return btn;
  };

  pagination.appendChild(createButton("«", Math.max(1, currentPage - 1)));

  for (let i = 1; i <= totalPages; i++) {
    if (i <= 3 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pagination.appendChild(createButton(i, i, i === currentPage));
    } else if (i === 4 || i === totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  pagination.appendChild(
    createButton("»", Math.min(totalPages, currentPage + 1))
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("sr-RS"); // Format: dd.mm.yyyy hh:mm:ss
}

document.getElementById("createUserBtn").addEventListener("click", () => {
  window.open("/kreiraj-korisnika", "_blank");
});

// Initial fetch
fetchUsers(currentPage);

const editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const userId = btn.getAttribute("data-id");

    if (userId) {
      window.open(`/uredi-korisnika/?id=${userId}`, "_blank");
    } else {
      alert("ID korisnika nije pronađen.");
    }
  });
});
