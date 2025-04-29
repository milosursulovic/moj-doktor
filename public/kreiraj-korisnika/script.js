document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    // Collect form data
    const inputs = form.querySelectorAll("input, select");
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
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Успешно креиран корисник: " + result.userId);
        form.reset();
      } else {
        alert("Грешка: " + result.msg);
      }
    } catch (error) {
      alert("Дошло је до грешке: " + error.message);
    }
  });
});
