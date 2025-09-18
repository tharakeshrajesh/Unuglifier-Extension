const statusDiv = document.getElementById("status")

function updateStatus(status) {
  statusDiv.textContent = status;
}

function sendMessage(action, videoId = null) {
  const message = { action }
  if (videoId) {
    message.videoId = videoId;
  }

  updateStatus(`Sending ${action}...`);

  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      updateStatus(`Error: ${chrome.runtime.lastError.message}`);
    }
  });

}

document.getElementById("start").addEventListener("click", () => {
  const vidId = document.getElementById("vidId").value || "xvFZjo5PgG0";
  updateStatus(`Loading video: ${vidId}`);
  sendMessage("load", vidId);
});

document.getElementById("play").addEventListener("click", () => {
  sendMessage("playVideo");
});

document.getElementById("pause").addEventListener("click", () => {
  sendMessage("pauseVideo")
});

document.getElementById("stop").addEventListener("click", () => {
  sendMessage("stopVideo")
});

document.addEventListener('DOMContentLoaded', function() {
    updateStatus("Ready - Enter a YouTube video ID");
});
