"use strict";

const config = {
    width: 240,
    height: 320,
    fps: 2,
}

const video = document.createElement("video");
video.autoplay = true;
const constraints = {
    video: {
        aspectRatio: { ideal: config.width / config.height },
        facingMode: {
            ideal: "environment"
        },
    },
    audio: false,
}
const media = navigator.mediaDevices.getUserMedia(constraints);
media.then((stream) => video.srcObject = stream);

const canvas = document.getElementById("previewScreen");
canvas.width = config.width;
canvas.height = config.height;
const context = canvas.getContext("2d");

const fullscreenButton = document.getElementById("fullscreenButton");
fullscreenButton.addEventListener("click", () => canvas.requestFullscreen());

const previewScreenUpdate = () => {
    if(video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    let sx, sy, sw, sh;
    if(w/h > config.width/config.height){
        sh = h;
        sy = (h - sh) / 2;
        sw = sh * config.width / config.height;
        sx = (w - sw) / 2;
    }else{
        sw = w;
        sx = (w - sw) / 2;
        sh = sw * config.height / config.width;
        sy = (h - sh) / 2;
    }
    context.drawImage(video, sx, sy, sw, sh, 0, 0, config.width, config.height);
    const imagedata = context.getImageData(0, 0, config.width, config.height);
    for(let i=0; i<imagedata.data.length; i+=1){
        if(i%4==0) continue;
        const t = imagedata.data[i];
        imagedata.data[i] = t >= 128 ? 255 : 0;
    }
    context.putImageData(imagedata, 0, 0);
}
setInterval(previewScreenUpdate, 1000/config.fps);
