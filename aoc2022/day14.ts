import fs from "fs";
const text = fs.readFileSync(__dirname + "/input14.txt", "utf8");

const input = text.split("\n");

const map = Array(160)
	.fill([])
	.map((a) => ".".repeat(700).split(""));

const line = (x1: number, y1: number, x2: number, y2: number) => {
	let dx = Math.abs(x2 - x1);
	let dy = Math.abs(y2 - y1);
	const mx = Math.max(x1, x2);
	const my = Math.max(y1, y2);
	while (dx--) map[my - dy][mx - dx] = "#";
	while (dy-- + 1) map[my - dy - 1][mx - dx] = "#";
};

let maxy = 0;
input.forEach((v) => {
	const coords = v.split(" -> ").map((a) => a.split(","));
	for (let i = 0; i < coords.length - 1; i++) {
		let l = coords[i];
		let n = coords[i + 1];
		line(+l[0], +l[1], +n[0], +n[1]);
		maxy = Math.max(maxy, +l[1], +n[1]);
	}
});

line(0, maxy + 2, 700, maxy + 2); //comment this for part 1
map[0][500] = "+";

const checkCoord = (x: number, y: number) =>
	map[y][x] != "#" && map[y][x] != "o";

const sand = (n: number) => {
	for (let i = 0; i < n; i++) {
		let abyss = 0;
		let coord = { x: 501, y: 0 };
		while (abyss++ < 159) {
			if (checkCoord(coord.x, ++coord.y)) continue;
			if (checkCoord(--coord.x, coord.y)) continue;
			if (checkCoord((coord.x += 2), coord.y)) continue;
			map[--coord.y][--coord.x] = "o";
			break;
		}
		if (coord.y == 0 || abyss == 160) return false;
	}
	return true;
};

let i = 0;
while (sand(1)) i++;
console.log(i);
console.log("(add 1 if part 2)")

fs.writeFileSync(__dirname + "/out14.txt", map.map((a) => a.join("")).join("\n"));
