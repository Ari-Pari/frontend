<script setup>
import { ref, watch, onMounted, useTemplateRef, onBeforeUnmount, computed, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { DanceService } from "@/services/api"
import { useApi } from "@/composables/useApi"

const { t, locale } = useI18n()

const isFilterOpen = ref(false)
const filterButtonRef = useTemplateRef('filterButtonRef')
const filterBlockRef = useTemplateRef('filterBlockRef')

function handleClickOutside(e) {
	if (!isFilterOpen.value) return
	const clickedInsideBlock = filterBlockRef.value?.contains(e.target)
	const clickedInsideButton = filterButtonRef.value?.contains(e.target)
	if (!clickedInsideBlock && !clickedInsideButton) {
		isFilterOpen.value = false
	}
}
function handleEsc(e) {
	if (e.key === "Escape") {
		isFilterOpen.value = false
	}
}

const searchDancesBodyParams = ref({
	searchText: "",
	genres: [0],
	regions: [0],
	complexities: [],
	genders: [],
	paces: [],
	handshakes: [],
	sortedBy: "createdBy",
	sortType: "ASC"
})
const { data: dances, loading, error, execute: fetchDances } = useApi(DanceService.searchDances)

onMounted(() => {
	fetchDances({
		lang: locale.value,
		page: 1,
		size: 12,
		body: searchDancesBodyParams.value
	})
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleEsc)
})
onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleEsc)
})
watch(locale, (newLocale) => {
	fetchDances({
		lang: newLocale,
		page: 1,
		size: 12,
		body: searchDancesBodyParams.value
	})
})

// For filtering and sorting
// watch(searchDancesBodyParams, () => {
// 	fetchDances({
// 		lang: newLocale,
// 		page: 1,
// 		size: 10,
// 		body: searchDancesParams.value
// 	})
// })
// v-model='selected' для селекта
</script>

<template>
	<div id="dancesBlock" class="dances">
		<div class="dances__container">
			<div class="dances__actions actions-dances">
				<h2 class="actions-dances__title"> {{ t('danceEncyclopedia') }}</h2>
				<div class="actions-dances__bottom">
					<div class="actions-dances__sorting">
						<div class="actions-dances__select">
							<select class="actions-dances__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="actions-dances__select">
							<select class="actions-dances__select-item">
								<option value="sort-popular" selected>{{ t('sortPopular') }}</option>
								<option value="sort-newest">{{ t('sortNew') }}</option>
								<option value="sort-oldest">{{ t('sortOld') }}</option>
								<option value="sort-alphabet">{{ t('sortAlphabet') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
					</div>
					<div class="actions-dances__parametres">
						<button type="button" class="actions-dances__filter-button" @click="isFilterOpen = !isFilterOpen"
							:aria-label="t('filterAriaLabel')" :title="t('filterAriaLabel')" :class="{ open: isFilterOpen }"
							ref="filterButtonRef">
							<svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 2.52344H33.9773" stroke="#989898" stroke-width="2" stroke-linecap="round" />
								<path d="M1 14.5234H33.9773" stroke="#989898" stroke-width="2" stroke-linecap="round" />
								<path d="M1 26.5234H33.9773" stroke="#989898" stroke-width="2" stroke-linecap="round" />
								<circle cx="26.468" cy="2.52417" r="2.52417" fill="#989898" />
								<circle cx="5.86938" cy="14.5242" r="2.52417" fill="#989898" />
								<circle cx="21.7864" cy="26.5242" r="2.52417" fill="#989898" />
							</svg>
						</button>
						<div class="actions-dances__search">
							<span>
								<svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M19.1594 17.7845C18.6823 17.7494 18.5731 17.6952 18.1593 17.455C17.9533 17.3354 17.7251 17.0265 17.7251 17.0265C19.2448 15.2176 20.1598 12.8691 20.1598 10.3143C20.1598 4.61764 15.6471 0 10.0799 0C4.51269 0 0 4.61764 0 10.3143C0 16.011 4.51269 20.6286 10.0799 20.6286C12.5766 20.6286 14.8717 19.6924 16.6396 18.1373C16.6396 18.1373 16.9411 18.374 17.0583 18.5816C17.299 19.0079 17.2622 19.1373 17.2979 19.6255L25.0517 27.5437C26.1814 26.9188 26.2946 26.8601 26.8977 25.7186L19.1594 17.7845ZM10.0799 18.5816C5.45241 18.5816 1.71698 14.8417 1.71698 10.2086C1.71698 5.57548 5.45241 1.83552 10.0799 1.83552C14.7074 1.83552 18.4428 5.57548 18.4428 10.2086C18.4428 14.8417 14.7074 18.5816 10.0799 18.5816Z"
										fill="#989898" />
								</svg>
							</span>
							<input type="text" name="search-input" :placeholder="t('searchByDances')"
								class="actions-dances__search-input">
						</div>
					</div>
				</div>
				<div class="actions-dances__filters dances-filters" ref="filterBlockRef" :class="{ open: isFilterOpen }">
					<div class="dances-filters__top">
						<span class="dances-filters__top-icon">
							<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0.688477 1.73438H23.3945" stroke="#FF7C01" stroke-width="1.37707"
									stroke-linecap="round" />
								<path d="M0.688721 10H23.3947" stroke="#FF7C01" stroke-width="1.37707" stroke-linecap="round" />
								<path d="M0.688477 18.2617H23.3945" stroke="#FF7C01" stroke-width="1.37707"
									stroke-linecap="round" />
								<circle cx="18.2238" cy="1.73798" r="1.73798" fill="#FF7C01" />
								<circle cx="4.0412" cy="9.9997" r="1.73798" fill="#FF7C01" />
								<circle cx="15.0002" cy="18.2614" r="1.73798" fill="#FF7C01" />
							</svg>
						</span>
						<div class="dances-filters__top-title">{{ t('filters') }}</div>
					</div>
					<div class="dances-filters__selectsblock">
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="dances-filters__select">
							<select class="dances-filters__select-item">
								<option disabled value="" selected>{{ t('cardViewText') }}</option>
								<option value="base-view">{{ t('cardViewBase') }}</option>
								<option value="list-view">{{ t('cardViewList') }}</option>
							</select>
							<span>
								<img src="../assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="dances__inner">
				<div class="dances__body">
					<div v-if="loading || !dances" v-for="n in 4" :key="n" class="dance-item skeleton">
						<div class="skeleton__image skeleton-anim"></div>
						<div class="skeleton__title skeleton-anim"></div>
						<div class="skeleton__descr skeleton-anim"></div>
					</div>
					<div v-else v-for="dance in dances" :key="dance.id" class="dance-item">
						<RouterLink v-if="dance.photo_link" :to="`/dance/${dance.id}`" class="dance-item__image">
							<img :src="dance.photo_link" alt="Dance image">
						</RouterLink>
						<div class="dance-item__texts">
							<RouterLink :to="`/dance/${dance.id}`">
								<h3 class="dance-item__title">{{ dance.name }}</h3>
							</RouterLink>
							<div class="dance-item__tags">
								<span v-for="region in dance.regions" class="dance-item__tags-item">{{ region.name }}</span>
							</div>
							<ul class="dance-item__categories">
								<li class="dance-item__categories-item">{{ t('genre') }} <span>{{ dance.genres.join(', ')
								}}</span>
								</li>
								<li class="dance-item__categories-item">{{ t('difficulty') }} <span>{{ dance.complexity
								}}</span>
								</li>
								<li class="dance-item__categories-item">{{ t('tempo') }} <span>{{ dance.paces.join(', ')
								}}</span>
								</li>
								<li class="dance-item__categories-item">{{ t('gender') }} <span>{{ dance.gender }}</span></li>
								<li class="dance-item__categories-item">{{ t('handhold') }} <span>{{ dance.handshakes.join(', ')
								}}
									</span></li>
							</ul>
						</div>
					</div>
				</div>
				<button type="button" class="dances__showmore-button button">{{ t('showMoreButton') }}</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dances {
	scroll-margin-top: 70px;
	padding-top: toRem(53);
	background: url('../assets/home/dances-bg.svg') center/cover no-repeat, #fff;

	@media (max-width:$mobile) {
		padding-top: toRem(50);
	}

	@media (max-width:$mobileSmall) {
		scroll-margin-top: 65px;
		padding-top: toRem(18);
	}

	&__inner {
		max-height: toRem(1291);
		overflow-y: auto;
		padding: 0 toRem(53) toRem(53);
		display: flex;
		flex-direction: column;

		@media (max-width:$pc) {
			padding: 0 0 toRem(53);
		}

		@media (max-width:$mobileSmall) {
			max-height: toRem(750);
			padding: 0 0 toRem(25);
		}
	}

	&__body {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: toRem(40) toRem(30);

		@media (max-width:$tablet) {
			gap: toRem(30);
		}

		@media (max-width:$mobile) {
			grid-template-columns: 1fr 1fr;
			gap: toRem(30) toRem(25);
		}

		@media (max-width:$mobileSmall) {
			gap: toRem(30) toRem(19);
		}
	}

	&__showmore-button {
		margin-top: toRem(50);
		align-self: center;

		@media (max-width:$mobileSmall) {
			margin-top: toRem(20);
			font-size: toRem(16);
			height: toRem(30);
			width: toRem(200);
		}
	}
}

.actions-dances {
	margin-bottom: toRem(53);
	padding-bottom: toRem(14);
	border-bottom: 1px solid #d9d9d9;
	position: relative;

	@media (max-width:$mobile) {
		margin-bottom: toRem(30);
	}

	@media (max-width:$mobileSmall) {
		margin-bottom: toRem(21);
		padding-bottom: toRem(10);
	}

	&__bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;

		@media (max-width:$mobile) {
			flex-direction: column-reverse;
			align-items: stretch;
			justify-content: flex-start;
		}
	}

	&__title {
		font-size: toRem(40);
		color: #2b2026;
		flex: 1 1 auto;
		margin-bottom: toRem(20);

		@media (max-width:$mobile) {
			font-size: toRem(30);
			margin-bottom: toRem(15);
		}

		@media (max-width:$mobileSmall) {
			margin-bottom: toRem(8);
			font-size: toRem(20);
		}
	}

	&__sorting {
		margin-right: toRem(30);
		display: flex;
		align-items: center;

		@media (max-width:$mobile) {
			margin: 0;
		}
	}

	&__select {
		position: relative;
		padding-right: toRem(27);
		max-width: toRem(200);

		@media (max-width:$mobile) {
			padding-right: toRem(17);
			max-width: 100%;
		}

		span {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translate(0, -50%);
			width: toRem(17);
			height: toRem(10);
			transition: all 0.3s;

			@media (max-width:$mobile) {
				width: toRem(12);
				height: toRem(8);
			}

			img {
				max-width: 100%;
				max-height: 100%;
			}
		}

		&:first-child {
			margin-right: toRem(25);

			@media (max-width:$mobile) {
				margin-right: toRem(16);
			}
		}

		&:focus-within {
			select {
				color: #FF7C01;
			}
		}

		@media (any-hover: hover) {
			&:hover {
				select {
					color: #FF7C01;
				}
			}
		}
	}

	&__select-item {
		width: 100%;
		appearance: none;
		font-weight: 500;
		transition: all 0.3s;
		font-size: toRem(16);
		color: #353535;
		line-height: 2;
		outline: none;
		// background-color: #fff;
		// padding: toRem(2) toRem(7);
		// border-radius: 14px !important;
		background-color: transparent;

		@media (max-width:$tablet) {
			font-size: toRem(14);
		}

		@media (max-width:$mobile) {
			padding: 0;
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(12);
		}
	}

	&__parametres {
		display: flex;
		align-items: center;
		flex: 0 0 37%;

		@media (max-width:$mobile) {
			flex: 0 1 auto;
			margin-bottom: toRem(14);
		}
	}

	&__filter-button {
		margin-right: toRem(16);
		margin-top: toRem(5);

		svg {
			width: toRem(35);
			height: toRem(30);

			@media (max-width:$mobileSmall) {
				width: toRem(28);
				height: toRem(25);
			}

		}

		path,
		circle {
			transition: all 0.3s;
		}

		&.open {
			svg path {
				stroke: #FF7C01;
			}

			svg circle {
				fill: #FF7C01;
			}
		}

		@media (any-hover: hover) {
			&:hover {
				svg path {
					stroke: #FF7C01;
				}

				svg circle {
					fill: #FF7C01;
				}
			}
		}
	}

	&__search {
		width: 100%;
		position: relative;

		span {
			position: absolute;
			left: 31px;
			top: 50%;
			transform: translate(0, -50%);
			transition: all 0.3s;

			@media (max-width:$tablet) {
				left: 17px;
			}

			svg {
				width: toRem(27);
				height: toRem(28);

				@media (max-width:$tablet) {
					width: toRem(19);
					height: toRem(19);
				}
			}

			path {
				transition: all 0.3s;
			}
		}

		&:focus-within span path {
			fill: #FF7C01;
		}

		@media (any-hover: hover) {
			&:hover {
				span path {
					fill: #FF7C01;
				}
			}
		}

		input {
			width: 100%;
			border: 1.50px solid #d9d9d9;
			border-radius: 60px !important;
			height: toRem(60);
			background: #fff;
			padding: toRem(10) toRem(20) toRem(10) toRem(77);
			font-weight: 500;
			font-size: toRem(16);
			outline: none;
			transition: all 0.3s;

			@media (max-width:$tablet) {
				padding: toRem(10) toRem(20) toRem(10) toRem(43);
				height: toRem(50);
			}

			@media (max-width:$mobileSmall) {
				height: toRem(40);
			}

			&:focus {
				border: 1.50px solid #FF7C01;
				font-size: toRem(16);
			}

			&::placeholder {
				color: #989898;
			}
		}
	}
}

.dances-filters {
	background-color: #fff;
	border: 1px solid #d9d9d9;
	border-radius: 20px;
	padding: toRem(33);
	position: absolute;
	transition: all 0.3s;
	top: 90%;
	width: 100%;
	left: 0;
	z-index: 5;
	opacity: 0;
	visibility: hidden;

	@media (max-width:$mobile) {
		padding: toRem(20);
	}

	@media (max-width:$mobileSmall) {
		padding: toRem(16);
	}

	&.open {
		opacity: 1;
		visibility: visible;
		top: calc(100% + 16px);
	}

	&__top {
		margin-bottom: toRem(40);
		display: inline-flex;
		align-items: center;

		@media (max-width:$mobile) {
			margin-bottom: toRem(20);
		}
	}

	&__top-icon {
		margin-right: toRem(10);

		svg {
			width: toRem(25);
			height: toRem(20);

			@media (max-width:$mobileSmall) {
				width: toRem(20);
				height: toRem(17);
			}
		}
	}

	&__top-title {
		color: #353535;
		font-size: toRem(16);

		@media (max-width:$mobileSmall) {
			font-size: toRem(14);
		}
	}

	&__selectsblock {
		display: flex;
		flex-wrap: wrap;
		gap: toRem(20);

		@media (max-width:$mobile) {
			gap: toRem(15);
		}

		@media (max-width:$mobileSmall) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: toRem(10);
		}
	}

	&__select {
		position: relative;
		padding-right: toRem(40);
		padding-left: toRem(17);
		border: 1px solid #c83f01;
		border-radius: 50px;
		width: 230px;
		height: 40px;
		display: flex;
		align-items: center;

		@media (max-width:$tablet) {
			width: toRem(200);
		}

		@media (max-width:$mobile) {
			font-size: toRem(18);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
			width: 100%;
		}

		&:focus-within {
			border: 2px solid #c83f01;
		}

		span {
			position: absolute;
			right: 17px;
			top: 50%;
			transform: translate(0, -50%);
			width: toRem(17);
			height: toRem(10);
			transition: all 0.3s;

			img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}

	&__select-item {
		align-self: stretch;
		width: 100%;
		appearance: none;
		font-weight: 500;
		font-size: toRem(12);
		color: #c83f01;
		line-height: 2;
		outline: none;

		background-color: transparent;
	}

}

.dance-item {
	display: flex;
	flex-direction: column;
	border: 1px solid #d9d9d9;
	border-radius: 14px;
	background-color: #fff;

	@media (max-width:$mobileSmall) {
		border-radius: 6px;
	}

	&__image {
		width: 100%;
		overflow: hidden;
		border-radius: 14px;

		@media (any-hover: hover) {
			&:hover {
				img {
					transform: scale(1.05);
				}
			}
		}

		img {
			aspect-ratio: 1.77;
			transition: all 0.3s;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		@media (max-width:$mobileSmall) {
			border-radius: 6px;
		}
	}

	&__texts {
		background-color: #fff;
		padding: toRem(17);
		border-radius: 14px;

		@media (max-width:$mobileSmall) {
			border-radius: 6px;
			padding: toRem(5);
		}
	}

	&__title {
		font-size: toRem(24);
		color: #1a1a1a;
		transition: all 0.3s;
		margin-bottom: toRem(9);
		line-height: 1.3;

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
			margin-bottom: toRem(5);
		}

		@media (any-hover: hover) {
			&:hover {
				color: #c83f01;
			}
		}
	}

	&__tags {
		margin-bottom: toRem(14);
		display: flex;
		flex-wrap: wrap;
		gap: toRem(10);

		@media (max-width:$mobileSmall) {
			margin-bottom: toRem(5);
		}
	}

	&__tags-item {
		border: 1px solid #c83f01;
		border-radius: 54px;
		min-height: 31px;
		padding: toRem(5) toRem(17);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: toRem(12);
		text-align: center;
		color: #c83f01;

		@media (max-width:$mobileSmall) {
			min-height: toRem(16);
			font-size: toRem(10);
			padding: 0 toRem(9.5);
		}
	}

	&__categories {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: toRem(5) toRem(20);
	}

	&__categories-item {
		font-size: toRem(16);
		color: #1b1919;
		font-weight: 700;
		line-height: 1.3;

		@media (max-width:$mobileSmall) {
			font-size: toRem(10);
		}

		span {
			font-weight: 500;
		}
	}
}

.skeleton {
	border: none;
	background: transparent;

	&-anim {
		background: #eee;
		animation: skeleton-loading 1.5s infinite linear;
		border-radius: 14px;
	}

	&__image {
		width: 100%;
		height: 225px;
		margin-bottom: toRem(14);

		@media (max-width:$mobile) {
			height: toRem(150);
		}

		@media (max-width:$mobileSmall) {
			height: toRem(100);
		}
	}

	&__title {
		width: 80%;
		height: 30px;
		margin-bottom: toRem(10);

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}

	&__descr {
		width: 60%;
		height: 30px;

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}
}

@keyframes skeleton-loading {
	0% {
		background-color: #eee;
	}

	50% {
		background-color: #ddd;
	}

	100% {
		background-color: #eee;
	}
}
</style>
