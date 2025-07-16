document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  loginFetch();
});

function loginFetch() {
  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '🔄 Validating...';

  if (!mobile || !password) {
    resultDiv.innerHTML = "<span class='error'>❗ Please enter both mobile number and password.</span>";
    return;
  }

  const baseUrl = 'https://script.google.com/macros/s/AKfycbxhPiQ5R-ZPeySsYhs8h7ZMPzWX7fuDKeBoCl-hy_vqbi1ymhxWRTahUTLIJikzuGaD/exec';
  const url = `${baseUrl}?mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (data.success && data.files && data.files.length > 0) {
        const listItems = data.files.map((file, index) => {
          const fileId = extractFileId(file.fileUrl);
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          return `
            <div class="download-item" style="display:flex; justify-content:space-between; align-items:center; padding: 0.5rem; border-bottom: 1px solid #ccc;">
              <span class="file-name" style="font-weight: 500;">
                <span class="file-number" style="margin-right: 8px;">${index + 1}.</span> ${file.fileName}
              </span>
              <button class="download-btn" style="cursor:pointer; background:#007BFF; color:#fff; border:none; border-radius:4px; padding:6px 10px;" onclick="triggerDirectDownload('${downloadUrl}')" title="Download ${file.fileName}"> ⇩ Download</button>
            </div>
          `;
        }).join('');
        resultDiv.innerHTML = `
          <span class="success" style="color:green; font-weight:bold;">✅ Login successful! Download your files below:</span>
          <div class="download-list" style="margin-top: 1rem;">${listItems}</div>
        `;
      } else {
        resultDiv.innerHTML = "<span class='error' style='color:red;'>❌ Invalid mobile number or password.</span>";
      }
    })
    .catch(() => {
      resultDiv.innerHTML = "<span class='error' style='color:red;'>⚠️ Failed to connect to server. Please try again later.</span>";
    });
}

function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

function triggerDirectDownload(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = ''; // try to trigger download
  a.target = '_blank'; // support mobile behavior
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
