let localStream;
let peer;

const myIdEl = document.getElementById('my-id');
const statusEl = document.getElementById('status');

async function init() {
  try {
    setStatus('📡 Requesting camera...', '');

    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;
    localVideo.play();
    setStatus('✅ Camera working! Connecting...', 'connected');

    peer = new Peer(undefined, { debug: 2 });

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
    });

  } catch (err) {
    setStatus('❌ ' + err.name + ': ' + err.message, 'error');
    console.error('Camera error:', err);
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
