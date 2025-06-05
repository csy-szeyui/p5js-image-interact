let handPose;
let faceMesh;
let options = { maxFaces: 7, refineLandmarks: false, flipped: false };
let video;
let hands = [];
let vpress = false;
let reset = true;
let zpress = false;
let ppress = false;
let faces = [];

function preload() {
  handPose = ml5.handPose({ flipped: true });
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(470, 710);
  img = loadImage("data/img5.png");
  video = createCapture(VIDEO, { flipped: true });
  video.size(470, 350);
  video.hide();
  handPose.detectStart(video, gotHands);
  faceMesh.detectStart(img, gotFaces);
}

function gotHands(results) {
  hands = results;
}

function keyPressed() {
  //view
  if (key === "v") {
    console.log("v");
    vpress = true;
    reset = false;
    zpress = false;
    ppress = false;
  }
  //zoom
  if (key === "z") {
    console.log("z");
    zpress = true;
    reset = false;
    vpress = false;
    ppress = false;
  }
  //reset
  if (key === "e") {
    console.log("e");
    reset = true;
    vpress = false;
    zpress = false;
    ppress = false;
  }
  //person
  if (key === "p") {
    console.log("p");
    ppress = true;
    vpress = false;
    zpress = false;
    reset = false;
  }
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background(220);
  image(img, 0, 0, 470, 350);

  if (vpress) {
    push();
    filter(BLUR, 5);
    pop();
  }

  image(video, 0, 360);
  

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[0];
    if (hand.confidence > 0.5) {
      let keypoint = hand.keypoints[8];
      let thumbpoint = hand.keypoints[4];

      if (vpress) {
        noFill();
        stroke(0, 255, 255);
        strokeWeight(4);
        rect(keypoint.x - 30, keypoint.y - 30, 60, 60);
        image(
          img,
          keypoint.x - 30,
          keypoint.y - 30,
          60,
          60,
          keypoint.x - 30,
          keypoint.y - 30,
          60,
          60
        );
      }
      noStroke();
      fill(0, 255, 255);

      if (zpress) {
        let dis = dist(keypoint.x, keypoint.y, thumbpoint.x, thumbpoint.y);
        let zoom = map(dis, 30, 250, 2, 0.25);

        let midx = (keypoint.x + thumbpoint.x) * 0.5;
        let midy = (keypoint.y + thumbpoint.y) * 0.5;
        let zwidth = 333 * zoom;
        let zheight = 250 * zoom;

        let zoomx = constrain(midx - zwidth / 2, 0, 470 - zwidth);
        let zoomy = constrain(midy - zheight / 2, 0, 350 - zheight);

        image(img, 0, 0, 470, 350, zoomx, zoomy, zwidth, zheight);

        circle(thumbpoint.x, thumbpoint.y, 10);
        let thy = thumbpoint.y + 360;
        circle(thumbpoint.x, thy, 10);
      }

      let scalee = 1;
      for (let i = 0; i < faces.length; i++) {
        let box = faces[i].box;

        if (
          keypoint.x >= box.xMin &&
          box.xMin + box.width >= keypoint.x &&
          keypoint.y >= box.yMin &&
          box.yMin + box.height >= keypoint.y
        ) {
          scalee = 1.4;
        }

        if (ppress) {
          let pwidth = box.width * scalee;
          let pheight = box.height * scalee;

          let px = box.xMin + (box.width - pwidth) / 2;
          let py = box.yMin + (box.height - pheight) / 2;

          image(
            img,
            px,
            py,
            pwidth,
            pheight,
            box.xMin,
            box.yMin,
            box.width,
            box.height
          );
        }
      }
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
      let y = keypoint.y + 360;
      circle(keypoint.x, y, 10);
    }
  }
}
