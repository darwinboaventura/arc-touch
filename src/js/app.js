function calculateParentWidth() {
	const el = $('[data-item-to-calculate]');
	const width = el.parents('[data-item-to-calculate-parent]').width();

	el.width(width);
}

function handleCarousel() {
	const container = $('.comp-carousel');
	const containerWidth = container.width();
	const listOfBanners = $('.comp-carousel-list');
	const totalItems = container.find('.comp-carousel-list-item').length;
	const totalWidth = containerWidth * totalItems;
	
	listOfBanners.width(totalWidth);

	let activeBullet = 1;
	let leftPosition = containerWidth;

	function handleBulletActivation(activeBullet) {		
		$('.comp-carousel-bullets-item').eq(activeBullet).addClass('is-active').siblings('.comp-carousel-bullets-item').removeClass('is-active');
	}

	function handleBannerActivation(leftPosition) {
		listOfBanners.css('left', '-' + leftPosition + 'px');
	}

	function handleBulletNavigation() {
		$('.comp-carousel-bullets-item').click(function() {
			const index = $(this).index();

			handleBannerActivation(containerWidth * index);
			handleBulletActivation(index);

			clearInterval(sliderProgress);
		});
	}

	const sliderProgress = setInterval(function() {
		if ((leftPosition + containerWidth) < totalWidth) {
			leftPosition += containerWidth;
		} else {
			leftPosition = containerWidth;
		}

		handleBannerActivation(leftPosition);
		handleBulletActivation((leftPosition / containerWidth) - 1);		
	}, 4000);

	handleBulletNavigation();
}

$(document).ready(function() {
	calculateParentWidth();
	handleCarousel();
});

$(window).resize(function() {
	calculateParentWidth();
});