import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from "fs";
const text = fs.readFileSync(__dirname + "/input15.txt", "utf8");

const begin = performance.now();

const [testinput, input] = text.split("\r\n\r\n").map((a) => a.split("\r\n"));

const sensors = input.map((a) => {
	const coord = [...a.matchAll(/(?:x=|y=)(-?\d+)/g)].map((c) => +c[1]);
	return {
		x: coord[0],
		y: coord[1],
		bx: coord[2],
		by: coord[3],
		dy: Math.abs(coord[1] - coord[3]),
		dx: Math.abs(coord[0] - coord[2]),
	};
});

const howManyBlocked = (
	n: number,
	maxx: number = Infinity,
	minx: number = -Infinity,
	find_free: boolean = false
) => {
	const beacons = new Set(); //keep track of any beacons along the way
	const arr: number[][] = []; //store a range of the x values each signal blocks
	sensors.forEach((k) => {
		const ydist = Math.abs(n - k.y);
		const onrow = (k.dx + k.dy) * 2 + 1 - ydist * 2;
		if (onrow <= 0) return; //has no effect on row
		const firstx = k.x - (k.dx + k.dy - ydist);
		if (k.by == n && k.bx >= firstx && k.bx <= firstx + onrow)
			beacons.add(k.bx);
		arr.push([
			Math.min(Math.max(firstx, minx), maxx),
			Math.max(Math.min(firstx + onrow, maxx), minx),
		]);
	});

	//add up the ranges
	arr.sort((a, b) => a[0] - b[0]);
	const free_candidates: number[][] = [];
	let count = 0,
		relativelower = -Infinity,
		relativeupper = -Infinity;
	for (let p of arr) {
		const [rangelower, rangeupper] = p;
		if (rangelower <= relativeupper) {
			if (rangeupper < relativeupper) continue;
			else relativelower = relativeupper;
		} else {
			free_candidates.push([
				Math.min(Math.max(relativelower, minx)),
				Math.max(Math.min(rangelower - 1, maxx), minx),
			]);
			relativelower = rangelower;
		}
		relativeupper = rangeupper;
		count += relativeupper - relativelower;
	}

	//Search for available x-values
	free_candidates.shift();
	const truly_free: number[] = [];
	if (find_free) {
		free_candidates.forEach((test) => {
			outer: for (let u = test[0]; u <= test[1]; u++) {
				for (let range of arr)
					if (u >= range[0] && u < range[1]) continue outer;
				truly_free.push(u);
			}
		});
	}

	return {
		blocked: count,
		beacons: beacons.size,
		free: truly_free,
	};
};

const row = howManyBlocked(2_000_000);
console.log(row.blocked - row.beacons); //part1

const limit = 4_000_000;
const [MAXX, MAXY] = [limit, limit];

for (let i = 0; i < MAXY; i++) {
	const data = howManyBlocked(i, MAXX, 0, true);
	if (data.blocked != limit) {
		const free = data.free;
		console.log(free[0], i, "frequency: " + (i + free[0] * 4_000_000));
		break;
	}
}
console.log(Math.round(performance.now() - begin) + "ms");
