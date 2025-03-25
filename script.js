let countdownInterval;

function extractVideoId(url) {
    let videoId = null;
    
    if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }

    return videoId;
}

function startVideos() {
    let url = document.getElementById("videoUrl").value;
    let count = parseInt(document.getElementById("videoCount").value);
    let watchTime = parseInt(document.getElementById("watchTime").value) * 1000;
    let videosContainer = document.getElementById("videosContainer");
    let countdownElement = document.getElementById("countdown");

    let videoId = extractVideoId(url);

    if (!videoId) {
        alert("❌ الرجاء إدخال رابط فيديو يوتيوب صالح!");
        return;
    }
    
    videosContainer.innerHTML = ""; 

    let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;

    for (let i = 0; i < count; i++) {
        let iframe = document.createElement("iframe");
        iframe.src = embedUrl;
        iframe.allow = "autoplay; encrypted-media";
        iframe.width = "300";
        iframe.height = "170";
        videosContainer.appendChild(iframe);
    }

    // تشغيل العداد التنازلي
    startCountdown(watchTime / 1000);

    setTimeout(() => {
        videosContainer.innerHTML = "";
        startVideos();
    }, watchTime);
}

function stopVideos() {
    clearInterval(countdownInterval);
    document.getElementById("videosContainer").innerHTML = "";
    document.getElementById("countdown").textContent = "";
}

function startCountdown(seconds) {
    let countdownElement = document.getElementById("countdown");
    countdownElement.textContent = `إعادة التشغيل خلال: ${seconds} ثانية`;
    
    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            countdownElement.textContent = `إعادة التشغيل خلال: ${seconds} ثانية`;
        } else {
            clearInterval(countdownInterval);
            countdownElement.textContent = "";
        }
    }, 1000);
}
