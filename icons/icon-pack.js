// icons.js
fetch('https://raw.githubusercontent.com/Byte-Craftsman-Alpha/aditya/main/icons.svg') // adjust path if needed
  .then(res => res.text())
  .then(data => {
    const div = document.createElement('svg');
    div.innerHTML = data;
    document.body.insertBefore(div, document.body.firstChild);
  });
