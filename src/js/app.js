import MAIN_CONFIG from "../../config.js";
import { Carousel } from "./carousel.js";
import { Page } from "./page.js";


class App {
	constructor(auto_init = true) {
		this.pages = [];
		this.glide_obj = undefined;
		this.carousel = new Carousel(true, false, {
			scroll_vertical: true
		});
		this.load_complete = false;

		this.dom = {
			root: document.createElement("div"),
			carousel_container: this.carousel.get_parent_node()
		};
		this.dom.root.classList.add("app_root");

		if (isMobileDevice() || true) {
			const isDS = isDeviceSlow();
			if (isDeviceSlow()) {// micro benchmark
				this.dom.root.classList.add("slow_device");
				console.warn("Mobile SLOW device. Using simple effects.");
			} else
				console.log("Mobile fast device. Using full effects");
		}
		this.dom.root.appendChild(this.dom.carousel_container);
		document.body.appendChild(this.dom.root);

		if (auto_init) {
			var auto_init_fn = async () => {
				if (document.readyState == "complete") {
					console.log("App: init timeout: start");

					await this.load_and_gen_pages();

					console.log("App: init timeout: complete!");
					return;
				}
				this._int_id = window.setTimeout(auto_init_fn.bind(this), 100);
			};
			auto_init_fn();
		}
	}

	// Call this after creating App instance (only if auto_init is flase), runs only once
	async load_and_gen_pages() {
		if (!this.load_complete) {
			var config, page_path, page;
			for (var i = 0; i < MAIN_CONFIG.pages.length; i++) {
				config = await load_json(MAIN_CONFIG.pages[i]);
				page_path = MAIN_CONFIG.pages[i].split("/");
				page_path.pop();
				page_path = page_path.join("/");

				page = new Page(i, config, page_path);
				this.carousel.add_slide_dom(page.get_dom());
				this.pages.push(page);
			}
			this.load_complete = true;
		}
	}
}

window.onload = async () => {
	const app = new App(true);
	window.app = app;
};