<script setup>
import { ref, watch, onMounted, computed } from "vue"
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'
import 'vue-lite-youtube-embed/style.css'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import { useI18n } from "vue-i18n"
import { useRouter } from 'vue-router'
import { useShare } from '@vueuse/core'
import { DanceService, defaultDancesParams } from "@/services/api"
import { useApi } from "@/composables/useApi"
import { useClipboard } from "@/composables/useClipboard";
import { getYoutubeId, translateDancesParametres } from '@/services/utils'
import AudioPlayerControls from "@/components/audioplayer/AudioPlayerControls.vue";
import { usePlayer } from '@/composables/usePlayer';

const modules = [Navigation, A11y];
const props = defineProps({ id: String })
const { t, locale } = useI18n()
const { data: dance, loading, error, execute: fetchDance } = useApi(DanceService.getDance)
const { copiedField, copyText } = useClipboard()
const { currentTrack,
	isPlaying,
	handleTrackClick,
	playlist,
	setPlaylist,
	togglePlay } = usePlayer();
const fullUrl = ref('')
const router = useRouter()

const shareOptions = ref({
	title: dance?.name,
	url: location.href,
})
const { share, isSupported } = useShare(shareOptions)
function shareDance() {
	return share().catch(err => err)
}

function chooseFilter(region) {
	if (region?.id == null) return;
	const saved = sessionStorage.getItem('dancesFilter')
	const params = saved ? JSON.parse(saved) : defaultDancesParams
	params.regions = [region.id]
	sessionStorage.setItem('dancesFilter', JSON.stringify(params))
	router.push({ path: '/', hash: '#dances' })
}

const allVideos = computed(() => {
	const videos = [];
	if (dance.value?.sourceVideos) {
		dance.value.sourceVideos.forEach(v => videos.push({ ...v, category: 'source' }));
	}
	if (dance.value?.performanceVideos) {
		dance.value.performanceVideos.forEach(v => videos.push({ ...v, category: 'performance' }));
	}
	if (dance.value?.lessonVideos) {
		dance.value.lessonVideos.forEach(v => videos.push({ ...v, category: 'lesson' }));
	}
	return videos;
});

// Fetch data on loading
onMounted(() => {
	fetchDance(props.id, locale.value)
	fullUrl.value = window.location.href
})
// Set tracks to store while get or change dance data
watch(dance, (newDanceValue) => {
	if (newDanceValue && newDanceValue.songs) {
		setPlaylist(newDanceValue.songs)
	}
})
// Fetch data on langyage change
watch(locale, (newLocale) => {
	fetchDance(props.id, newLocale)
})
// Fetch data on if dance changed
watch(() => props.id, (id) => {
	fetchDance(id, locale.value)
	fullUrl.value = window.location.href;
})
</script>

<template>
	<section class="dance">
		<div class="dance__container">
			<div v-if="loading" class="skeleton">
				<div class="skeleton__image skeleton-anim"></div>
				<div class="skeleton__videos">
					<div class="skeleton__video skeleton-anim"></div>
					<div class="skeleton__video skeleton-anim"></div>
				</div>
				<div class="skeleton__title skeleton-anim"></div>
				<div class="skeleton__descr skeleton-anim"></div>
			</div>
			<template v-else>
				<template v-if="dance">
					<div class="dance__body">
						<div class="dance__inner">
							<section class="dance-top dance-card-template">
								<div class="dance-top__left">
									<div class="dance-top__left-inner">
										<div v-if="dance?.regions" class="dance-top__categories">
											<button type="button" @click="chooseFilter(region)" v-for="region in dance?.regions"
												:key="region?.id" class="dance-top__category">{{
													region?.name}}</button>
										</div>
										<h1 class="dance-top__title">{{ dance?.name }}</h1>
										<button v-if="isSupported" @click="shareDance" class="dance-top__copy-button button">
											{{ t('shareBtn') }}
										</button>
										<button v-else @click="copyText(fullUrl, 'share')" class="dance-top__copy-button button">
											{{ copiedField === 'share' ? t('shareBtnCopy') : t('shareBtn') }}
										</button>
									</div>
								</div>
								<div class="dance-top__image">
									<img :src="dance?.photo_link" alt=""
										@error="e => e.target.parentElement.style.display = 'none'">
								</div>
							</section>
							<section class="dance-parametres dance-card-template">
								<h2 class="dance-parametres__title">{{ t('danceParametres') }}</h2>
								<ul class="dance-parametres__list">
									<li class="dance-parametres__item">{{ t('genre') }}:
										<span>{{ translateDancesParametres(dance?.genres, { t, prefix: 'genres' })
										}}</span>
									</li>
									<li class="dance-parametres__item">{{ t('complexity') }}:
										<span>{{ translateDancesParametres(dance?.complexity, { t, prefix: 'complexity' })
										}}</span>
									</li>
									<li class="dance-parametres__item">{{ t('tempo') }}:
										<span>{{ translateDancesParametres(dance?.paces, { t, prefix: 'paces', delimiter: ' → ' })
										}}</span>
									</li>
									<li class="dance-parametres__item">{{ t('gender') }}:
										<span>{{ translateDancesParametres(dance?.gender, { t, prefix: 'gender' }) }}</span>
									</li>
									<li class="dance-parametres__item">{{ t('handshakes') }}:
										<span>{{ translateDancesParametres(dance?.handshakes, { t, prefix: 'handshakes' })
										}}</span>
									</li>
								</ul>
							</section>
							<div v-if="playlist.length > 0 && (currentTrack?.name != '' || currentTrack?.link != '')"
								class="dance-audio">
								<AudioPlayerControls />
								<div class="dance-audio__list">
									<div v-for="track in playlist" :key="track?.id" class="dance-audio__list-item"
										:class="{ active: currentTrack?.id === track.id }">
										<button type="button" class="dance-audio__play-button" @click="handleTrackClick(track)">
											<img v-if="currentTrack?.id === track.id && isPlaying" src="@/assets/icons/pause.svg"
												alt="Pause icon">
											<img v-else src="@/assets/icons/play.svg" class="" alt="Play icon">
										</button>
										<div class="dance-audio__info">
											<span class="dance-audio__title">{{ track?.name }}</span>
											<div class="dance-audio__authors">
												<a target="_blank" class="dance-audio__author" v-for="ensemble in track?.ensembles"
													:key="ensemble?.id" :href="ensemble?.link">
													{{ ensemble?.name }}</a>
											</div>
										</div>
										<!-- <div class="dance-audio__duration">{{ formatTime(duration) }}</div> -->
									</div>
								</div>
							</div>
						</div>
						<div v-if="allVideos.length > 0" class="dance-video">
							<swiper :modules="modules" :breakpoints="{
								300: { slidesPerView: 1, autoHeight: true, },
								991.98: { slidesPerView: 1.7 }
							}" :space-between="20" navigation>
								<swiper-slide v-for="video in allVideos" :key="video.id" class="dance-video__slide">
									<div @click.capture="togglePlay(false)" class="dance-video__iframe">
										<LiteYouTubeEmbed :id="getYoutubeId(video.link)" :title="video.name" />
									</div>
									<div class="dance-video__title"><span>{{ t(`${video.category}Video`) }}</span>{{ video.name
									}}
									</div>
								</swiper-slide>
							</swiper>
						</div>
					</div>
				</template>
				<template v-else>
					{{ t('notFoundDance') }}
				</template>
			</template>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.dance-card-template {
	border-radius: 20px;
	border: 2px solid $orangeColor;
	background: #fff;
	padding: toRem(32);

	@media (max-width:$mobile) {
		padding: toRem(20) toRem(16);
	}
}

.dance {
	padding: toRem(137) 0 toRem(80);

	&__body {}

	&__inner {
		display: grid;
		grid-template-columns: 1.45fr 1fr;
		gap: toRem(20);

		@media (max-width:$mobile) {
			grid-template-columns: 1fr;
		}
	}
}

.dance-top {
	display: flex;
	max-width: 76%;

	@media (min-width:$mobile) {
		grid-column: span 2 / span 2;
	}

	@media (max-width:$mobile) {
		flex-direction: column;
		max-width: 100%;
		margin-bottom: toRem(70);
	}

	&__left {
		flex: 1 1 auto;
	}

	&__left-inner {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		max-width: toRem(600);
		height: 100%;

		@media (max-width:$mobile) {
			max-width: 100%;
			gap: toRem(20);
		}
	}

	&__categories {
		margin-bottom: toRem(40);
		display: flex;
		flex-wrap: wrap;
		gap: toRem(15);

		@media (max-width:$tablet) {
			margin-bottom: toRem(30);
		}

		@media (max-width:$mobile) {
			margin: 0;
			gap: toRem(10);
		}
	}

	&__category {
		border: 1px solid #c83f01;
		border-radius: 54px;
		padding: toRem(8) toRem(17);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		font-size: toRem(12);
		text-align: center;
		color: #c83f01;

		@media (max-width:$mobileSmall) {
			font-size: toRem(10);
			padding: toRem(6) toRem(12);
		}
	}

	&__title {
		font-weight: 600;
		font-size: toRem(64);
		line-height: 105%;
		color: #1a1a1a;
		margin-bottom: toRem(40);

		@media (max-width:$tablet) {
			font-size: toRem(50);
			margin-bottom: toRem(30);
		}

		@media (max-width:$mobile) {
			font-size: toRem(40);
			margin: 0;
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(30);
		}
	}

	&__image {
		align-self: center;
		flex: 0 0 56.5%;
		max-height: toRem(294);
		border-radius: 20px;
		overflow: hidden;
		margin-right: -37%;
		margin-left: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;

		@media (max-width:$pc) {
			margin-right: -39%;
			flex: 0 0 58.5%;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		@media (max-width:$tablet) {
			flex: 0 0 70%;
		}

		@media (max-width:$mobile) {
			flex: 0 1 auto;
			margin: 30px 0 -100px 0;
			align-self: stretch;
		}

		@media (max-width:$mobileSmall) {
			margin-top: toRem(20);
		}
	}

	&__copy-button {
		width: auto;
		min-width: toRem(250);

		@media (max-width:$mobile) {
			width: toRem(200);
			min-width: toRem(200);
			min-height: toRem(30);
			font-size: toRem(14);
		}

		@media (max-width:$mobileSmall) {
			padding: toRem(6) toRem(12);
			font-size: toRem(12);
			max-width: toRem(110);
			min-width: auto;
			height: toRem(24);
			min-height: toRem(24);
		}
	}
}

.dance-parametres {
	padding: toRem(16) toRem(32);
	min-height: toRem(300);
	background: url('@/assets/dance/decor-1.svg') center/cover no-repeat, #fff;

	&__title {
		font-weight: 500;
		font-size: toRem(50);
		background: linear-gradient(90deg, #fcb62a 0%, #f26924 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: toRem(25);
		line-height: 1.2;

		@media (max-width:$tablet) {
			font-size: toRem(40);
			margin-bottom: toRem(15);
		}

		@media (max-width:$mobile) {
			font-size: toRem(30);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(22);
		}
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: toRem(5) toRem(20);

		@media (max-width: toEm(370)) {
			grid-template-columns: 1fr;
		}
	}

	&__item {
		font-size: toRem(20);
		color: #1b1919;
		font-weight: 600;
		line-height: 1.3;

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
		}

		span {
			font-weight: 500;
		}
	}
}

.dance-video {
	position: relative;
	margin-top: toRem(50);
	padding: 0;

	@media (max-width:$mobile) {
		margin-top: toRem(20);
	}

	&__slide {
		display: flex;
		flex-direction: column;
	}

	&__iframe {
		border-radius: 20px !important;
		overflow: hidden;
	}

	&__title {
		font-size: toRem(22);
		color: #1b1919;
		margin-top: toRem(10);
		display: flex;
		align-items: center;
		gap: toRem(10);
		flex-wrap: wrap;

		@media (max-width:$mobileSmall) {
			font-size: toRem(18);
		}

		span {
			color: #c83f01;
			font-size: toRem(12);
			border-radius: 14px;
			border: 1px solid #c83f01;
			padding: toRem(5);
			display: inline-flex;
			justify-content: center;
			align-items: center;

			@media (max-width:$mobileSmall) {
				padding: toRem(3);
				font-size: toRem(10);
			}
		}
	}
}

.dance-audio {
	position: relative;

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: linear-gradient(transparent, #fff);
		pointer-events: none;
	}

	&__list {
		margin-top: toRem(20);
		overflow-y: auto;
		max-height: toRem(280);
		padding-bottom: toRem(30);

		@media (max-width:$mobile) {
			margin-top: toRem(10);
		}
	}

	&__authors {
		display: flex;
		flex-wrap: wrap;
		gap: toRem(0) toRem(10);
	}

	&__list-item {
		padding: toRem(12);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__info {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-left: toRem(10);
	}

	&__title {
		font-size: toRem(14);
		color: #000;
		line-height: 1.15;

		@media (max-width:$mobileSmall) {
			font-size: toRem(14);
		}

		.active & {
			color: $orangeColor;
		}
	}

	&__author {
		font-size: toRem(12);
		color: #989898;

		@media (any-hover: hover) {
			&:hover {
				text-decoration: underline;
			}
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(12);
		}
	}

	&__duration {
		font-size: toRem(12);
		color: #989898;
	}

	&__play-button {
		width: toRem(25);
		display: inline-flex;
		justify-content: center;
		align-items: center;

		img {
			width: toRem(19);
			height: toRem(22);
		}

		@media (max-width:$mobileSmall) {
			width: toRem(20);

			img {
				width: toRem(15);
				height: toRem(15);
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
		margin-bottom: toRem(20);

		@media (max-width:$mobile) {
			height: toRem(150);
		}

		@media (max-width:$mobileSmall) {
			height: toRem(100);
		}
	}

	&__videos {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: toRem(20);
		margin-bottom: toRem(20);
	}

	&__video {
		width: 100%;
		height: 200px;

		@media (max-width:$mobile) {
			height: toRem(150);
		}

		@media (max-width:$mobileSmall) {
			height: toRem(100);
		}
	}

	&__title {
		width: 80%;
		height: 50px;
		margin-bottom: toRem(10);

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}

	&__descr {
		width: 60%;
		height: 50px;

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}
}
</style>

<!-- styles for swiper without scope-->
<style lang="scss">
.swiper {
	position: static;
}

.swiper-wrapper {
	margin-bottom: toRem(50);
}

.swiper-button-prev {
	left: 0;

	svg {
		transform: rotate(-180deg) !important;
	}
}

.swiper-button-next {
	right: 0;
}

.swiper-button-prev,
.swiper-button-next {
	z-index: 2;
	position: absolute;
	bottom: 0;
	border-radius: 50%;
	background-color: $orangeColor;
	width: toRem(40);
	height: toRem(40);
	display: inline-flex;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	transition: all 0.3s;

	svg {
		width: toRem(13);
		height: toRem(22);

		path {
			fill: #fff;
			transition: all 0.3s;
		}
	}

	@media (any-hover: hover) {
		&:hover {
			background-color: $orangeHoverColor;
		}
	}
}

.swiper-button-disabled {
	cursor: default;
	opacity: 0.7;

	@media (any-hover: hover) {
		&:hover {
			background-color: $orangeColor;
		}
	}
}

.swiper-button-lock {
	display: none;
}

// .swiper-pagination {
// 	display: flex;
// 	justify-content: center;
// 	flex-wrap: wrap;
// 	align-items: center;
// 	gap: toRem(5);
// 	margin-bottom: toRem(15);
// }

// .swiper-pagination-bullet {
// 	width: toRem(12);
// 	cursor: pointer;
// 	height: toRem(12);
// 	border-radius: 50%;
// 	border: 1px solid $orangeColor;
// 	background-color: #fff;
// 	transition: all 0.3s;
// }

// .swiper-pagination-bullet-active {
// 	background-color: $orangeColor;
// }</style>