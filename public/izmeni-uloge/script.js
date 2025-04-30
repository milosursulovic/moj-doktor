const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

async function loadUserRole() {
    try {
        const res = await fetch(`/api/users/${userId}`);
        const user = await res.json();

        if (!res.ok) throw new Error(user.msg || "Greška pri učitavanju korisnika");

        document.getElementById("username").textContent = user.username;
        document.getElementById("fullName").textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById("email").textContent = user.mail;

        const roleRadio = document.querySelector(`input[name="role"][value="${user.role}"]`);
        if (roleRadio) roleRadio.checked = true;
    } catch (error) {
        alert("Greška: " + error.message);
    }
}

loadUserRole();

document.getElementById("roleForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newRole = document.querySelector('input[name="role"]:checked')?.value;

    if (!newRole) {
        alert("Molimo odaberite rolu.");
        return;
    }

    try {
        const res = await fetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Uloga uspešno ažurirana!");
        } else {
            alert("Greška: " + data.msg);
        }
    } catch (error) {
        alert("Greška: " + error.message);
    }
});