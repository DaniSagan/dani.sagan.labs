import { Vec2 } from 'src/app/shared/math/vec2';

export interface LSystemOptions {
  axiom: string;
  rules: Readonly<Record<string, string>>;
  angle: number;
  iterations: number;
  canvasSize: number;
  startAngle?: number;
  margin?: number;
}

interface TurtleState {
  position: Vec2;
  angle: number;
}

function expandLSystem(
  axiom: string,
  rules: Readonly<Record<string, string>>,
  iterations: number,
): string {
  let commands = axiom;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    commands = Array.from(commands, (command) => rules[command] ?? command).join('');
  }

  return commands;
}

function traceLSystem(
  commands: string,
  turnAngle: number,
  startAngle: number,
): Array<Vec2 | null> {
  const tracedPoints: Array<Vec2 | null> = [];
  const turtleStack: TurtleState[] = [];
  let turtle: TurtleState = {
    position: new Vec2(0, 0),
    angle: startAngle,
  };

  tracedPoints.push(turtle.position);

  for (const command of commands) {
    if (command === 'F' || command === 'G' || command === 'A' || command === 'B') {
      const direction = new Vec2(Math.cos(turtle.angle), Math.sin(turtle.angle));
      turtle = {
        ...turtle,
        position: turtle.position.add(direction),
      };
      tracedPoints.push(turtle.position);
    } else if (command === 'f') {
      const direction = new Vec2(Math.cos(turtle.angle), Math.sin(turtle.angle));
      turtle = {
        ...turtle,
        position: turtle.position.add(direction),
      };
      tracedPoints.push(null, turtle.position);
    } else if (command === '+') {
      turtle = { ...turtle, angle: turtle.angle + turnAngle };
    } else if (command === '-') {
      turtle = { ...turtle, angle: turtle.angle - turnAngle };
    } else if (command === '[') {
      turtleStack.push({ position: turtle.position, angle: turtle.angle });
    } else if (command === ']') {
      const restoredState = turtleStack.pop();
      if (restoredState) {
        turtle = restoredState;
        tracedPoints.push(null, turtle.position);
      }
    }
  }

  return tracedPoints;
}

export function drawLSystem(
  context: CanvasRenderingContext2D,
  options: LSystemOptions,
): void {
  const commands = expandLSystem(options.axiom, options.rules, options.iterations);
  const tracedPoints = traceLSystem(
    commands,
    options.angle,
    options.startAngle ?? 0,
  );
  const visiblePoints = tracedPoints.filter((point): point is Vec2 => point !== null);
  const minimum = new Vec2(
    Math.min(...visiblePoints.map((point) => point.x)),
    Math.min(...visiblePoints.map((point) => point.y)),
  );
  const maximum = new Vec2(
    Math.max(...visiblePoints.map((point) => point.x)),
    Math.max(...visiblePoints.map((point) => point.y)),
  );
  const bounds = maximum.subtract(minimum);
  const margin = options.margin ?? 24;
  const availableSize = options.canvasSize - margin * 2;
  const scale = availableSize / Math.max(bounds.x, bounds.y, 1);
  const drawingSize = bounds.scale(scale);
  const origin = new Vec2(
    (options.canvasSize - drawingSize.x) / 2 - minimum.x * scale,
    (options.canvasSize - drawingSize.y) / 2 - minimum.y * scale,
  );

  context.beginPath();
  let startsNewPath = true;

  for (const point of tracedPoints) {
    if (!point) {
      startsNewPath = true;
      continue;
    }

    const canvasPoint = origin.add(point.scale(scale));
    if (startsNewPath) {
      context.moveTo(canvasPoint.x, canvasPoint.y);
      startsNewPath = false;
    } else {
      context.lineTo(canvasPoint.x, canvasPoint.y);
    }
  }

  context.stroke();
}
