import { Carousel } from "./carousel.js";

class PageVideo {
	constructor(page, video_url, fallback_video) {
		this.page = page;
		this.video_url = video_url;
		this.fallback_video = fallback_video;

		this.dom = {
			root: undefined,
			video: undefined,
			video_src_1: undefined,
			video_src_2: undefined
		};
	}

	get_dom(force_recreate) {
		if (force_recreate || (this.dom.root == undefined)) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_video_container");
			this.dom.root.id = `p${this.page.index}_video`;

			this.dom.video = document.createElement("video");
			this.dom.root.appendChild(this.dom.video);
			this.dom.video.autoplay = false;
			this.dom.video.controls = true;
			this.dom.video.loading = "lazy";


			this.dom.video_src_1 = document.createElement("source");
			this.dom.video.appendChild(this.dom.video_src_1);

			this.dom.video_src_2 = document.createElement("source");
			this.dom.video.appendChild(this.dom.video_src_2);
		}

		this.update()
		return this.dom.root;
	}

	update() {
		if (this.dom.root != undefined) {
			this.dom.video_src_1.src = this.video_url;
			this.dom.video_src_2.src = this.fallback_video;
		}
	}
}

class PageDescription {
	constructor(page, text) {
		this.page = page;
		this.text = text;

		this.dom = {
			root: undefined,
			p: undefined
		};
	}

	get_dom(force_recreate) {
		if (force_recreate || (this.dom.root == undefined)) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_description_container");
			this.dom.root.id = `p${this.page.index}_desc`;

			this.dom.p = document.createElement("p");
			this.dom.root.appendChild(this.dom.p);
		}

		this.update();
		return this.dom.root;
	}

	update() {
		if (this.dom.root != undefined) {
			this.dom.p.innerHTML = this.text;
		}
	}
}

class PageTitle {
	constructor(page, title) {
		this.page = page;
		this.title = title;

		this.dom = {
			root: undefined,
			title_h1: undefined
		};
	}

	get_dom(force_recreate) {
		if (force_recreate || (this.dom.root == undefined)) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_title_container");
			this.dom.root.id = `p${this.page.index}_title`;

			this.dom.title_h1 = document.createElement("h1");
			this.dom.root.appendChild(this.dom.title_h1);
		}

		this.update();
		return this.dom.root;
	}

	update() {
		if (this.dom.root != undefined) {
			this.dom.title_h1.innerHTML = this.title;
		}
	}
}

class PagePhoto {
	constructor(page, index, image_path, fallback_img, caption = null) {
		this.page = page;
		this.index = index;
		this.image_path = image_path;
		this.fallback_img = fallback_img;
		this.caption = caption;
		this._tried_to_load_fallback = false;

		this.dom = {
			root: undefined,
			bg_img: undefined,
			fg_img: undefined,
			caption_p: undefined
		};
	}

	get_dom(force_recreate) {
		if (force_recreate || (this.dom.root == undefined)) {

			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_photo_container");
			this.dom.root.id = `p${this.page.index}_photo${this.index}`;

			this.dom.bg_img = document.createElement("img");
			this.dom.bg_img.loading = "lazy";
			this.dom.bg_img.classList.add("bg_img");
			this.dom.root.appendChild(this.dom.bg_img);

			this.dom.fg_img = document.createElement("img");
			this.dom.fg_img.loading = "lazy";
			this.dom.fg_img.classList.add("fg_img")
			this.dom.root.appendChild(this.dom.fg_img);

			this.dom.caption_p = document.createElement("p");
			this.dom.root.appendChild(this.dom.caption_p);
		}

		this.update();
		return this.dom.root;
	}

	update() {
		if (this.dom.root != undefined) {
			this.dom.bg_img.src = this.image_path;
			this._tried_to_load_fallback = false;
			this.dom.bg_img.onerror = () => { if (!this._tried_to_load_fallback) { this.dom.bg_img.src = this.fallback_img; this._tried_to_load_fallback = true; } };


			this.dom.fg_img.src = this.image_path;
			this._tried_to_load_fallback = false;
			this.dom.fg_img.onerror = () => { if (!this._tried_to_load_fallback) { this.dom.fg_img.src = this.fallback_img; this._tried_to_load_fallback = true; } };


			if (this.caption == null) {
				this.dom.caption_p.classList.add("hide");
			} else {
				this.dom.caption_p.classList.remove("hide");
				this.dom.caption_p.innerHTML = this.caption;
			}
		}
	}
}

class PagePhotos {
	constructor(page, data, path_prefix, fallback_img) {
		this.page = page;
		this.fallback_img = fallback_img;
		this.carousel = new Carousel(true, true);

		this.page_photo_objs = [];
		for (let i = 0; i < data.length; i++)
			this.page_photo_objs.push(
				new PagePhoto(this.page, i, `${path_prefix}/${data[i].photo}`, fallback_img, data[i].caption)
			);

		this.dom = {
			root: undefined,
		};
	}

	get_dom() {
		if (this.dom.root == undefined) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_photos_container");
			this.dom.root.id = `p${this.page.index}_photos`;

			this.dom.root.appendChild(this.carousel.get_parent_node());

			for (const page of this.page_photo_objs)
				this.carousel.add_slide_dom(page.get_dom());
		}
		return this.dom.root;
	}
}


export { PageVideo, PageDescription, PageTitle, PagePhoto, PagePhotos };