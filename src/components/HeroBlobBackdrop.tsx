import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';
import { Blob, Shader } from 'shaders/react';

import {
	HERO_BLOB_PALETTES,
	HERO_BLOB_PALETTE_SSR,
	type HeroBlobPalette,
} from '@/lib/hero-blob-palettes';
import { heroAmbientBackdrop, heroAmbientBackdropReduced } from '@/lib/motion-presets';

type BlobTier = 'sm' | 'md' | 'lg';

const BLOB_BY_TIER = {
	/** Narrow / tall viewport: less horizontal stretch to avoid harsh side clips; bias center up toward headline cluster. */
	sm: {
		stretchX: 1.28,
		stretchY: 0.94,
		size: 0.27,
		center: { x: 0.5, y: 0.42 },
		softness: 0.52,
	},
	md: {
		stretchX: 1.55,
		stretchY: 0.92,
		size: 0.24,
		center: { x: 0.5, y: 0.46 },
		softness: 0.5,
	},
	/** Matches prior desktop tuning. */
	lg: {
		stretchX: 1.82,
		stretchY: 0.9,
		size: 0.22,
		center: { x: 0.5, y: 0.5 },
		softness: 0.48,
	},
} as const;

function subscribeHeroBlobTier(onChange: () => void) {
	if (typeof window === 'undefined') return () => {};
	const mqlMd = window.matchMedia('(min-width: 768px)');
	const mqlLg = window.matchMedia('(min-width: 1024px)');
	mqlMd.addEventListener('change', onChange);
	mqlLg.addEventListener('change', onChange);
	return () => {
		mqlMd.removeEventListener('change', onChange);
		mqlLg.removeEventListener('change', onChange);
	};
}

function getHeroBlobTier(): BlobTier {
	if (typeof window === 'undefined') return 'md';
	if (window.matchMedia('(min-width: 1024px)').matches) return 'lg';
	if (window.matchMedia('(min-width: 768px)').matches) return 'md';
	return 'sm';
}

function useHeroBlobTier(): BlobTier {
	return useSyncExternalStore(subscribeHeroBlobTier, getHeroBlobTier, () => 'md');
}

type BlobColorRoll = HeroBlobPalette & { seed: number };

function pickBlobColorRoll(): BlobColorRoll {
	const pickIdx = () => {
		if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
			const buf = new Uint32Array(1);
			crypto.getRandomValues(buf);
			return (buf[0] ?? 0) % HERO_BLOB_PALETTES.length;
		}
		return Math.floor(Math.random() * HERO_BLOB_PALETTES.length);
	};
	const pickSeed = () => {
		if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
			const buf = new Uint32Array(1);
			crypto.getRandomValues(buf);
			return (buf[0] ?? 0) % 101;
		}
		return Math.floor(Math.random() * 101);
	};
	const palette = HERO_BLOB_PALETTES[pickIdx()] ?? HERO_BLOB_PALETTE_SSR;
	const seed = pickSeed();
	return { ...palette, seed };
}

/** Pause WebGPU work when the hero backdrop is fully off-screen (resume when scrolled back). */
function useBackdropIntersecting(ref: RefObject<HTMLElement | null>) {
	const [intersecting, setIntersecting] = useState(true);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				setIntersecting(entry.isIntersecting);
			},
			{ threshold: 0, rootMargin: '0px' },
		);

		io.observe(el);
		return () => io.disconnect();
	}, [ref]);

	return intersecting;
}

/**
 * WebGPU [Blob](https://shaders.com/docs/components/blob) behind hero copy.
 * Parent section should be `relative` with matching max width / horizontal padding.
 */
export function HeroBlobBackdrop() {
	const tier = useHeroBlobTier();
	const reduceMotion = useReducedMotion();
	const backdropRef = useRef<HTMLDivElement>(null);
	const backdropIntersecting = useBackdropIntersecting(backdropRef);
	const { stretchX, stretchY, size, center, softness } = BLOB_BY_TIER[tier];

	/** SSR/hydration default; `useLayoutEffect` replaces on client. */
	const [colorRoll, setColorRoll] = useState<BlobColorRoll>(() => ({
		...HERO_BLOB_PALETTE_SSR,
		seed: 1,
	}));
	/** Forces a new WebGPU pipeline when roll updates — Blob often ignores prop-only updates. */
	const [shaderInstanceKey, setShaderInstanceKey] = useState('hydrate');

	useLayoutEffect(() => {
		setColorRoll(pickBlobColorRoll());
		setShaderInstanceKey(
			typeof crypto !== 'undefined' && crypto.randomUUID
				? crypto.randomUUID()
				: `blob-${Date.now()}-${Math.random()}`,
		);
	}, []);

	const skipAmbient = reduceMotion === true;
	const backdropTransition = skipAmbient ? heroAmbientBackdropReduced : heroAmbientBackdrop;
	const blobSpeed = backdropIntersecting ? 0.26 : 0;

	return (
		<motion.div
			ref={backdropRef}
			className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
			aria-hidden
			initial={skipAmbient ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={backdropTransition}
		>
			<div
				className="absolute inset-0 origin-center"
				style={{ transform: `scaleX(${stretchX}) scaleY(${stretchY})` }}
			>
				<Shader
					key={shaderInstanceKey}
					disableTelemetry
					className="absolute inset-0 size-full"
					style={{ width: '100%', height: '100%' }}
				>
					<Blob
						visible={backdropIntersecting}
						colorA={colorRoll.colorA}
						colorB={colorRoll.colorB}
						highlightColor={colorRoll.highlightColor}
						seed={colorRoll.seed}
						colorSpace="oklch"
						center={center}
						speed={blobSpeed}
						size={size}
						deformation={0.32}
						softness={softness}
					/>
				</Shader>
			</div>
		</motion.div>
	);
}
