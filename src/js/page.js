import MAIN_CONFIG from "../../config.js";
import { PageDescription, PagePhotos, PageTitle, PageVideo } from "./page_components.js";


export class Page {
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
			this.dom.root.classList.add("page_container");
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
			// this.photos.update(); // have no update
		}
	}
}