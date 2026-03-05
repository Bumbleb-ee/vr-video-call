let localStream;
let peer;

const myIdEl = document.getElementById('my-id');
const statusEl = document.getElementById('status');

async function init() {
  try {
    setStatus('📡 Requesting camera...', '');

    // Try simple video first
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false  // audio off first to test
    });

    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;
    
    // Force play
    localVideo.onloadedmetadata = () => {
      localVideo.play();
      setStatus('✅ Camera working! Connecting...', 'connected');
    };

    // Setup peer
    peer = new Peer(undefined, {
      debug: 2
    });

    peer.on('open', (id) => {
      myIdEl.textContent = id;
      setStatus('✅ Ready! Share your ID.', 'connected');
    });

    peer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (remoteStream) => {
        attachRemoteStream(remoteStream);
      });
    });

    peer.on('error', (err) => {
      setStatus('❌ Peer error: ' + err.type, 'error');
      console.error('Peer error:', err);
    });

  } catch (err) {
    console.error('Full error:', err);
    setStatus('❌ ' + err.name + ': ' + err.message, 'error');
  }
}

function callPeer() {
  const peerId = document.getElementById('peer-input').value.trim();
  if (!peerId) {
    alert('Enter Peer ID!');
    return;
  }
  const call = peer.call(peerId, localStream);
  call.on('stream', (remoteStream) => {
    attachRemoteStream(remoteStream);
  });
}

function attachRemoteStream(stream) {
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = stream;
  remoteVideo.play();
  setStatus('🎉 Connected!', 'connected');
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
}

init();
```

---

### After updating:
```
1. Commit the file on GitHub
2. Wait 1 minute
3. Hard refresh: Ctrl+Shift+R
4. Check what status message shows now!