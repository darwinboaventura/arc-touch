function calculateParentWidth() {
	const el = $('[data-item-to-calculate]');
	const width = el.parents('[data-item-to-calculate-parent]').width();

	el.width(width);
}

$(document).ready(function() {
	calculateParentWidth();
});

$(window).resize(function() {
	calculateParentWidth();
});