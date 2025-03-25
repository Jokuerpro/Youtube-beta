const API_KEY = "AIzaSyCZ7QD3305A8Yii4N7MTDbhMArIMFMHibY"; // ضع مفتاح API هنا
let videoIds = [];
let countdownInterval;

async function fetchVideos() {
    let username = document.getElementById("channelUrl").value;
    
    // تحقق من إدخال اسم المستخدم
    if (!username) {
        alert("❌ الرجاء إدخال اسم المستخدم!");
        return;
    }

    let apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${username}&key=${API_KEY}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        // تحقق من وجود القناة
        if (!data.items || data.items.length === 0) {
            alert("❌ لم يتم العثور على قناة بهذا الاسم!");
            return;
        }

        let playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
        let videosApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`;

        let videosResponse = await fetch(videosApiUrl);
        let videosData = await videosResponse.json();

        videoIds = videosData.items.map(item => item.snippet.resourceId.videoId).filter(id => id);
        
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
