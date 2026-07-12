class C_Slides {
	constructor() {
		this.c_slide_objs = [];
		this._current = -1;

		this.c_timeline = undefined;

		this._dom = document.createElement("div");
		this._dom.classList.add("c_slides");
	}

	_update_timeline() {
		if (this.c_timeline != undefined)
			this.c_timeline.set_current_i_of_n(this._current, this.c_slide_objs.length);
	}

	add_slide_dom(inner_dom) {
		this.c_slide_objs.push(new C_Slide(this, this.c_slide_objs.length, inner_dom));
		this.set_current(0);
		this._dom.appendChild(this.c_slide_objs[this.c_slide_objs.length - 1].get_dom());
		this._update_timeline();
	}

	connect_timeline(c_timeline) {
		this.c_timeline = c_timeline;
		this._update_timeline();
	}

	get_dom() {
		return this._dom;
	}


	set_current(index) {
		var rm_class = (i, pclass) => { this.c_slide_objs[i].get_dom().classList.remove(pclass); this.c_slide_objs[i].get_dom().classList.add("c_slide_hidden"); };
		var add_class = (i, pclass) => { this.c_slide_objs[i].get_dom().classList.remove("c_slide_hidden"); this.c_slide_objs[i].get_dom().classList.add(pclass); };
		var rm_all_c = (i) => {
			var cl = this.c_slide_objs[i].get_dom().classList;
			cl.remove("c_slide_main");
			cl.remove("c_slide_left");
			cl.remove("c_slide_left_2");
			cl.remove("c_slide_right");
			cl.remove("c_slide_right_2");
			cl.add("c_slide_hidden");
		};
		var il = (ind) => (ind + slides_count) % slides_count;

		var slides_count = this.c_slide_objs.length;

		var jump_to = (i) => {
			var l = il(i - 1), l2 = il(i - 2),
				r = il(i + 1), r2 = il(i + 2);
			for (const j in this.c_slide_objs)
				rm_all_c(j);

			if (slides_count == 1) {
				add_class(i, "c_slide_main");
				return;
			}
			if (slides_count == 2) {
				add_class(i, "c_slide_main");
				if (i == 1)
					add_class(0, "c_slide_left");
				else
					add_class(1, "c_slide_right");
				return;
			}
			if (slides_count == 3) {
				add_class(i, "c_slide_main");
				add_class(l, "c_slide_left");
				add_class(r, "c_slide_right");
				return;
			}
			if (slides_count == 4) {
				add_class(i, "c_slide_main");
				add_class(l, "c_slide_left");
				add_class(r, "c_slide_right");
				add_class(r2, "c_slide_right_2");
				// TODO: check is adding cases for 4 slide needed.
				return;
			}
			add_class(i, "c_slide_main");
			add_class(l, "c_slide_left");
			add_class(l2, "c_slide_left_2");
			add_class(r, "c_slide_right");
			add_class(r2, "c_slide_right_2");
		};

		var cylce_current = (dir = 1) => {
			// right -> 1
			// left -> -1
			// works for +=6 elements
			if (slides_count < 6) return;
			var classes_t = ["c_slide_left_2", "c_slide_left", "c_slide_main", "c_slide_right", "c_slide_right_2"];
			var i = il(this._current + 2 * dir),
				j = 2 * (dir + 1);
			// max_i = il(this._current - 2 * dir),
			do {
				rm_class(i, classes_t[j]);
				add_class(il(i + dir), classes_t[j]);

				i = il(i - dir);
				j -= dir;
			} while (j != -1 && j != 5);
		}


		// actual logic
		index = il(index);
		if (slides_count != 0) {
			if ((0 <= index) && (index < slides_count)) {
				// jump_to(index);

				var dif = index - this._current;
				if (Math.abs(dif) != 1 || slides_count < 6)
					jump_to(index);
				else
					cylce_current(dif);
			}
		}

		this._current = index;
		this._update_timeline();
	}

	next() {
		this.set_current((this._current + 1) % this.c_slide_objs.length);
	}

	prev() {
		this.set_current((this._current - 1 + this.c_slide_objs.length) % this.c_slide_objs.length);
	}
}

class C_Slide {
	constructor(c_slides_obj, slide_index, slide_inner_dom) {
		this.c_slide = c_slides_obj;
		this.index = slide_index;
		this._inner_dom = slide_inner_dom;

		this._dom = document.createElement("div");
		this._dom.classList.add("c_slide");
		if (typeof(this._inner_dom) == "string") {
			this._dom.innerHTML = this._inner_dom;
		}else{
			this._dom.appendChild(this._inner_dom);
		}
	}

	get_dom() {
		return this._dom;
	}
}

class C_Controls {
	constructor(c_slides_obj) {
		this.c_slides = c_slides_obj;
		this.event_listeners = [];

		this._dom = {
			root: document.createElement("div"),
			right: document.createElement("div"),
			left: document.createElement("div")
		}

		this._dom.root.classList.add("c_controls");
		this._dom.right.classList.add("c_control_right");
		this._dom.left.classList.add("c_control_left");
		this._dom.root.appendChild(this._dom.right);
		this._dom.root.appendChild(this._dom.left);

		this._register_event_listeners();

		this._mouse = {
			start_side: undefined,
			start: { x: 0, y: 0 },
			end: { x: 0, y: 0 },
			threshold: Math.min(window.innerWidth, window.innerHeight) * 0.25
		};
		this._touch = {
			start_side: undefined,
			start: { x: 0, y: 0 },
			end: { x: 0, y: 0 },
			threshold: Math.min(window.innerWidth, window.innerHeight) * 0.35
		};
	}

	_next() {
		this.c_slides.next();
	}

	_prev() {
		this.c_slides.prev();
	}

	_event_parser(e) {
		if (e.code == "ArrowRight")
			this._next();
		else if (e.code == "ArrowLeft")
			this._prev();
	}

	_process_mouse_gesture() {
		if (this._mouse.start_side != undefined) {
			var dx = this._mouse.end.x - this._mouse.start.x, dy = this._mouse.end.y - this._mouse.start.y;
			var dist = Math.hypot(dx, dy), angle = Math.asin(dy / dist);
			const PI_6 = Math.PI / 6;
			console.log(dx, dy, angle, dist);

			if ((dist > this._mouse.threshold) && (-PI_6 < angle) && (angle < PI_6)) {
				if (dx < 0) {
					this._next();
				} else {
					this._prev();
				}
			}

			this._mouse.start_side = undefined;
		}
	}

	_process_touch_gesture() {
		if (this._touch.start_side != undefined) {
			var dx = this._touch.end.x - this._touch.start.x, dy = this._touch.end.y - this._touch.start.y;
			var dist = Math.hypot(dx, dy), angle = Math.asin(dy / dist);
			const PI_6 = Math.PI / 6;
			console.log(dx, dy, angle, dist);

			if ((dist > this._touch.threshold) && (-PI_6 < angle) && (angle < PI_6)) {
				if (dx < 0) {
					this._next();
				} else {
					this._prev();
				}
			}

			this._touch.start_side = undefined;
		}
	}

	_register_event_listeners() {
		addEventListener("keyup", this._event_parser.bind(this));
		this._dom.right.onclick = (e) => this._next();
		this._dom.left.onclick = (e) => this._prev();


		this._dom.right.addEventListener("mousedown", (e) => {
			this._mouse.start.x = e.screenX;
			this._mouse.start.y = e.screenY;
			this._mouse.start_side = "right";
		});
		this._dom.left.addEventListener("mousedown", (e) => {
			this._mouse.start.x = e.screenX;
			this._mouse.start.y = e.screenY;
			this._mouse.start_side = "left";
		});
		this._dom.root.addEventListener("mouseup", (e) => {
			this._mouse.end.x = e.screenX;
			this._mouse.end.y = e.screenY;
			this._process_mouse_gesture();
		});

		this._dom.right.addEventListener("touchstart", (e) => {
			this._touch.start.x = e.changedTouches[0].screenX;
			this._touch.start.y = e.changedTouches[0].screenY;
			this._touch.start_side = "right";
			console.log(e);

		});
		this._dom.left.addEventListener("touchstart", (e) => {
			this._touch.start.x = e.changedTouches[0].screenX;
			this._touch.start.y = e.changedTouches[0].screenY;
			this._touch.start_side = "left";
			console.log(e);

		});
		this._dom.root.addEventListener("touchend", (e) => {
			this._touch.end.x = e.changedTouches[0].screenX;
			this._touch.end.y = e.changedTouches[0].screenY;
			this._process_touch_gesture();
			console.log(e);

		});
	}

	get_dom() {
		return this._dom.root;
	}
}

class C_Timeline {
	constructor(c_slides_obj) {
		this.dots = [];
		this._dom = document.createElement("div");
		this._dom.classList.add("c_timeline");
		this._current = -1;
		this.last_n = 0;

		c_slides_obj.connect_timeline(this);
	}

	_recreate(new_n) {
		while (this.dots.length < new_n) {
			// creating new
			var dot = document.createElement("div");
			dot.classList.add("ct_dots");
			this.dots.push(dot);
			this._dom.appendChild(dot);
		}
		while (new_n > this.dots.length)
			this._dom.removeChild(this.dots.pop());

		if ((new_n - 1) < this._current) {
			this._current = -1;
		}
	}

	set_current_i_of_n(i, n) {
		if (!(n > 0)) return;

		if (n != this.last_n) {
			this._recreate(n);
			this.last_n = n;
		}

		if (this._current != -1)
			this.dots[this._current].classList.remove("checked");

		this._current = (i + n) % n;
		if (i != -1) {
			this.dots[this._current].classList.add("checked");
		}
	}

	get_dom() {
		return this._dom;
	}
}

class Carousel {
	constructor(parent_node, show_controls = true, show_timeline = true) {
		this.parent_node = parent_node;
		this.c_slides = new C_Slides();
		this.c_timeline = new C_Timeline(this.c_slides);
		this.c_controls = new C_Controls(this.c_slides);

		this.dom = {
			root: undefined,
			slides: undefined,
			controls: undefined,
			timeline: undefined
		}

		parent_node.appendChild(this._create_dom());
	}

	add_slide_dom(dom) {
		this.c_slides.add_slide_dom(dom);
	}

	_create_dom(force = false) {
		if (this.dom.root == undefined || force) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("carousel");

			this.dom.slides = this.c_slides.get_dom();
			this.dom.root.appendChild(this.dom.slides);

			if (this.c_controls != undefined) {
				this.dom.controls = this.c_controls.get_dom();
				this.dom.root.appendChild(this.dom.controls);
			}

			if (this.c_timeline != undefined) {
				this.dom.timeline = this.c_timeline.get_dom();
				this.dom.root.appendChild(this.dom.timeline);
			}
		}

		return this.dom.root;
	}
}

export default Carousel;