<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { DanceService } from "@/services/api"
import { useApi } from "@/composables/useApi"
import { usePlayer } from '@/composables/usePlayer';
import { useClipboard } from "@/composables/useClipboard";
import { getYoutubeId } from '@/services/utils'
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'
import 'vue-lite-youtube-embed/style.css'

const props = defineProps({ id: String })
const { t, locale } = useI18n()
const { data: dance, loading, error, execute: fetchDance } = useApi(DanceService.getDance)
const { currentTrack,
	playlist,
	isPlaying,
	setTrack,
	setPlaylist,
	togglePlay,
	showPlaylist,
	nextTrack,
	prevTrack } = usePlayer();
const { copiedField, copyText } = useClipboard()
const fullUrl = ref('')
// Fetch data on loading
onMounted(() => {
	fetchDance(props.id, locale.value)
	fullUrl.value = window.location.href
})
// Set tracks to store while get or change dance data
watch(dance, (newDanceValue) => {
	if (newDanceValue && newDanceValue.songs) {
		setPlaylist(newDanceValue.songs)
		showPlaylist()
	}
})
// Fetch data on langyage change
watch(locale, (newLocale) => {
	fetchDance(props.id, newLocale)
})
// Fetch data on if dance changed
watch(() => props.id, (id) => {
	fetchDance(id, locale.value)
})
</script>

<template>
	<section class="dance">
		<div class="dance__container">
			<div v-if="loading || error" class="skeleton">
				<div class="skeleton__image skeleton-anim"></div>
				<div class="skeleton__videos">
					<div class="skeleton__video skeleton-anim"></div>
					<div class="skeleton__video skeleton-anim"></div>
					<div class="skeleton__video skeleton-anim"></div>
				</div>
				<div class="skeleton__title skeleton-anim"></div>
				<div class="skeleton__descr skeleton-anim"></div>
			</div>
			<div class="dance__body" v-else>
				<section class="dance-top">
					<div class="dance-top__left">
						<div class="dance-top__left-inner">
							<div v-if="dance?.regions" class="dance-top__categories">
								<div v-for="region in dance?.regions" :key="region?.id" class="dance-top__category">{{
									region?.name
								}}</div>
							</div>
							<h1 class="dance-top__title">{{ dance?.name }}</h1>
							<button @click="copyText(fullUrl, 'share')" class="dance-top__copy-button button">
								{{ copiedField === 'share' ? t('shareBtnCopy') : t('shareBtn') }}
							</button>
						</div>
					</div>
					<div class="dance-top__image">
						<img :src="dance?.photo_link" alt="Dance image">
					</div>
				</section>
				<section class="dance-parametres">
					<h2 class="dance-parametres__title">{{ t('danceParametres') }}</h2>
					<ul class="dance-parametres__list">
						<li class="dance-parametres__item">{{ t('genre') }}:
							<span>{{ dance?.genres.join(', ').toLowerCase() }}</span>
						</li>
						<li class="dance-parametres__item">{{ t('complexity') }}:
							<span>{{ dance?.complexity.join(', ').toLowerCase() }}</span>
						</li>
						<li class="dance-parametres__item">{{ t('tempo') }}:
							<span>{{ dance?.paces.join(', ').toLowerCase() }}</span>
						</li>
						<li class="dance-parametres__item">{{ t('gender') }}:
							<span>{{ dance?.gender.join(', ').toLowerCase() }}</span>
						</li>
						<li class="dance-parametres__item">{{ t('handshakes') }}:
							<span>{{ dance?.handshakes.join(', ').toLowerCase() }}</span>
						</li>
					</ul>
				</section>
				<div class="dance-audio">
					<div class="dance-audio__player">
						<div class="controls">
							<button @click="prevTrack">⏮</button>
							<button @click="togglePlay(!isPlaying)">
								{{ isPlaying ? 'Pause' : 'Play' }}
							</button>
							<button @click="nextTrack">⏭</button>
						</div>
						<div class="dance-audio__info">
							<div class="dance-audio__title">{{ currentTrack?.name }}</div>
							<div class="dance-audio__singer">{{ currentTrack?.ensembles[0].name }}</div>
						</div>
					</div>
				</div>
				<ul style="margin-top: 100px; border-top: 2px solid #000; padding-top: 20px;">
					<template v-if="dance?.sourceVideos">
						<template v-for="sourceVideo in dance?.sourceVideos" :key="sourceVideo?.id">
							<LiteYouTubeEmbed :id="getYoutubeId(sourceVideo.link)" :title="sourceVideo.name" />
						</template>
					</template>
					<li>{{ dance?.id }}</li>
					<li>{{ dance?.complexity.join(', ') }}</li>
					<li>{{ dance?.name }}</li>
					<li>{{ dance?.photo_link }}</li>
					<li>{{ dance?.gender.join(', ') }}</li>
					<li>{{ dance?.paces.join(', ') }}</li>
					<li>{{ dance?.genres.join(', ') }}</li>
					<li>{{ dance?.handshakes.join(', ') }}</li>
					<li v-for="song in dance?.songs" :key="song?.id">{{ song }}</li>
					<li v-for="sourceVideo in dance?.sourceVideos" :key="sourceVideo?.id">{{ sourceVideo }}</li>
					<li v-for="performanceVideo in dance?.performanceVideos" :key="performanceVideo?.id">{{ performanceVideo
					}}</li>
					<li v-for="lessonVideo in dance?.lessonVideos" :key="lessonVideo?.id">{{ lessonVideo }}</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.dance {
	padding: toRem(137) 0 toRem(80);

	&__body {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
}

.dance-top {
	margin-bottom: toRem(20);
	border-radius: 20px;
	border: 2px solid $orangeColor;
	background: #fff;
	padding: toRem(32);
	grid-column: span 2 / span 2;
	display: flex;
	max-width: 76%;

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
	}

	&__categories {
		margin-bottom: toRem(40);
		display: flex;
		flex-wrap: wrap;
		gap: toRem(15);
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
	}

	&__title {
		font-weight: 600;
		font-size: toRem(64);
		line-height: 105%;
		color: #1a1a1a;
		margin-bottom: toRem(40);
	}

	&__image {
		align-self: center;
		flex: 0 0 58.5%;
		max-height: toRem(294);
		border-radius: 20px;
		overflow: hidden;
		margin-right: -39%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__copy-button {
		width: auto;
		min-width: toRem(250);
	}
}

.dance-parametres {
	margin-bottom: toRem(50);
	border-radius: 20px;
	border: 2px solid $orangeColor;
	padding: toRem(16) toRem(32);
	min-height: toRem(300);
	background: url('@/assets/dance/decor-1.svg') center/cover no-repeat, #fff;

	&__title {
		font-weight: 500;
		font-size: toRem(60);
		background: linear-gradient(90deg, #fcb62a 0%, #f26924 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: toRem(30);
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
		grid-template-columns: 1fr 1fr 1fr;
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
