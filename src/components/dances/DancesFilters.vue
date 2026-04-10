<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue"
import { useI18n } from "vue-i18n"
import { useMediaQuery } from "@vueuse/core"
import { useFilter } from '@/composables/useFilter'

const { t } = useI18n()
const params = defineModel<any>('params')
const isOpen = defineModel('isOpen')
const { filterCount, resetFilters } = useFilter(params)

const props = defineProps<{
	regions?: any[],
	filterButtonRef?: HTMLElement | null
}>()

// Filter closing
const filterBlockRef = useTemplateRef<HTMLElement>('filterBlockRef')
function handleClickOutside(e: MouseEvent) {
	if (!isOpen.value) return
	const target = e.target as Node;

	const clickedInsideBlock = filterBlockRef.value?.contains(target)
	const clickedInsideButton = props.filterButtonRef?.contains(target)
	if (!clickedInsideBlock && !clickedInsideButton) {
		isOpen.value = false
	}
}
function handleEsc(e: KeyboardEvent) {
	if (e.key === "Escape") {
		isOpen.value = false
	}
}

// Transform to spollers on mobile
const isDesktop = useMediaQuery('(min-width: 767.98px)')
const toggleDetails = (event: Event) => {
	if (isDesktop.value) {
		event.preventDefault()
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleEsc)
})
onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleEsc)
})
</script>

<template>
	<div class="dances-filters" ref="filterBlockRef" :class="{ open: isOpen }">
		<div class="dances-filters__top">
			<div @click="isOpen = !isOpen" class="dances-filters__top-left">
				<span class="dances-filters__top-icon">
					<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0.688477 1.73438H23.3945" stroke="#FF7C01" stroke-width="1.37707" stroke-linecap="round" />
						<path d="M0.688721 10H23.3947" stroke="#FF7C01" stroke-width="1.37707" stroke-linecap="round" />
						<path d="M0.688477 18.2617H23.3945" stroke="#FF7C01" stroke-width="1.37707" stroke-linecap="round" />
						<circle cx="18.2238" cy="1.73798" r="1.73798" fill="#FF7C01" />
						<circle cx="4.0412" cy="9.9997" r="1.73798" fill="#FF7C01" />
						<circle cx="15.0002" cy="18.2614" r="1.73798" fill="#FF7C01" />
					</svg>
				</span>
				<div class="dances-filters__top-title">{{ t('filters') }}</div>
			</div>
			<div class="dances-filters__current">
				<button v-show="filterCount > 0" @click="resetFilters" type="button" class="dances-filters__current-item">
					{{ t('resetButton') }}
					<img src="@/assets/icons/close.svg" alt="Close icon">
				</button>
			</div>
		</div>
		<div class="dances-filters__checkboxes">
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title " @click="toggleDetails">{{ t('genre') }}</summary>
				<div class="dances-filters__checkbox">
					<label
						v-for="genre in ['WAR', 'ROAD', 'CULT', 'LYRICAL', 'REVERSE', 'RITUAL', 'COMMUNITY', 'HUNTING', 'PILGRIMAGE', 'MEMORABLE', 'MEMORIAL', 'FUNERAL', 'FESTIVE', 'WEDDING', 'MATCHMAKERS', 'LABOR', 'AMULET']"
						:key="genre">
						<input type="checkbox" :value="genre" v-model="params.genres">
						<span> {{ t('genres' + '_' + genre.charAt(0) + genre.slice(1)) }}</span>
					</label>
				</div>
			</details>
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title " @click="toggleDetails">
					{{ t('region') }}
				</summary>
				<div class="dances-filters__checkbox">
					<template v-if="regions">
						<label v-for="region in regions" :key="region.id">
							<input type="checkbox" :value="region?.id" v-model="params.regions">
							<span>{{ region?.name }}</span>
						</label>
					</template>
					<div v-else class="skeleton">
						<div class="skeleton__region-title skeleton-anim"></div>
						<div class="skeleton__region-title skeleton-anim"></div>
						<div class="skeleton__region-title skeleton-anim"></div>
					</div>
				</div>
			</details>
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title " @click="toggleDetails">
					{{ t('complexity') }}
				</summary>
				<div class="dances-filters__checkbox">
					<label>
						<input type="checkbox" v-model="params.complexities" :value="1">
						<span>{{ t('complexity_1') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.complexities" :value="2">
						<span>{{ t('complexity_2') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.complexities" :value="3">
						<span>{{ t('complexity_3') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.complexities" :value="4">
						<span>{{ t('complexity_4') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.complexities" :value="5">
						<span>{{ t('complexity_5') }}</span>
					</label>
				</div>
			</details>
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title" @click="toggleDetails">
					{{ t('gender') }}
				</summary>
				<div class="dances-filters__checkbox">
					<label>
						<input type="checkbox" v-model="params.genders" value="MALE">
						<span>{{ t('gender_MALE') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.genders" value="FEMALE">
						<span>{{ t('gender_FEMALE') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.genders" value="MULTY">
						<span>{{ t('gender_MULTY') }}</span>
					</label>
				</div>
			</details>
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title " @click="toggleDetails">
					{{ t('tempo') }}
				</summary>
				<div class="dances-filters__checkbox">
					<label>
						<input type="checkbox" v-model="params.paces" :value="1">
						<span>{{ t('paces_1') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.paces" :value="2">
						<span>{{ t('paces_2') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.paces" :value="3">
						<span>{{ t('paces_3') }}</span>
					</label>
				</div>
			</details>
			<details class="dances-filters__checkboxes-group" :open="isDesktop">
				<summary class="dances-filters__checkboxes-title " @click="toggleDetails">
					{{ t('handshakes') }}
				</summary>
				<div class="dances-filters__checkbox">
					<label>
						<input type="checkbox" v-model="params.handshakes" value="FREE">
						<span>{{ t('handshakes_FREE') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="LITTLE_FINGER">
						<span>{{ t('handshakes_LITTLE_FINGER') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="CROSSED">
						<span>{{ t('handshakes_CROSSED') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="PALM">
						<span>{{ t('handshakes_PALM') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="BACK">
						<span>{{ t('handshakes_BACK') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="BELT">
						<span>{{ t('handshakes_BELT') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="SHOULDER">
						<span>{{ t('handshakes_SHOULDER') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="DAGGER">
						<span>{{ t('handshakes_DAGGER') }}</span>
					</label>
					<label>
						<input type="checkbox" v-model="params.handshakes" value="WHIP">
						<span>{{ t('handshakes_WHIP') }}</span>
					</label>
				</div>
			</details>
		</div>
	</div>
</template>

<style lang="scss" scoped>
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
	overflow-y: auto;
	max-height: 500px;

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
		margin-bottom: toRem(30);
		display: flex;
		align-items: center;
		height: toRem(25);
	}

	&__current {
		margin-left: toRem(20);
	}

	&__current-item {
		background-color: #c83f01;
		color: #fff;
		font-size: toRem(14);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: toRem(10);
		padding: toRem(5) toRem(10);
		border-radius: 50px;
		transition: all 0.3s;
		height: toRem(25);

		img {
			width: toRem(15);
			height: toRem(15);
		}

		@media (any-hover: hover) {
			&:hover {
				opacity: 0.85;
			}
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(12);
		}

		@media (max-width: toEm(350)) {
			font-size: toRem(9);
		}
	}

	&__top-left {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	&__top-icon {
		margin-right: toRem(10);
		width: toRem(25);
		height: toRem(20);

		@media (max-width:$mobileSmall) {
			width: toRem(20);
			height: toRem(17);
		}

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


	&__checkboxes {
		display: flex;
		flex-wrap: wrap;
		gap: toRem(40);

		@media (max-width:$mobile) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: toRem(20);
		}

		@media (max-width:$mobileSmall) {
			grid-template-columns: 1fr;
		}
	}

	&__checkboxes-title {
		font-size: toRem(18);
		margin-bottom: toRem(10);
		list-style: none;

		&::marker,
		&::-webkit-details-marker {
			display: none;
		}

		@media (max-width:$mobile) {
			width: 100%;
			cursor: default;
			text-align: left;
			border: 1px solid #c83f01;
			border-radius: 50px;
			padding: toRem(10) toRem(15);
			position: relative;
			cursor: pointer;
			font-size: toRem(14);
			color: #c83f01;
			margin: 0;

			&::before,
			&::after {
				content: "";
				position: absolute;
				right: 16px;
				top: 50%;
				background-color: #989898;
				height: 2px;
				width: 10px;
				transition: all 0.3s ease 0s;
				border-radius: 2px;
			}

			&::before {
				transform: translate(-68%, -50%) rotate(40deg);
			}

			&::after {
				transform: translate(0, -50%) rotate(-40deg);
			}

			[open] & {
				&::before {
					transform: translateX(-68%) rotate(-40deg);
					background-color: #c83f01;
				}

				&::after {
					transform: rotate(40deg);
					background-color: #c83f01;
				}
			}
		}
	}

	&__checkbox {
		display: flex;
		flex-direction: column;

		@media (max-width:$mobile) {
			border: 1px solid #d9d9d9;
			border-radius: 10px;
			padding: toRem(10);
			margin-top: toRem(10);
		}

		label {
			display: flex;
			gap: toRem(15);
			align-items: center;
			font-weight: 500;
			font-size: toRem(16);
			cursor: pointer;
			white-space: nowrap;
			line-height: 1.5;
			transition: all 0.3s;
			border-radius: 14px;

			&:focus-within {
				color: #c83f01;
			}

			&:not(:last-child) {
				margin-bottom: toRem(5);
			}

			@media (any-hover: hover) {
				&:hover {
					opacity: 0.7;
				}
			}

			position: relative;

			@media (max-width:$mobile) {
				font-size: toRem(14);
			}

			span {
				display: block;
				padding-right: toRem(25);
				transition: color 0.3s;

				&::before {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translate(0px, -50%);
					width: toRem(14);
					height: toRem(14);
					border: 1px solid #c83f01;
					background-color: #fff;
					border-radius: 4px;
					transition: border-color 0.3s;
				}

				&::after {
					content: '';
					position: absolute;
					right: toRem(3);
					top: 50%;
					transform: translate(0px, -50%);
					width: toRem(8);
					height: toRem(8);
					background-color: #c83f01;
					border-radius: 2px;
					transition: all 0.3s;
					opacity: 0;
					visibility: hidden;
				}
			}

			input {
				position: absolute;
				width: 0;
				height: 0;
				opacity: 0;

				&:checked+span {
					color: #c83f01;

					&::after {
						opacity: 1;
						visibility: visible;
					}
				}
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

	&__region-title {
		width: 100%;
		height: 15px;
		margin-bottom: toRem(10);
	}
}
</style>