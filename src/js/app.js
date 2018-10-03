function CalculateHelper(params) {
	this.identifier = params.identifier;
	this.parentIdentifier = params.parentIdentifier;

	this.calculateWidthOfParent = function() {
		return $(this.identifier).parents(this.parentIdentifier).width();
	};

	this.setElementWidth = function(width) {
		return $(this.identifier).width(width);
	}

	this.setElementWidthBasedOnParent = function() {
		const width = this.calculateWidthOfParent();

		this.setElementWidth(width);
	};
}

function CarouselSlider(params) {
	this.containerIdentifier = params.containerIdentifier;
	this.listIdentifier = params.listIdentifier;
	this.itemIdentifier = params.itemIdentifier;
	this.bulletItemIdentifier = params.bulletItemIdentifier;
	this.nameActiveClass = params.nameActiveClass;

	this.state = {
		bullet: 0,
		leftPosition: 0,
		rotate: null
	};

	this.calculateWidth = function(identifier) {
		return $(identifier).width();
	};

	this.calculateQuantityElements = function(searchAt, identifier) {
		return $(searchAt).find(identifier).length;
	}

	this.calculateWidthOfList = function(containerIdentifier, itemIdentifier) {
		const width = this.calculateWidth(containerIdentifier);
		const quantity = this.calculateQuantityElements(containerIdentifier, itemIdentifier);

		return width * quantity;
	};

	this.setWidthOfList = function() {
		const width = this.calculateWidthOfList(this.containerIdentifier, this.itemIdentifier);

		$(this.listIdentifier).width(width);
	}

	this.setActiveBullet = function() {
		$(this.bulletItemIdentifier).eq(this.state.bullet).addClass(this.nameActiveClass).siblings(this.bulletItemIdentifier).removeClass(this.nameActiveClass);
	}

	this.setLeftPositionBanner = function() {
		$(this.listIdentifier).css('left', '-' + this.state.leftPosition + 'px');
	}

	this.stopAutoRotate = function() {
		return clearInterval(this.state.rotate);
	}

	this.handleBulletNavigation = function() {
		const self = this;

		$(this.bulletItemIdentifier).click(function() {
			const containerWidth = self.calculateWidth(self.containerIdentifier);

			self.state.bullet = $(this).index();
			self.state.leftPosition = containerWidth * self.state.bullet;

			self.setLeftPositionBanner();
			self.setActiveBullet();

			self.stopAutoRotate();
		});
	};

	this.handleAutoRotate = function() {
		const self = this;

		this.state.rotate = setInterval(function() {
			let widthAfter = self.state.leftPosition + self.calculateWidth(self.containerIdentifier);
			let widthOfList = self.calculateWidthOfList(self.containerIdentifier, self.itemIdentifier);

			if (widthAfter < widthOfList) {
				self.state.leftPosition += self.calculateWidth(self.containerIdentifier);
			} else {
				self.state.leftPosition = 0;
			}

			self.state.bullet = self.state.leftPosition / self.calculateWidth(self.containerIdentifier);

			self.setActiveBullet();
			self.setLeftPositionBanner();
		}, 4000);
	}
};

const carouselHelper = new CalculateHelper({
	identifier: '[data-item-to-calculate]',
	parentIdentifier: '[data-item-to-calculate-parent]'
});

$(document).ready(function() {
	carouselHelper.setElementWidthBasedOnParent();

	const testimonies = new CarouselSlider({
		containerIdentifier: '.comp-carousel',
		listIdentifier: '.comp-carousel-list',
		itemIdentifier: '.comp-carousel-list-item',
		bulletItemIdentifier: '.comp-carousel-bullets-item',
		nameActiveClass: 'is-active'
	});

	testimonies.handleAutoRotate();
	testimonies.handleBulletNavigation();
});

$(window).resize(function() {
	carouselHelper.setElementWidthBasedOnParent();
});