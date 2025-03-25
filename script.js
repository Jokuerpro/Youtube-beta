const API_KEY = "AIzaSyCZ7QD3305A8Yii4N7MTDbhMArIMFMHibY"; // ضع مفتاح API هنا
let videoIds = [];
let countdownInterval;

function extractChannelId(channelUrl) {
    let channelId = null;
    if (channelUrl.includes("youtube.com/channel/")) {
        channelId = channelUrl.split("channel/")[1]?.split("?")[0];
    } else if (channelUrl.includes("youtube.com/@")) {
        channelId = channelUrl.split("@")[1]?.split("?")[0];
    }
    return channelId;
}

async function fetchVideos() {
    let channelUrl = document.getElementById("channelUrl").value;
    let channelId = extractChannelId(channelUrl);

    if (!channelId) {
        alert("❌ الرجاء إدخال رابط قناة صالح!");
        return;
    }

    let apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        videoIds = data.items.map(item => item.id.videoId).filter(id => id);
        
        if (videoIds.length === 0) {
            alert("❌ لم يتم العثور على فيديوهات في القناة!");
        } else {
            alert(`✅ تم جلب ${videoIds.length} فيديو من القناة!`);
        }
    } catch (error) {
        console.error("خطأ في جلب الفيديوهات:", error);
        alert("❌ حدث خطأ أثناء جلب الفيديوهات.");
    }
}

function startRandomVideos() {
    if (videoIds.length === 0) {
        alert("❌ يرجى جلب الفيديوهات أولاً!");
        return;
    }

    let watchTime = parseInt(document.getElementById("watchTime").value) * 1000;
    let videosContainer = document.getElementById("videosContainer");

    videosContainer.innerHTML = "";

    let randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];
    let embedUrl = `https://www.youtube.com/embed/${randomVideoId}?autoplay=1&mute=1&loop=1&playlist=${randomVideoId}&controls=0`;

    let iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.allow = "autoplay; encrypted-media";
    iframe.width = "300";
    iframe.height = "170";
    videosContainer.appendChild(iframe);

    startCountdown(watchTime / 1000);

    setTimeout(() => {
        startRandomVideos(); // تشغيل فيديو جديد بعد انتهاء المدة
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
