function showSection(sectionName) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionName).classList.add('active');

  if (sectionName === 'products') {
    loadProducts();
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--green-emerald);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

window.onclick = function (event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    closeCart();
  }
};

document.addEventListener('DOMContentLoaded', function () {
  loadProducts();
  updateCartCount();
  updateAuthUI();
});

