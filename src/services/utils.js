import { ref, onMounted, onUnmounted } from 'vue';

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
export function menuToggle(e) {
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
	const startPoint = 1;
	const headerShowTimer = 500;
	const scrollThreshold = 50;

	const isScrolled = ref(false);
	const isVisible = ref(false);

	let scrollDirection = 0;
	let timer = null;

	const onScroll = () => {
		const scrollTop = window.scrollY;
		const scrollDelta = Math.abs(scrollTop - scrollDirection);
		if (scrollDelta < scrollThreshold && scrollTop > startPoint) return;
		clearTimeout(timer);

		if (scrollTop >= startPoint) {
			isScrolled.value = true;
			if (scrollTop > scrollDirection) {
				isVisible.value = false;
			} else {
				isVisible.value = true;
			}
			timer = setTimeout(() => {
				isVisible.value = true;
			}, headerShowTimer);
		} else {
			isScrolled.value = false;
			isVisible.value = false;
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	};

	onMounted(() => {
		window.addEventListener("scroll", onScroll);
		onScroll();
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", onScroll);
		clearTimeout(timer);
	});

	return { isScrolled, isVisible };
}

export function scrollToBlock(scrollToBlockId) {
	requestAnimationFrame(() => {
		document.getElementById(scrollToBlockId)
			?.scrollIntoView({ behavior: 'smooth' })
	})
}

export const getYoutubeId = (url) => {
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

export const translateDancesParametres = (value, { t, prefix = '', delimiter = ', ' }) => {
	if (value === null || value === undefined || value === '') return '';

	const items = Array.isArray(value) ? value : [value];

	return items
		.map(item => {
			const translationKey = prefix ? `${prefix}_${item}` : String(item);
			return t(translationKey);
		})
		.join(delimiter);
}