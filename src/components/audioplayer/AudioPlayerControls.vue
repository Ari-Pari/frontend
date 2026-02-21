<script setup>
import { usePlayer } from '@/composables/usePlayer';
import { useRoute } from 'vue-router';
import { formatTime } from '@/services/utils';

const route = useRoute()
const { currentTrack,
	playlist,
	isPlaying,
	setPlaylist,
	togglePlay,
	showPlaylist,
	nextTrack,
	prevTrack,
	currentTime,
	seekTime,
	duration } = usePlayer();
</script>

<template>
	<div v-if="playlist.length > 0" class="audio-player-controls" :title="currentTrack?.name" :class="{ dancePage: route.name == 'dance' }">
		<div class="audio-player-controls__top">
			<div class="audio-player-controls__buttons">
				<button @click="prevTrack" class="audio-player-controls__change-btn">⏮</button>
				<button @click="togglePlay(!isPlaying)" class="audio-player-controls__play-btn">
					<img v-if="isPlaying" src="@/assets/icons/pause.svg" alt="Pause icon">
					<img v-else src="@/assets/icons/play.svg" class="audio-player-controls__play-btn--play" alt="Play icon">
				</button>
				<button @click="nextTrack" class="audio-player-controls__change-btn">⏭</button>
			</div>
			<div class="audio-player-controls__info">
				<div class="audio-player-controls__title">{{ currentTrack?.name }}</div>
				<a :href="currentTrack?.ensembles[0]?.link" target="_blank" class="audio-player-controls__author">{{
					currentTrack?.ensembles[0]?.name }}</a>
			</div>
		</div>
		<div class="audio-player-controls__bottom">
			<span class="audio-player-controls__duration">{{ formatTime(currentTime) }}</span>
			<span class="audio-player-controls__duration--slash">/</span>
			<input class="audio-player-controls__range" type="range" :min="0" :max="duration" :value="currentTime"
				@input="(e) => seekTime(Number(e.target.value))" />
			<span class="audio-player-controls__duration">{{ formatTime(duration) }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.audio-player-controls {
	border-radius: 20px;
	border: 2px solid $orangeColor;
	padding: toRem(10) toRem(16) toRem(5);
	background-color: #fff;

	.header &.dancePage {
		display: none;
	}

	.header & {
		.audio-player-controls__range {
			display: none;
		}

		.audio-player-controls__info {
			display: none;
		}

		.audio-player-controls__change-btn {
			display: none;
		}

		.audio-player-controls__bottom {
			justify-content: center;
			gap: toRem(5);
		}

		.audio-player-controls__duration {
			flex: 0 0 toRem(30);

			&:last-child {
				display: none;
			}
		}

		padding: toRem(0);
		border: none;
		margin-left: toRem(15);

		@media (max-width:$mobileSmall) {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-left: toRem(10);

			.audio-player-controls__top {
				margin-bottom: toRem(3);
			}

			.audio-player-controls__duration {
				font-size: toRem(8);
				flex: 0 0 toRem(20);
			}
		}
	}

	&__top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: toRem(7);
	}

	&__bottom {
		display: flex;
		align-items: center;
		gap: toRem(10);
	}

	&__range {
		accent-color: $orangeColor;
		height: toRem(5);
		flex: 1 1 auto;
	}

	&__duration {
		font-size: toRem(12);
		flex: 0 0 toRem(40);
		color: #989898;

		&--slash {
			color: #989898;
			font-size: toRem(12);
			display: none;
		}
	}

	&__buttons {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: toRem(10);

		@media (max-width:$mobileSmall) {
			gap: toRem(5);
		}
	}

	&__change-btn {
		color: $orangeColor;
		font-size: toRem(20);
	}

	&__play-btn {
		width: toRem(40);
		height: toRem(40);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border: 2px solid $orangeColor;
		border-radius: 50%;

		img.audio-player-controls__play-btn--play {
			margin-left: 5px;
		}

		@media (max-width:$mobileSmall) {
			width: toRem(30);
			height: toRem(30);

			img {
				width: toRem(15);
				height: toRem(15);
			}
		}
	}

	&__info {
		flex: 1 1 auto;
		margin-left: toRem(20);

		@media (max-width:$mobileSmall) {
			margin-left: toRem(15);
		}
	}

	&__title {
		font-size: toRem(16);
		color: #000;
		line-height: 1.15;

		@media (max-width:$mobileSmall) {
			font-size: toRem(14);
		}
	}

	&__author {
		font-size: toRem(14);
		color: #989898;

		@media (max-width:$mobileSmall) {
			font-size: toRem(12);
		}

		@media (any-hover: hover) {
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
