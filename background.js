let playerWindowId = null;
let playerTabId = null;

function sendMessage(action, videoId = null) {
  const message = { action }
  if (videoId) {
    message.videoId = videoId;
  }

  chrome.tabs.sendMessage(playerTabId, message, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error: ", chrome.runtime.error.lastError.message)
    }
  });

}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "load") {
        if (!playerWindowId) {
            chrome.windows.create({
                url: chrome.runtime.getURL("player.html") + "?v=" + msg.videoId,
                type: "popup",
                focused: false,
                width: 400,
                height: 300
            }, (win) => {
                if (chrome.runtime.lastError) {
                    console.error("Window creation error: ", chrome.runtime.lastError.message);
                    return;
                }
                
                playerWindowId = win.id;
                
                setTimeout(() => {
                    chrome.tabs.query({windowId: win.id}, (tabs) => {
                        if (chrome.runtime.lastError) {
                            console.error("Tab query error: ", chrome.runtime.lastError.message)
                            return;
                        }
                        if (tabs && tabs.length > 0) {
                            playerTabId = tabs[0].id;
                        }
                    })
                }, 1500)
            })
        } else if (playerTabId) {
            sendMessage("loadVid", msg.videoId)
        }
    } else if (msg.action === "playVideo" && playerWindowId) {
        sendMessage("playVid")
    } else if (msg.action === "pauseVideo" && playerWindowId) {
        sendMessage("pauseVid")
    } else if (msg.action === "stopVideo" && playerWindowId) {
        chrome.windows.remove(playerWindowId)
        playerWindowId = null;
        playerTabId = null;
    }

    sendResponse({ status: 'received, yay' })
    return true;

})

chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === playerWindowId) {
        playerWindowId = null;
        playerTabId = null;
    }
})
