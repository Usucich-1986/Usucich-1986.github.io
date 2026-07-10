import MAIN_CONFIG from "../../config.js";
import { PageDescription, PagePhotos, PageTitle, PageVideo } from "./page_components.js";


class Page {
	constructor(self_index, config, page_folder_path) {
		this.index = self_index
		this.config = config;

		this.title = new PageTitle(this, config.title || "No Title");
		this.video = new PageVideo(this, page_folder_path + '/src/' + config.video_name, MAIN_CONFIG.fallback_video);
		this.photos = new PagePhotos(this, config.photos, page_folder_path + '/src', MAIN_CONFIG.fallback_img);
		this.description = new PageDescription(this, config.description);

		this.dom = {
			root: undefined,

		}
	}

	get_dom(force_recreate) {
		if (force_recreate || (this.dom.root == undefined)) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("page_continer");
			this.dom.root.id = `p${this.index}`;

			this.dom.root.appendChild(this.title.get_dom());
			this.dom.root.appendChild(this.video.get_dom());
			this.dom.root.appendChild(this.description.get_dom());
			this.dom.root.appendChild(this.photos.get_dom());
		}

		this.update();
		return this.dom.root;
	}

	update() {
		if (this.dom.root != undefined) {
			this.title.update();
			this.video.update();
			this.description.update();
			this.photos.update();
		}
	}
}


class App {
	constructor() {
		this.pages = [];

		this.dom = {
			root: undefined,

		};
	}

	// Call this after instantiating App
	async initialize() {
		if (this.pages.length == 0) {
			for (var i = 0; i < MAIN_CONFIG.pages.length; i++) {
				var config = await load_json(MAIN_CONFIG.pages[i]);
				var page_path = MAIN_CONFIG.pages[i].split("/");
				page_path.pop();
				page_path = page_path.join("/");

				this.pages.push(new Page(i, config, page_path));
			}
		}
	}

	create_dom() {
		if (this.dom.root == undefined) {
			this.dom.root = document.createElement("div");
			this.dom.root.classList.add("app_root");

			// TODO: fix add slideshow.

			for (const page of this.pages) {
				this.dom.root.appendChild(page.get_dom());
			}

			document.body.appendChild(this.dom.root);
		}
	}
}



window.onload = async () => {
	const app = new App();
	await app.initialize();
	app.create_dom();
	window.app = app;
};