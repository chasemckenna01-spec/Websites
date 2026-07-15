document.getElementById('cta').addEventListener('click', () => {
  const messages = [
    'Hello from JavaScript! 👋',
    'You clicked the button!',
    'Everything is wired up correctly.',
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  alert(msg);
});
