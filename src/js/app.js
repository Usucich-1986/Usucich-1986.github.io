import MAIN_CONFIG from "../../config.js";
import { Page } from "./page.js";


class App {
	constructor() {
		this.pages = [];
		this.glide_obj = undefined;
		this.g_slider = undefined;

		this.dom = {
			root: undefined,
			glide: undefined,
			g_slides: undefined,
			g_arrows: undefined
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

			this.dom.glide = document.createElement("div");
			this.dom.glide.classList.add("glide");
			this.dom.root.appendChild(this.dom.glide);

			this.dom.g_slides = document.createElement("div");
			this.dom.g_slides.classList.add("glide__slides");
			this.dom.glide.appendChild(this.dom.g_slides);

			var gs;
			for (const page of this.pages) {
				gs = document.createElement("div");
				gs.classList.add("glide__slide");
				gs.appendChild(page.get_dom());
				this.dom.g_slides.appendChild(gs);
			}

			document.body.appendChild(this.dom.root);
		}
	}


}

// window.onload = async () => {
// 	const app = new App();
// 	await app.initialize();
// 	app.create_dom();
// 	window.app = app;
// };