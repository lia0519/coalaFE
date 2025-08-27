import { toDegrees, toRadians } from './utils';

export default class Vector {
  constructor(x, y) { this.x = x; this.y = y; }
  scaleBy(n) { return new Vector(this.x * n, this.y * n); }
  length() { return Math.hypot(this.x, this.y); }
  add({ x, y }) { return new Vector(this.x + x, this.y + y); }
  subtract({ x, y }) { return new Vector(this.x - x, this.y - y); }
  normalize() { return this.scaleBy(1 / this.length()); }
  dotProduct({ x, y }) { return this.x * x + this.y * y; }
  crossProduct({ x, y }) { return this.x * y - x * this.y; }
  projectOn(other) { const amt = this.dotProduct(other) / other.length(); return new Vector(amt * other.x, amt * other.y); }
  reflect(normal) { return this.subtract(this.projectOn(normal).scaleBy(2)); }
  rotate(deg) {
    const rad = toRadians(deg), cos = Math.cos(rad), sin = Math.sin(rad);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
  angleBetween(other) { return toDegrees(Math.atan2(this.crossProduct(other), this.dotProduct(other))); }
}
