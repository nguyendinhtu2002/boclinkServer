function getParameterByName(e, a = window.location.href) {
	e = e.replace(/[\[\]]/g, "\\$&");
	var t = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(a);
	return t ? t[2] ? decodeURIComponent(t[2].replace(/\+/g, " ")) : "" : null
}
const el = document.currentScript;
$.ajax({
	url: `https://boclink.azview.us/api/v1/shorten/${getParameterByName("v", el.src)}`,
	method: "GET",
	dataType: "JSON",
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
	},
	success: function (e) {
		1 == e.code && (location.href = e.url)
	}
});