window.addEventListener('load', () => {
  const formData = {
    name: "Soumya Ranjan Maharana",
    email: "soumya.r.maharana@gmail.com",
    phone: "206-427-9712"
  };

  const fillField = (selectors, value) => {
    selectors.forEach(sel => {
      const field = document.querySelector(sel);
      if (field) field.value = value;
    });
  };

  fillField(['input[name="name"]', 'input[id*="name"]'], formData.name);
  fillField(['input[name="_systemfield_name"]', 'input[id*="_systemfield_name"]'], formData.name);
  fillField(['input[name="email"]', 'input[id*="email"]'], formData.email);
  fillField(['input[name="_systemfield_email"]', 'input[id*="_systemfield_email"]'], formData.email);
  fillField(['input[name="phone"]', 'input[id*="phone"]'], formData.phone);
});

