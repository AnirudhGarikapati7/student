document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('signupForm').addEventListener('submit', signupUser);

async function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function signupUser(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.msg);

    if (data.msg === 'User registered') {
      window.location.href = './index.html';
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
}

if (document.getElementById('logout')) {
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './index.html';
  });
}

// For dashboard.html
if (window.location.pathname === '/dashboard.html') {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = './index.html';
  } else {
    fetch('/api/dashboard', {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('weather').innerText = JSON.stringify(data.weatherData, null, 2);
    })
    .catch(error => {
      console.error('Dashboard error:', error);
      window.location.href = './index.html';
    });
  }
}
