<script setup lang="ts">
import { ref, watch, onMounted, useTemplateRef } from "vue"
import { useI18n } from "vue-i18n"
import { refDebounced, useIntersectionObserver } from "@vueuse/core"
import { useApi } from "@/composables/useApi"
import { useFilter } from '@/composables/useFilter'
import { DanceService, defaultDancesParams, type SupportedLocale } from "@/services/api";
import DanceCard from '@/components/dances/DanceCard.vue'
import DancesFilters from '@/components/dances/DancesFilters.vue'

const { t, locale } = useI18n()

// Fetch dances
const savedDancesParams = sessionStorage.getItem('dancesFilter')
const searchDancesBodyParams = ref(savedDancesParams ? JSON.parse(savedDancesParams) : defaultDancesParams)

const allDances = ref<any[]>([])
const dancesPage = ref(1)
const dancesPageSize = 12
const isFinished = ref(false)
const { loading: dancesLoading, execute: fetchDances } = useApi(DanceService.searchDances)
const { data: dancesRegions, execute: fetchRegions } = useApi(DanceService.getRegions)

const loadDances = async (isFirstPage = false) => {
	if (dancesLoading.value) return

	if (isFirstPage) {
		allDances.value = []
		dancesPage.value = 1
		isFinished.value = false
	}
	const result = await fetchDances({
		lang: locale.value as SupportedLocale,
		page: dancesPage.value,
		size: dancesPageSize,
		body: searchDancesBodyParams.value
	})

	if (!result) return

	if (result.length < dancesPageSize) {
		isFinished.value = true
	} else {
		dancesPage.value++
	}
	if (isFirstPage) {
		allDances.value = result
	} else {
		allDances.value.push(...result)
	}
}

// Infinite scroll for dance cards
const loadMoreTrigger = useTemplateRef('loadMoreTrigger')
useIntersectionObserver(
	loadMoreTrigger,
	([{ isIntersecting }]) => {
		if (isIntersecting && !dancesLoading.value && !isFinished.value) {
			loadDances()
		}
	},
	{
		rootMargin: '500px',
	}
)
// Debounce function for searching
const searchText = ref('')
const debouncedSearchText = refDebounced(searchText, 1000)
watch(debouncedSearchText, (val) => {
	searchDancesBodyParams.value.searchText = val.trim()
})
// Filter
const isFilterOpen = ref(false)
const { filterCount } = useFilter(searchDancesBodyParams)
const filterButtonRef = useTemplateRef('filterButtonRef')

// Fetch data on loading
onMounted(() => {
	fetchRegions(locale.value as SupportedLocale)
	loadDances(true)
})
// Fetch data on language change
watch(locale, (newLocale) => {
	fetchRegions(newLocale as SupportedLocale)
	loadDances(true)
})
// Fetch data on params change (filtering, sorting and searching)
watch(searchDancesBodyParams, (newParams) => {
	sessionStorage.setItem('dancesFilter', JSON.stringify({ ...newParams, searchText: "" })) // without search text
	loadDances(true)
}, { deep: true })

</script>

<template>
	<div id="dances" class="dances">
		<div class="dances__container">
			<div class="dances__actions actions-dances">
				<h2 class="actions-dances__title"> {{ t('danceEncyclopedia') }}</h2>
				<div class="actions-dances__bottom">
					<div class="actions-dances__sorting">
						<div class="actions-dances__select">
							<select class="actions-dances__select-item" v-model="searchDancesBodyParams.sortedBy">
								<option value="createdBy">{{ t('sortCreated') }}</option>
								<option value="popularity">{{ t('sortPopular') }}</option>
								<option value="alphabet">{{ t('sortAlphabet') }}</option>
							</select>
							<span>
								<img src="@/assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
						<div class="actions-dances__select">
							<select class="actions-dances__select-item" v-model="searchDancesBodyParams.sortType">
								<option value="ASC">{{ t('sortByASC') }}</option>
								<option value="DESC">{{ t('sortByDESC') }}</option>
							</select>
							<span>
								<img src="@/assets/icons/arrow-down.svg" alt="Arrow down icon">
							</span>
						</div>
					</div>
					<div class="actions-dances__parametres">
						<button type="button" class="actions-dances__filter-button active"
							@click="isFilterOpen = !isFilterOpen" 
							:aria-label="t('filterAriaLabel')"
							:title="t('filterAriaLabel')" 
							:class="{ open: isFilterOpen }"
							ref="filterButtonRef"
						>
							<span v-show="filterCount > 0" class="actions-dances__filter-button-counter">
								{{ filterCount}}
							</span>
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
							<input type="text" name="search-input" :placeholder="t('searchByDances')" v-model="searchText"
								class="actions-dances__search-input">
						</div>
					</div>
				</div>
				<!-- Dances Filters Component -->
				<DancesFilters 
					v-model:params="searchDancesBodyParams"
					v-model:isOpen="isFilterOpen"
					:regions="dancesRegions"
					:filterButtonRef="filterButtonRef"
					class="actions-dances__filters"
				/>
				<!-- Dances Filters Component -->
			</div>
			<div ref="dancesInner" class="dances__inner">
				<div class="dances__body">
					<div v-if="dancesLoading && allDances.length === 0" v-for="n in 12" :key="n" class="dance-item skeleton">
						<div class="skeleton__image skeleton-anim"></div>
						<div class="skeleton__title skeleton-anim"></div>
						<div class="skeleton__descr skeleton-anim"></div>
					</div>
					<template v-else>
						<template v-if="allDances.length > 0">
							<!-- Dance Card Component -->
							<DanceCard 
								v-for="item in allDances" 
								:key="item.id" 
								:dance="item" 
							/>
							<!-- Dance Card Component -->
							<div ref="loadMoreTrigger" class="load-more-trigger"
								style="width: 100%; height: 10px; margin-top: 20px;"></div>
							<div v-if="dancesLoading" class='dances__load-more-icon'>
								<svg width="60" height="60" viewBox="0 0 50 50">
									<circle cx="25" cy="25" r="20" fill="none" stroke="#353535" stroke-width="3"
										stroke-linecap="round" stroke-dasharray="60 120">
										<animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
											dur="1s" repeatCount="indefinite"></animateTransform>
									</circle>
								</svg>
							</div>
						</template>
						<template v-else>
							<div class="dances__body-notfound">
								{{ t('notFoundDance') }}
							</div>
						</template>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dances {
	scroll-margin-top: 70px;
	padding-top: toRem(53);
	background: #fff;

	@media (max-width:$mobile) {
		padding-top: toRem(50);
	}

	@media (max-width:$mobileSmall) {
		scroll-margin-top: 65px;
		padding-top: toRem(18);
	}

	&__inner {
		padding: 0 toRem(53) toRem(80);
		display: flex;
		flex-direction: column;
		position: relative;

		@media (max-width:$pc) {
			padding: 0 0 toRem(55);
		}
	}

	&__body {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: toRem(40) toRem(30);

		@media (max-width:$tablet) {
			gap: toRem(30);
		}

		@media (max-width: toEm(870)) {
			grid-template-columns: 1fr 1fr;
			gap: toRem(30) toRem(25);
		}

		@media (max-width:toEm(570)) {
			gap: toRem(30) toRem(19);
		}

		@media (max-width:$mobileSmall) {
			gap: toRem(30) toRem(10);
		}
	}

	&__body-notfound {
		font-size: toRem(20);
		grid-column: span 3 / span 3;

		@media (max-width:$mobile) {
			font-size: toRem(16);
		}
	}

	&__load-more-icon {
		position: absolute;
		bottom: 12px;
		left: 50%;
		transform: translate(-50%, 0px);

		svg {
			width: toRem(30);
			height: toRem(30);
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
		position: relative;

		&.active {
			span {
				opacity: 1;
				visibility: visible;
			}
		}

		span {
			position: absolute;
			width: toRem(20);
			height: toRem(20);
			top: -10px;
			font-size: toRem(12);
			right: -10px;
			border-radius: 50%;
			background-color: #c83f01;
			color: #fff;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			opacity: 0;
			visibility: hidden;
			transition: all 0.3s;

			@media (max-width:$mobileSmall) {
				font-size: toRem(8);
				width: toRem(14);
				height: toRem(14);
				top: -7px;
				right: -7px;
			}
		}

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
			left: 25px;
			top: 50%;
			transform: translate(0, -50%);
			transform: translate(0px, -50%);
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
			padding: toRem(10) toRem(20) toRem(10) toRem(70);
			font-weight: 500;
			font-size: toRem(16);
			outline: none;
			transition: all 0.3s;
			line-height: 1;

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
</style>
