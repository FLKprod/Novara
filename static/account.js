document.addEventListener('DOMContentLoaded', function() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    document.getElementById('sessionId').value = sessionId;
});