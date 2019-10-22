let canvas = document.createElement("canvas");
let canvasContext = canvas.getContext("2d");

document.body.append(canvas);

let canvasOutput = document.createElement("canvas");
let canvasContextOutput = canvasOutput.getContext("2d");
document.body.append(canvasOutput);

function resetCanvas(image: HTMLImageElement) {
    let imageWidth = image.width;
    let imageHeight = image.height;

    // clear
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, imageWidth, imageHeight);
    // resize
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    canvasContext.drawImage(image, 0, 0, imageWidth, imageHeight);
}

function resetCanvasOutput(image: HTMLImageElement) {
    let imageWidth = image.width;
    let imageHeight = image.height;

    // clear
    canvasContextOutput.setTransform(1, 0, 0, 1, 0, 0);
    canvasContextOutput.clearRect(0, 0, imageWidth, imageHeight);
    // resize
    canvasOutput.width = imageWidth;
    canvasOutput.height = imageHeight;
}

function grayFilter(data) {
    for (let i = 0, len = data.length; i < len; i += 4) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

        //let gray = (r + g + b) / 3;
        //let gray =  r * 0.299 + g * 0.587 + b * 0.114;
        let gray = Math.max(r, g, b); // 效果最好
        //let gray = Math.min(r, g, b);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
}

function gammaFilter(data) {
    let threshold = 15;
    let gamma = ((threshold + 100) / 200) * 2;
    for (let i = 0, len = data.length; i < len; i += 4) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

        data[i] = Math.pow(r, gamma);
        data[i + 1] = Math.pow(g, gamma);
        data[i + 2] = Math.pow(b, gamma);
    }
}

function binaryFilter(data) {
    let type = "avg";
    let threshold: number;

    switch (type) {
        case "otsu":

            break;
        case "avg":
            let sum = 0;
            for(let i = 0, len = data.length; i < len; i += 4) {
                sum += data[i]
            }
            threshold = sum * 4 / data.length;
            break;
        case "ptile":
            break;
    }

    for(let i = 0, len = data.length; i < len; i += 4) {
        if (data[i] < threshold) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
        }
    }
}

function filter(data) {
    for (let i = 0, len = data.length; i < len; i += 4) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

        // 色值在250 - 256之间都认为是白色
        if ([r, g, b].every(v => v < 256 && v > 250)) {
            data[i + 3] = 0; // 把白色改成透明的
        } else {
            data[i] = 51;
            data[i + 1] = 51;
            data[i + 2] = 51;
        }
    }
}

function gathering() {
    let x, y, k, l, index, speed;
    let countF, countB, fx, fy, bx, by;

}

class eSignature {
    constructor(image: HTMLImageElement) {
        this.image = image;
    }

    /** 图片对象 */
    image: HTMLImageElement;

    /** 绘画 */
    static drawImage(image) {
        resetCanvas(image);
        resetCanvasOutput(image);
    }

    /** 处理图片 */
    static handleImage(image) {
        resetCanvas(image);
        resetCanvasOutput(image);

        let imageWidth = image.width;
        let imageHeight = image.height;
        let imageData = canvasContext.getImageData(0, 0, imageWidth, imageHeight);

        grayFilter(imageData.data);
        gammaFilter(imageData.data);
        //binaryFilter(imageData.data);
        filter(imageData.data);
        canvasContextOutput.putImageData(imageData, 0, 0);
    }



    /** 载入图片 */
    static loadImage(url, callback, error?) {
        let img = new Image();
        img.crossOrigin = "*";
        if (error) {
            img.onerror = function () {
                error();
                img.onload = img.onerror = null;
                img = null;
            }
        }

        img.src = url;
        if(img['readyState'] === "complete" || img.complete === true) {
            if( callback ) callback(img);
            img.onload = img.onerror = null;
            return;
        }

        img.onload = function() {
            callback(img);
            img.onload = img.onerror = null;
        }
    }
}