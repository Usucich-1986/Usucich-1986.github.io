const MAIN_CONFIG = {
	deafult_page: 1,
	default_color_scheme: "light", // "light" / "dark"
	browser_tab_title_format: "${page_title} : Knots", // available vars: ["page_title", "time"]
	fallback_img: "./src/no_image.jpg",
	fallback_video: "./src/no_video.mp4",
	pages: [
		"./knot/1/config.json"
	]
};


export default MAIN_CONFIG;