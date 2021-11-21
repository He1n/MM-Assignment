let Specialist = document.getElementById("Specialist");
let ctx = Specialist.getContext("2d");
ctx.font = "20px Times New Roman";

const RADIUS = 20;
const TOKEN_RADIUS = 5;
const SIDE = 40;

//centerX la toa do truc x cua trung tam vat, tuong tu centerY
function drawPlace(centerX, centerY, label) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.textAlign = "center";
  if (centerY <= 75) ctx.fillText(label, centerX, centerY - 1.2 * RADIUS);
  else ctx.fillText(label, centerX, centerY + 1.7 * RADIUS);
}

//Ve mui ten tu vat co toa do trung tam (x1, y1) toi vat co toa do trung tam (x2, y2)
function drawArrow(centerX1, centerY1, centerX2, centerY2) {
  const HEAD_LENGTH = 10;
  const ARROW_ANGLE = Math.PI / 6;

  let fromX = centerX1 + RADIUS;
  let fromY = centerY1;
  let toX = centerX2 - RADIUS;
  let toY = centerY2;
  let angle = Math.atan2(toY - fromY, toX - fromX);

  //Line from one figure to another
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  //Draw head of arrow
  ctx.beginPath();
  ctx.moveTo(
    toX - HEAD_LENGTH * Math.cos(angle - ARROW_ANGLE),
    toY - HEAD_LENGTH * Math.sin(angle - ARROW_ANGLE)
  );
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - HEAD_LENGTH * Math.cos(angle + ARROW_ANGLE),
    toY - HEAD_LENGTH * Math.sin(angle + ARROW_ANGLE)
  );
  ctx.stroke();
}

function drawTransition(centerX, centerY, label) {
  ctx.beginPath();
  ctx.rect(centerX - SIDE / 2, centerY - SIDE / 2, SIDE, SIDE);
  ctx.stroke();
  ctx.textAlign = "center";
  if (centerY <= 75) ctx.fillText(label, centerX, centerY - 1.2 * RADIUS);
  else ctx.fillText(label, centerX, centerY + 1.7 * RADIUS);
}

//ve 1 token
function drawToken(centerX, centerY) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, TOKEN_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

function drawNhieuTokens(centerX, centerY, num) {
  //Xoa cac token trong figure hien tai
  ctx.clearRect(centerX - SIDE / 3, centerY - SIDE / 3, SIDE / 1.5, SIDE / 1.5);
  //Ve them vo
  if (num === 1) {
    drawToken(centerX, centerY);
  } else if (num == 2) {
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY);
  } else if (num === 3) {
    drawToken(centerX, centerY - TOKEN_RADIUS);
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY + TOKEN_RADIUS);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY + TOKEN_RADIUS);
  } else if (num === 4) {
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY - 1.5 * TOKEN_RADIUS);
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY + 1.5 * TOKEN_RADIUS);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY - 1.5 * TOKEN_RADIUS);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY + 1.5 * TOKEN_RADIUS);
  } else {
    ctx.textAlign = "center";
    ctx.fillText(num, centerX, centerY + 5);
  }
}

class Figure {
  constructor(type, centerX, centerY, numTokens = 0) {
    this.type = type;
    this.centerX = centerX;
    this.centerY = centerY;
    this.numTokens = numTokens;
    this.inputs = [];
    this.outputs = [];
  }
  addInput(newObject) {
    this.inputs.push(newObject);
  }
  addOutput(newObject) {
    this.outputs.push(newObject);
  }
}

//Assign value for each object Specialist
const free = new Figure("place", 100, 75, 4);
const busy = new Figure("place", 200, 175);
const docu = new Figure("place", 300, 75);
const start = new Figure("transition", 100, 175);
const change = new Figure("transition", 300, 175);
const end = new Figure("transition", 200, 75);

start.addInput(free);
start.addOutput(busy);
change.addInput(busy);
change.addOutput(docu);
end.addInput(docu);
end.addOutput(free);

function drawSpecialist() {
  drawPlace(free.centerX, free.centerY, "free");
  drawPlace(busy.centerX, busy.centerY, "busy");
  drawPlace(docu.centerX, docu.centerY, "docu");

  drawNhieuTokens(free.centerX, free.centerY, free.numTokens);
  drawNhieuTokens(busy.centerX, busy.centerY, busy.numTokens);
  drawNhieuTokens(docu.centerX, docu.centerY, docu.numTokens);

  drawTransition(start.centerX, start.centerY, "start");
  drawTransition(change.centerX, change.centerY, "change");
  drawTransition(end.centerX, end.centerY, "end");

  drawArrow(
    free.centerX - RADIUS,
    free.centerY + RADIUS,
    start.centerX + RADIUS,
    start.centerY - RADIUS
  );
  drawArrow(start.centerX, start.centerY, busy.centerX, busy.centerY);
  drawArrow(busy.centerX, busy.centerY, change.centerX, change.centerY);
  drawArrow(
    change.centerX - RADIUS,
    change.centerY - RADIUS,
    docu.centerX + RADIUS,
    docu.centerY + RADIUS
  );
  drawArrow(
    docu.centerX - 2 * RADIUS,
    docu.centerY,
    end.centerX + 2 * RADIUS,
    end.centerY
  );
  drawArrow(
    end.centerX - 2 * RADIUS,
    end.centerY,
    free.centerX + 2 * RADIUS,
    free.centerY
  );
}
drawSpecialist(); //Goi ham ve net Specialist

const btn = document.querySelector("#btn");
btn.addEventListener("click", function (event) {
  let freeInput = parseInt(document.getElementById("free").value);
  let busyInput = parseInt(document.getElementById("busy").value);
  let docuInput = parseInt(document.getElementById("docu").value);

  if (freeInput >= 0 && busyInput >= 0 && docuInput >= 0) {
    free.numTokens = freeInput;
    busy.numTokens = busyInput;
    docu.numTokens = docuInput;
  }
  drawSpecialist();
});

let transitions = [start, change, end];

// Firing transition
// khi click chuot vao petri net
Specialist.addEventListener("click", function (event) {
  //Toa do cua tro chuot trong canvas
  let x = event.offsetX;
  let y = event.offsetY;
  transitions.forEach(function (transition) {
    if (
      //Dieu kien tinh toa do cua tung transition theo tro chuot
      x > transition.centerX - SIDE / 2 &&
      x < transition.centerX + SIDE / 2 &&
      y > transition.centerY - SIDE / 2 &&
      y < transition.centerY + SIDE / 2
    ) {
      //Moi lan click transition, tung output cong 1 va update drawNhieuTokens
      for (output of transition.outputs) {
        if (
          //Neu 1 trong cac input cua transition la 0 thi cac output ko cong them
          transition.inputs.some(function (element) {
            return element.numTokens > 0;
          })
        ) {
          ++output.numTokens;
          drawNhieuTokens(output.centerX, output.centerY, output.numTokens);
        }
      }
      //Moi lan click transition, tung input tru 1 va update drawNhieuuTokens
      for (input of transition.inputs) {
        if (input.numTokens > 0) {
          --input.numTokens;
          drawNhieuTokens(input.centerX, input.centerY, input.numTokens);
        }
      }
    }
  });
});

//Change cursor to pointer on transitions
Specialist.addEventListener("mousemove", function (event) {
  let x = event.offsetX;
  let y = event.offsetY;
  if (
    transitions.some(function (transition) {
      return (
        x > transition.centerX - SIDE / 2 &&
        x < transition.centerX + SIDE / 2 &&
        y > transition.centerY - SIDE / 2 &&
        y < transition.centerY + SIDE / 2
      );
    })
  )
    Specialist.style.cursor = "pointer";
  else Specialist.style.cursor = "default";
});
