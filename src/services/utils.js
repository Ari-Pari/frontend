export let bodyLockStatus = true
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay)
	} else {
		bodyLock(delay)
	}
}
export let bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach(lockPaddingElement => {
				lockPaddingElement.style.paddingRight = ''
			});
			document.body.style.paddingRight = ''
			document.documentElement.classList.remove("lock")
		}, delay)
		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
export let bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-lp]")
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px'
		lockPaddingElements.forEach(lockPaddingElement => {
			lockPaddingElement.style.paddingRight = lockPaddingValue
		});

		document.body.style.paddingRight = lockPaddingValue
		document.documentElement.classList.add("lock")

		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
export function menuInit(e) {
	if (bodyLockStatus) {
		bodyLockToggle();
		document.documentElement.classList.toggle("menu-open");
	}
}
export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");
}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
}

export function headerScroll() {
	const header = document.querySelector('header.header');
	const headerShow = header.hasAttribute('data-scroll-show');
	const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
	const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function (e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains('_header-scroll') ? header.classList.add('_header-scroll') : null;
			if (headerShow) {
				if (scrollTop > scrollDirection) {
					// downscroll code
					header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
				} else {
					// upscroll code
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}
				timer = setTimeout(() => {
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}, headerShowTimer);
			}
		} else {
			header.classList.contains('_header-scroll') ? header.classList.remove('_header-scroll') : null;
			if (headerShow) {
				header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
			}
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}


export function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		document.addEventListener("click", setSpollerAction);
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
				}
			});
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll('details');
			if (spollerItems.length) {
				spollerItems.forEach(spollerItem => {
					let spollerTitle = spollerItem.querySelector('summary');
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerItem.hasAttribute('data-open')) {
							spollerItem.open = false;
							spollerTitle.nextElementSibling.hidden = true;
						} else {
							spollerTitle.classList.add('_spoller-active');
							spollerItem.open = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.classList.remove('_spoller-active');
						spollerItem.open = true;
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('summary') && el.closest('[data-spollers]')) {
				e.preventDefault();
				if (el.closest('[data-spollers]').classList.contains('_spoller-init')) {
					const spollerTitle = el.closest('summary');
					const spollerBlock = spollerTitle.closest('details');
					const spollersBlock = spollerTitle.closest('[data-spollers]');
					const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
					const scrollSpoller = spollerBlock.hasAttribute('data-spoller-scroll');
					const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll('._slide').length) {
						if (oneSpoller && !spollerBlock.open) {
							hideSpollersBody(spollersBlock);
						}

						!spollerBlock.open ? spollerBlock.open = true : setTimeout(() => { spollerBlock.open = false }, spollerSpeed);

						spollerTitle.classList.toggle('_spoller-active');
						_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

						if (scrollSpoller && spollerTitle.classList.contains('_spoller-active')) {
							const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute('data-spoller-scroll-noheader') ? document.querySelector('.header').offsetHeight : 0;

							//setTimeout(() => {
							window.scrollTo(
								{
									top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
									behavior: "smooth",
								}
							);
							//}, spollerSpeed);
						}
					}
				}
			}
			if (!el.closest('[data-spollers]')) {
				const spollersClose = document.querySelectorAll('[data-spoller-close]');
				if (spollersClose.length) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						const spollerCloseBlock = spollerClose.parentNode;
						if (spollersBlock.classList.contains('_spoller-init')) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
							spollerClose.classList.remove('_spoller-active');
							_slideUp(spollerClose.nextElementSibling, spollerSpeed);
							setTimeout(() => { spollerCloseBlock.open = false }, spollerSpeed);
						}
					});
				}
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector('details[open]');
			if (spollerActiveBlock && !spollersBlock.querySelectorAll('._slide').length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector('summary');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => { spollerActiveBlock.open = false }, spollerSpeed);
			}
		}
	}
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

export function scrollToBlock(scrollToBlockId) {
	requestAnimationFrame(() => {
		document.getElementById(scrollToBlockId)
			?.scrollIntoView({ behavior: 'smooth' })
	})
}

export function getYoutubeId(url) {
	const parsed = new URL(url)
	// youtube.com/watch?v=
	if (parsed.searchParams.get('v')) {
		return parsed.searchParams.get('v')
	}
	// youtu.be/ID
	if (parsed.hostname === 'youtu.be') {
		return parsed.pathname.slice(1)
	}
	// youtube.com/embed/ID
	if (parsed.pathname.includes('/embed/')) {
		return parsed.pathname.split('/embed/')[1]
	}
	return null
}

export const formatTime = (seconds) => {
	if (!seconds) return '00:00';
	const min = Math.floor(seconds / 60);
	const sec = Math.floor(seconds % 60);
	return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};