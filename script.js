    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent form from submitting the traditional way
      login();
    });

    function login() {
      const mobile = document.getElementById('mobile').value.trim();
      const password = document.getElementById('password').value.trim();
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '🔄 Validating...';

      if (!mobile || !password) {
        resultDiv.innerHTML = "<span class='error'>❗ Please enter both mobile number and password.</span>";
        return;
      }

      const oldScript = document.getElementById('jsonpScript');
      if (oldScript) oldScript.remove();

      window.handleResponse = function(response) {
        if (response.success && response.files && response.files.length > 0) {
          let listItems = response.files.map((file, index) => {
            const fileId = extractFileId(file.fileUrl);
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            return `
              <div class="download-item">
                <span class="file-name">
                  <span class="file-number">${index + 1}.</span> ${file.fileName}
                </span>
                <button class="download-btn" onclick="triggerDirectDownload('${downloadUrl}')">⬇️</button>
              </div>
            `;
          }).join('');

          resultDiv.innerHTML = `
            <span class="success">✅ Login successful! Download your files below:</span>
            <div class="download-list">${listItems}</div>
          `;
        } else {
          resultDiv.innerHTML = "<span class='error'>❌ Invalid mobile number or password.</span>";
        }
      };

      const script = document.createElement('script');
      script.id = 'jsonpScript';
      const baseUrl = 'https://script.google.com/macros/s/AKfycbwgs3NCh9afUu8edGBE8VwLALKMl78dDcfHEOAH8lPlPZDfUXfI8S9vm1fWcFrc2xBa/exec';
      script.src = `${baseUrl}?mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(password)}&callback=handleResponse`;
      script.onerror = () => {
        resultDiv.innerHTML = "<span class='error'>⚠️ Failed to connect to server. Please try again later.</span>";
      };
      document.body.appendChild(script);
    }

    function extractFileId(url) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : '';
    }

    function triggerDirectDownload(url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
