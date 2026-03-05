
let localStream;
let peer;

const myIdEl = document.getElementById('my-id');
const statusEl = document.getElementById('status');

// 1. Initialize camera and peer connection
async function init() {
  try {
    // Get camera + mic access
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    // Show your own video in VR
    document.getElementById('localVideo').srcObject = localStream;
    setStatus('📡 Camera ready! Connecting...', '');

    // Create PeerJS connection
    peer = new Peer();

    peer.on('open', (id) => {
      myIdEl.textContent = id;
      setStatus('✅ Ready! Share your ID to connect.', 'connected');
    });

    // Answer incoming calls automatically
    peer.on('call', (call) => {
      call.answer(localStream);
      setStatus('📞 Incoming call! Connecting...', '');
      call.on('stream', (remoteStream) => {
        attachRemoteStream(remoteStream);
      });
    });

    peer.on('error', (err) => {
      setStatus('❌ Error: ' + err.type, 'error');
      console.error(err);
    });

  } catch (err) {
    setStatus('❌ Camera denied! Allow permissions.', 'error');
    console.error(err);
  }
}

// 2. Call another peer
function callPeer() {
  const peerId = document.getElementById('peer-input').value.trim();
  
  if (!peerId) {
    alert('Please enter your friend\'s Peer ID!');
    return;
  }

  setStatus('📞 Calling...', '');
  const call = peer.call(peerId, localStream);

  call.on('stream', (remoteStream) => {
    attachRemoteStream(remoteStream);
  });

  call.on('error', (err) => {
    setStatus('❌ Call failed! Try again.', 'error');
  });
}

// 3. Attach remote video into VR scene
function attachRemoteStream(stream) {
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = stream;
  setStatus('🎉 Connected! Look around in VR!', 'connected');
}

// 4. Update status text
function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
}

// Start everything
init();
```

---

