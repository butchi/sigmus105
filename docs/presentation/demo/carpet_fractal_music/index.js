"use strict";
var table = new Array();

var tblWidth = 4;
var tblHeight = 4;
var nest = 5;
var width = Math.pow(tblWidth, nest);
var height = Math.pow(tblHeight, nest);
var dispH = 100;

var fractalArr = new Array(width);

var canvas = document.getElementById('fractalImg');
var ctx = canvas.getContext('2d');
var imageData = ctx.createImageData(width, height);

var inputArr = document.querySelectorAll('.generator');

var SAMPLING_RATE = 8192;
var DURATION = (width * height) / SAMPLING_RATE;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var src;
var buffer;
var channel;

var intv = 100; // スキャンの更新間隔（ミリ秒）
var scanTimer; // スキャン線表示用タイマー
var scanLine = document.getElementById('scanLine');
var scanCur = 0; // スキャンの進捗（0〜1）

init();

function init() {

    var i;
    var len = inputArr.length;
    for(i = 0; i < len; i++) {
        inputArr[i].onclick = function() {
            generateTable(readTable());
            generateFractal();
            generateImage();
        }
    }

    for(i = 0; i < height; i++) {
        fractalArr[i] = new Array(width);
    }

    document.getElementById('playBtn').onclick = function() {
        if(src) {
            src.stop();
        }
        generateTable(readTable());
        generateFractal();
        generateImage();

        stopScan();
        play();
    };

    document.getElementById('stopBtn').onclick = function() {
        if(src) {
            src.stop();
        }
        stopScan();
    };

    writeTable([
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
    ]);
    generateTable(readTable());
    generateFractal();
    generateImage();
}

/*
 *  チェックボックスから値を拾う
 */
function readTable(arr) {
    var arr = new Array();
    var i, j;
    for(j=0; j<tblHeight; j++) {
        arr[j] = new Array();
        for(i=0; i<tblWidth; i++) {
            arr[j][i] = (inputArr[j * tblWidth + i].checked) ? 1 : 0;
        }
    }

    return arr;
}

/*
 *  チェックボックスに値を渡す
 */
function writeTable(arr) {
    var i, j;
    for(j=0; j<tblHeight; j++) {
        for(i=0; i<tblWidth; i++) {
            inputArr[j * tblWidth + i].checked = arr[j][i];
        }
    }
}

/*
 *  初期テーブルを作る
 */
function generateTable(arr) {
    var i, j;
    for(j=0; j<tblHeight; j++) {
        table[j] = new Array();
        for(i=0; i<tblWidth; i++) {
            table[j][i] = arr[j][i];
        }
    }
}

/*
 *  フラクタルを作る
 */
function generateFractal() {
    var i, j, n;
    for(j=0; j<height; j++) {
        for(i=0; i<width; i++) {
            fractalArr[j][i] = 1;
            for(n=0; n<nest; n++) {
                fractalArr[j][i] *= nest*table[(Math.floor(j/Math.pow(tblHeight, n)))%tblHeight][(Math.floor(i/Math.pow(tblWidth, n)))%tblWidth];
            }
        }
    }
}

/*
 *  画像を作る
 */
function generateImage() {
    var i, j, n;
    for(j=0; j<height; j++) {
        for(i=0; i<width; i++) {
            imageData.data[(j*width + i)*4 + 3] = (fractalArr[j][i]) ? 255 : 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function play(){
    var t, v;

    src = audioCtx.createBufferSource();
    src.connect(audioCtx.destination);

    audioCtx.samplingRate = SAMPLING_RATE;

    buffer = audioCtx.createBuffer(1, DURATION * SAMPLING_RATE, SAMPLING_RATE);
    channel = buffer.getChannelData(0);

    for(t = 0; t < channel.length; t++){
        channel[t] = fractalArr[Math.floor(t / width)][t % width] ? 1 : 0;
    }

    src.buffer = buffer;
    src.start(0);

    startScan();
}

function startScan() {
    scanCur = 0;
    scanTimer =  window.setInterval(function() {
        scanCur += intv;
        scanLine.style.top = (scanCur / DURATION / 1000 * dispH + 'px');
        if(scanCur >= DURATION * 1000) {
            stopScan();
        }
    }, intv);
}

function stopScan() {
    window.clearInterval(scanTimer);
    scanCur = 0;
    scanLine.style.top = (0 + 'px');
}
