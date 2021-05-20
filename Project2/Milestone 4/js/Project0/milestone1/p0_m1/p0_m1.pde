int width = 800; //<>// //<>//
int height = 400;

// edge length of square to use for calculations
int squareSideWidth = 50;


void setup() {
  println(System.getProperty("java.version"));

  size(800, 400);
}

void draw() {

  background(255);

  int topRectX = (width / 2) - (squareSideWidth / 2);
  int topRectY = 0;

  int bottomRectX = 0;
  int bottomRectY = (height / 2) - (squareSideWidth / 2);

  stroke(0);
  line(topRectX + (squareSideWidth / 2), topRectY+ (squareSideWidth / 2), bottomRectX+ (squareSideWidth / 2), bottomRectY+ (squareSideWidth / 2));

  fill(255, 0, 0);
  rect(topRectX, topRectY, squareSideWidth, squareSideWidth);

  fill(0, 0, 255);
  rect(bottomRectX, bottomRectY, squareSideWidth, squareSideWidth);
}
