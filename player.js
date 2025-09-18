let player;

document.addEventListener('DOMContentLoaded', function() {
    player = document.getElementById("yt-player");
    const urlParams = new URLSearchParams(window.location.search);
    const initialVideoId = urlParams.get('v') || "xvFZjo5PgG0";

    loadVideo(initialVideoId)
})

function loadVideo(vidId) {
    if (player) {
        player.src = `https://www.youtube-nocookie.com/embed/${vidId}?autoplay=1&enablejsapi=1`
    }
}

function pauseVideo() {
    if (player && player.contentWindow) {
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', 'https://www.youtube-nocookie.com')
    }
}

function playVideo() {
    if (player && player.contentWindow) {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', 'https://www.youtube-nocookie.com')
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    try {
        if (msg.action === "loadVid") {
            loadVideo(msg.videoId || "xvFZjo5PgG0")
            sendResponse({ status: "video loaded" })
        } else if (msg.action === "pauseVid") {
            pauseVideo()
            sendResponse({ status: "pause attempted" })
        } else if (msg.action === "playVid") {
            playVideo()
            sendResponse({ status: "play attemted" })
        }
    } catch (err) {
        sendResponse({ status: "error", error: err.message })
    }

    return true;
});

window.addEventListener('message', function(event) {
    if (event.origin === 'https://www.youtube-nocookie.com') {
        console.log('YouTube player message:', event.data);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM loaded, initializing player");
    });
} else {
    console.log("DOM already loaded");
}
