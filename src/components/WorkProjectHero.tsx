import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useMotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import * as NeatLib from '@firecms/neat';
const NeatGradient = (NeatLib as any).NeatGradient || (NeatLib as any)['default']?.NeatGradient || (NeatLib as any)['default'] || NeatLib;
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { useIsDarkMode } from '@/lib/useIsDarkMode';
import {
	WORK_HERO,
	computeScrollEndAssetScale,
	computeBottomPeekPx,
	lerpAssetScale,
	computeTitleFitScale,
	computeTitleRem,
	computeTitleScrollFadeEnds,
	computeTiltDeg,
	type TitleScrollFadeEnds,
	buildMockupDepthMask,
	computeDepthFadeIntensity,
	getClusterMaxWidthPx,
	computeContentAreaCenterFromSection,
	measureScrollEndCenterOffsets,
	readHeaderClearancePx,
	shouldSkipHeroLayoutMeasure,
} from '@/lib/work-hero-layout';

type Props = {
	project: WorkProject;
};

export function WorkProjectHero({ project }: Props) {
	const isDark = useIsDarkMode();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gradientRef = useRef<any>(null);
	const scrollTrackRef = useRef<HTMLDivElement>(null);
	const clusterRef = useRef<HTMLDivElement>(null);
	const titleBlockRef = useRef<HTMLDivElement>(null);
	const mockupRef = useRef<HTMLDivElement>(null);
	const innerMockupRef = useRef<HTMLDivElement>(null);

	const [hasMounted, setHasMounted] = useState(false);
	const [bottomPeekPx, setBottomPeekPx] = useState(WORK_HERO.peekMinPx);
	const [titleFontRem, setTitleFontRem] = useState(WORK_HERO.titleRemMax);
	const [titleFitScale, setTitleFitScale] = useState(1);
	const [titleScrollFade, setTitleScrollFade] = useState<TitleScrollFadeEnds>({
		opacityEnd: WORK_HERO.titleFadeOpacityEndWide,
		blurEnd: WORK_HERO.titleFadeBlurEndWide,
		yEnd: WORK_HERO.titleFadeOpacityEndWide,
	});
	const [tiltDeg, setTiltDeg] = useState(WORK_HERO.tiltDegMin);
	const tiltMotion = useMotionValue(tiltDeg);
	const [dynamicCenterOriginY, setDynamicCenterOriginY] = useState('50%');
	const scrollEndCenterRef = useRef({ x: 0, y: 0 });
	const scrollEndAssetScaleMotion = useMotionValue(WORK_HERO.scrollEndAssetScaleMin);

	const isAtTopOnMount = useRef(typeof window !== 'undefined' ? window.scrollY < 50 : true);

	useLayoutEffect(() => {
		const measure = () => {
			if (shouldSkipHeroLayoutMeasure()) return;

			const cluster = clusterRef.current;
			const titleBlock = titleBlockRef.current;
			const mockupEl = mockupRef.current;
			const innerEl = innerMockupRef.current;
			const parentSection = cluster?.closest('section');
			if (!cluster || !mockupEl || !innerEl || !parentSection) return;

			const mockupLayoutH = innerEl.offsetHeight;
			const viewportW = window.innerWidth;
			const peek = computeBottomPeekPx(mockupLayoutH, viewportW);
			const nextTitleRem = computeTitleRem(viewportW);
			const titleEl = titleBlock?.querySelector('h1');
			if (titleEl instanceof HTMLElement) {
				titleEl.style.fontSize = `${nextTitleRem}rem`;
			}
			setBottomPeekPx(peek);
			const nextScrollEndAssetScale = computeScrollEndAssetScale(viewportW);
			scrollEndAssetScaleMotion.set(nextScrollEndAssetScale);
			setTiltDeg(computeTiltDeg(viewportW));
			setTitleFontRem(nextTitleRem);
			setTitleScrollFade(computeTitleScrollFadeEnds(viewportW));
			setTitleFitScale(
				computeTitleFitScale(
					window.innerHeight,
					titleBlock?.offsetHeight ?? 0,
					mockupLayoutH,
					readHeaderClearancePx(),
					peek,
				),
			);

			const sectionRect = parentSection.getBoundingClientRect();
			const target = computeContentAreaCenterFromSection(
				sectionRect,
				readHeaderClearancePx(),
			);

			const originalTransform = mockupEl.style.transform;
			const assetWrappers = innerEl.querySelectorAll<HTMLElement>('[data-mockup-asset]');
			const savedAssetTransforms = [...assetWrappers].map((el) => el.style.transform);
			const applyAssetScale = (scale: number) => {
				for (const el of assetWrappers) {
					el.style.transform = `scale(${scale})`;
				}
			};

			// Rest pose: origin only (scroll start stays x/y=0, tilted).
			applyAssetScale(WORK_HERO.restAssetScale);
			mockupEl.style.transform = 'none';
			const restRect = innerEl.getBoundingClientRect();
			const elRect = mockupEl.getBoundingClientRect();
			let originY = '50%';
			if (elRect.height > 0) {
				const innerCenterYOffset =
					restRect.top +
					restRect.height * WORK_HERO.restCenterRatio -
					elRect.top;
				originY = `${(innerCenterYOffset / elRect.height) * 100}%`;
				setDynamicCenterOriginY(originY);
			}
			const transformOrigin = `50% ${originY}`;
			mockupEl.style.transformOrigin = transformOrigin;

			applyAssetScale(nextScrollEndAssetScale);
			scrollEndCenterRef.current = measureScrollEndCenterOffsets(
				innerEl,
				mockupEl,
				target.x,
				target.y,
				{ transformOrigin },
			);

			mockupEl.style.transform = originalTransform;
			assetWrappers.forEach((el, i) => {
				el.style.transform = savedAssetTransforms[i] ?? '';
			});
		};

		measure();
		setHasMounted(true);

		const observer = new ResizeObserver(measure);
		if (clusterRef.current) observer.observe(clusterRef.current);
		if (titleBlockRef.current) observer.observe(titleBlockRef.current);
		if (innerMockupRef.current) observer.observe(innerMockupRef.current);

		window.addEventListener('resize', measure);
		return () => {
			window.removeEventListener('resize', measure);
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		tiltMotion.set(tiltDeg);
	}, [tiltDeg, tiltMotion]);

	const { scrollYProgress } = useScroll({
		target: scrollTrackRef,
		offset: ['start start', 'end end'],
	});

	const scrollProgress = useMotionValue(scrollYProgress.get());

	useEffect(() => {
		if (!shouldSkipHeroLayoutMeasure()) {
			scrollProgress.set(scrollYProgress.get());
		}

		const unsubscribe = scrollYProgress.on('change', (latest) => {
			if (shouldSkipHeroLayoutMeasure()) return;
			scrollProgress.set(latest);
		});
		return () => unsubscribe();
	}, [scrollYProgress, scrollProgress]);

	const smoothProgress = useSpring(scrollProgress, {
		stiffness: 120,
		damping: 25,
		restDelta: 0.001,
	});

	const tiltFactor = useTransform(smoothProgress, [0, 1], [1, 0]);
	const mockupRotateX = useTransform(tiltFactor, (latest) => latest * tiltDeg);
	const mockupScale = useTransform(smoothProgress, [0, 1], [1, WORK_HERO.scrollEndScale]);
	const mockupX = useTransform(smoothProgress, (p) => p * scrollEndCenterRef.current.x);
	const mockupY = useTransform(smoothProgress, (p) => p * scrollEndCenterRef.current.y);
	const mockupAssetScale = useTransform(
		[smoothProgress, scrollEndAssetScaleMotion],
		([p, endScale]) => lerpAssetScale(p as number, endScale as number),
	);

	const mockupDepthMaskLight = useTransform([smoothProgress, tiltMotion], ([progress, tilt]) =>
		buildMockupDepthMask(computeDepthFadeIntensity(progress as number, tilt as number), 'light'),
	);
	const mockupDepthMaskDark = useTransform([smoothProgress, tiltMotion], ([progress, tilt]) =>
		buildMockupDepthMask(computeDepthFadeIntensity(progress as number, tilt as number), 'dark'),
	);

	const mockupObjectAspect =
		project.finalObjectLight?.width && project.finalObjectLight?.height
			? project.finalObjectLight.width / project.finalObjectLight.height
			: 4 / 3;

	const canvasOpacity = useTransform(smoothProgress, [0, 1], [1, 0]);
	const foregroundFadeOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);

	const titleOpacity = useTransform(smoothProgress, (p) => {
		const end = titleScrollFade.opacityEnd;
		if (p <= 0) return 1;
		if (p >= end) return 0;
		return 1 - p / end;
	});
	const titleY = useTransform(smoothProgress, (p) => {
		const end = titleScrollFade.yEnd;
		if (p >= end) return 150;
		return (p / end) * 150;
	});
	const titleBlur = useTransform(smoothProgress, (p) => {
		const end = titleScrollFade.blurEnd;
		const px = p >= end ? 20 : (p / end) * 20;
		return `blur(${px}px)`;
	});

	const shadowOpacityBase = useTransform(smoothProgress, [0, 0.8], [1, 0]);
	const shadowOpacityDark = useTransform(shadowOpacityBase, [0, 1], [0, 0.6]);
	const shadowOpacityLight = useTransform(shadowOpacityBase, [0, 1], [0, 0.3]);

	useEffect(() => {
		if (!canvasRef.current) return;

		const NeatGradientConstructor = NeatGradient;
		if (!NeatGradientConstructor) return;

		const themeColor = isDark ? '#000000' : '#FFFFFF';
		const dynamicColors = [
			{ color: project.color1 || '#FF5373', enabled: true },
			{ color: project.color2 || '#FFC858', enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true },
		];

		try {
			gradientRef.current = new NeatGradientConstructor({
				ref: canvasRef.current,
				colors: dynamicColors,
				speed: 2,
				horizontalPressure: 4,
				verticalPressure: 5,
				waveFrequencyX: 2,
				waveFrequencyY: 3,
				waveAmplitude: 0,
				shadows: 0,
				highlights: 2,
				colorSaturation: 7,
				colorBrightness: 1,
				wireframe: false,
				colorBlending: 6,
				backgroundColor: isDark ? '#050505' : '#F5F5F5',
				backgroundAlpha: 1,
				resolution: 1,
				grainIntensity: 0,
				yOffsetWaveMultiplier: 8,
				yOffsetColorMultiplier: 4,
				yOffsetFlowMultiplier: 6,
			});
		} catch (e) {
			console.error('Error initializing NeatGradient', e);
		}

		let rafId: number;
		const handleScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				if (gradientRef.current) {
					gradientRef.current.yOffset = window.scrollY;
				}
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		const observer = new IntersectionObserver(
			([entry]) => {
				if (gradientRef.current) {
					gradientRef.current.speed = entry.isIntersecting ? 2 : 0;
				}
			},
			{ rootMargin: '100px', threshold: 0 },
		);

		if (scrollTrackRef.current) {
			observer.observe(scrollTrackRef.current);
		}

		setGradientReady(true);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafId) cancelAnimationFrame(rafId);
			observer.disconnect();
			if (gradientRef.current && typeof gradientRef.current.destroy === 'function') {
				gradientRef.current.destroy();
			}
		};
	}, [isDark, project.color1, project.color2]);

	const [gradientReady, setGradientReady] = useState(false);
	const entranceCanvasOpacity = useSpring(0, { stiffness: 40, damping: 20 });

	const entranceTitleY = useSpring(isAtTopOnMount.current ? 25 : 0, { stiffness: 120, damping: 26 });
	const entranceTitleOpacity = useSpring(isAtTopOnMount.current ? 0 : 1, { stiffness: 120, damping: 26 });
	const entranceTitleBlur = useSpring(isAtTopOnMount.current ? 12 : 0, { stiffness: 120, damping: 26 });

	const entranceMockupY = useSpring(isAtTopOnMount.current ? 45 : 0, { stiffness: 120, damping: 26 });
	const entranceMockupScale = useSpring(isAtTopOnMount.current ? 0.96 : 1, { stiffness: 120, damping: 26 });
	const entranceMockupOpacity = useSpring(isAtTopOnMount.current ? 0 : 1, { stiffness: 120, damping: 26 });

	useEffect(() => {
		if (gradientReady) {
			entranceCanvasOpacity.set(1);
		}
	}, [gradientReady]);

	useEffect(() => {
		if (hasMounted && isAtTopOnMount.current) {
			const titleTimer = setTimeout(() => {
				entranceTitleY.set(0);
				entranceTitleOpacity.set(1);
				entranceTitleBlur.set(0);
			}, 0);

			const mockupTimer = setTimeout(() => {
				entranceMockupY.set(0);
				entranceMockupScale.set(1);
				entranceMockupOpacity.set(1);
			}, 80);

			return () => {
				clearTimeout(titleTimer);
				clearTimeout(mockupTimer);
			};
		}
	}, [hasMounted]);

	const themeTransition = { duration: 0 };

	const combinedCanvasOpacity = useTransform([canvasOpacity, entranceCanvasOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));
	const combinedForegroundFadeOpacity = useTransform([foregroundFadeOpacity, entranceCanvasOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));

	const combinedMockupX = mockupX;
	const combinedMockupY = useTransform([mockupY, entranceMockupY], ([y1, y2]) => (y1 as number) + (y2 as number));
	const combinedMockupScale = useTransform([mockupScale, entranceMockupScale], ([s1, s2]) => (s1 as number) * (s2 as number));
	const combinedMockupOpacity = entranceMockupOpacity;

	const combinedTitleY = useTransform([titleY, entranceTitleY], ([y1, y2]) => (y1 as number) + (y2 as number));
	const combinedTitleOpacity = useTransform([titleOpacity, entranceTitleOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));
	const combinedTitleBlur = useTransform([titleBlur, entranceTitleBlur], (latest) => {
		const [blurStr, blurVal] = latest;
		return typeof blurStr === 'string' && blurStr !== 'blur(0px)' ? blurStr : `blur(${blurVal}px)`;
	});

	return (
		<div ref={scrollTrackRef} className={cn('relative h-[200vh] w-full', '-mt-[var(--site-header-clearance)]')}>
			<motion.section className="sticky top-0 box-border flex h-screen w-full max-sm:h-dvh max-sm:min-h-dvh flex-col items-center justify-start overflow-x-clip overflow-y-visible bg-background">
				<motion.canvas
					ref={canvasRef}
					style={{ opacity: combinedCanvasOpacity }}
					className="absolute inset-0 z-0 h-full w-full"
				/>

				{/* Bottom-anchored title + mockup cluster */}
				<div
					className="relative z-10 flex h-full w-full items-end justify-center pb-0"
					style={{ paddingInline: WORK_HERO.horizontalGutter / 2 }}
				>
					<motion.div
						ref={clusterRef}
						className="flex w-full flex-col items-center"
						style={{
							gap: WORK_HERO.titleGap,
							y: bottomPeekPx,
							maxWidth: getClusterMaxWidthPx(),
							transformOrigin: 'bottom center',
						}}
					>
						<div
							ref={titleBlockRef}
							className="relative z-10 w-full shrink-0"
							style={{
								scale: titleFitScale,
								y: -WORK_HERO.titleLiftPx,
								transformOrigin: 'bottom center',
							}}
						>
							<motion.h1
								style={{
									y: combinedTitleY,
									opacity: combinedTitleOpacity,
									filter: combinedTitleBlur,
									fontSize: `${titleFontRem}rem`,
									lineHeight: 'var(--text-work-hero-title--line-height)',
								}}
								className={cn(
									'type-work-hero-title relative mx-auto max-w-6xl px-6 text-center text-foreground',
									'break-words whitespace-pre-wrap selection:bg-foreground selection:text-background',
								)}
							>
								{project.title}
							</motion.h1>
						</div>

						{(project.finalObjectLight || project.finalObjectDark) && (
							<div
								className="relative z-20 flex w-full shrink-0 items-end justify-center overflow-visible"
								style={{
									perspective: '1400px',
									scale: WORK_HERO.mockupScale,
									transformOrigin: 'bottom center',
								}}
							>
								<motion.div
									ref={mockupRef}
									className="pointer-events-none relative flex h-auto w-full items-end justify-center overflow-visible select-none"
									style={{
										transformStyle: 'preserve-3d',
										transformPerspective: 1400,
										rotateX: mockupRotateX,
										scale: combinedMockupScale,
										x: combinedMockupX,
										y: combinedMockupY,
										opacity: combinedMockupOpacity,
										transformOrigin: `50% ${dynamicCenterOriginY}`,
									}}
								>
									<motion.div
										className="pointer-events-none absolute bottom-0 h-[20%] w-[80%] rounded-[100%] bg-black/40 blur-3xl"
										style={{
											transform: 'rotateX(90deg) translateY(50%)',
											opacity: isDark ? shadowOpacityDark : shadowOpacityLight,
										}}
									/>

									<div
										ref={innerMockupRef}
										className="relative w-full shrink-0 overflow-visible"
									>
										<div
											className="relative w-full overflow-visible"
											style={{ aspectRatio: mockupObjectAspect }}
										>
											<motion.div
												data-mockup-asset
												className="absolute inset-0 overflow-visible"
												style={{
													scale: mockupAssetScale,
													transformOrigin: 'bottom center',
													filter:
														'drop-shadow(0 20px 30px rgba(0,0,0,0.2)) drop-shadow(0 10px 10px rgba(0,0,0,0.1))',
												}}
												initial={false}
												animate={{ opacity: isDark ? 0 : 1 }}
												transition={themeTransition}
											>
												<motion.img
													src={project.finalObjectLight?.src}
													srcSet={project.finalObjectLight?.srcSet}
													sizes={project.finalObjectLight?.sizes}
													alt={`${project.title} Mockup Light`}
													draggable="false"
													fetchPriority="high"
													decoding="async"
													width={project.finalObjectLight?.width}
													height={project.finalObjectLight?.height}
													className="block h-full w-full object-contain object-bottom"
													style={{
														maskImage: mockupDepthMaskLight,
														WebkitMaskImage: mockupDepthMaskLight,
													}}
												/>
											</motion.div>
											<motion.div
												data-mockup-asset
												className="absolute inset-0 overflow-visible"
												style={{
													scale: mockupAssetScale,
													transformOrigin: 'bottom center',
													filter:
														'drop-shadow(0 20px 50px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
												}}
												initial={false}
												animate={{ opacity: isDark ? 1 : 0 }}
												transition={themeTransition}
											>
												<motion.img
													src={project.finalObjectDark?.src}
													srcSet={project.finalObjectDark?.srcSet}
													sizes={project.finalObjectDark?.sizes}
													alt={`${project.title} Mockup Dark`}
													draggable="false"
													fetchPriority="high"
													decoding="async"
													width={project.finalObjectDark?.width}
													height={project.finalObjectDark?.height}
													className="block h-full w-full object-contain object-bottom"
													style={{
														maskImage: mockupDepthMaskDark,
														WebkitMaskImage: mockupDepthMaskDark,
													}}
												/>
											</motion.div>
										</div>
									</div>
								</motion.div>
							</div>
						)}
					</motion.div>
				</div>

				<motion.div
					className="pointer-events-none absolute inset-0 z-5"
					style={{ opacity: entranceCanvasOpacity }}
				>
					<motion.div
						className="absolute inset-0"
						style={{
							background: 'linear-gradient(to bottom, transparent 66%, rgb(250 250 250) 100%)',
						}}
						initial={false}
						animate={{ opacity: isDark ? 0 : 1 }}
						transition={themeTransition}
					/>
					<motion.div
						className="absolute inset-0"
						style={{
							background: 'linear-gradient(to bottom, transparent 66%, rgb(0 0 0) 100%)',
						}}
						initial={false}
						animate={{ opacity: isDark ? 1 : 0 }}
						transition={themeTransition}
					/>
				</motion.div>

				<motion.div
					className="pointer-events-none absolute inset-0 z-15"
					style={{ opacity: combinedForegroundFadeOpacity }}
				>
					<motion.div
						className="absolute inset-0"
						style={{
							background: 'linear-gradient(to bottom, transparent 66%, rgb(250 250 250) 100%)',
						}}
						initial={false}
						animate={{ opacity: isDark ? 0 : 1 }}
						transition={themeTransition}
					/>
					<motion.div
						className="absolute inset-0"
						style={{
							background: 'linear-gradient(to bottom, transparent 66%, rgb(0 0 0) 100%)',
						}}
						initial={false}
						animate={{ opacity: isDark ? 1 : 0 }}
						transition={themeTransition}
					/>
				</motion.div>

				<style
					dangerouslySetInnerHTML={{
						__html: `
					a[href*="firecms.co"] {
						display: none !important;
						opacity: 0 !important;
						pointer-events: none !important;
						visibility: hidden !important;
						z-index: -9999 !important;
					}
				`,
					}}
				/>
			</motion.section>
		</div>
	);
}
