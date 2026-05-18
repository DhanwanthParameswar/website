import { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import * as NeatLib from '@firecms/neat';
const NeatGradient = (NeatLib as any).NeatGradient || (NeatLib as any)['default']?.NeatGradient || (NeatLib as any)['default'] || NeatLib;
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { useIsDarkMode } from '@/lib/useIsDarkMode';

type Props = {
	project: WorkProject;
};

export function WorkProjectHero({ project }: Props) {
	const reduceMotion = useReducedMotion();
	const isDark = useIsDarkMode();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const gradientRef = useRef<any>(null);
	const scrollTrackRef = useRef<HTMLDivElement>(null);
	const mockupRef = useRef<HTMLDivElement>(null);
	const innerMockupRef = useRef<HTMLDivElement>(null);
	
	const [hasMounted, setHasMounted] = useState(false);
	const [dynamicCenterOffset, setDynamicCenterOffset] = useState(0);
	const [dynamicCenterOriginY, setDynamicCenterOriginY] = useState("50%");
	const [finalScale, setFinalScale] = useState(0.75);
	const [dynamicMockupWidth, setDynamicMockupWidth] = useState(1224);
	const [dynamicPaddingVh, setDynamicPaddingVh] = useState(10);
	const [dynamicTilt, setDynamicTilt] = useState(18);
	
	// Track if we started at the top to decide whether to play entrance animations
	const isAtTopOnMount = useRef(typeof window !== 'undefined' ? window.scrollY < 50 : true);

	// Measurement logic to find the dynamic center
	useLayoutEffect(() => {
		const calculateOffset = () => {
			if (typeof document !== 'undefined' && (
				document.documentElement.classList.contains('theme-transition') ||
				document.documentElement.classList.contains('no-transitions')
			)) {
				return;
			}
			if (!mockupRef.current || !innerMockupRef.current) return;
			
			const el = mockupRef.current;
			const innerEl = innerMockupRef.current;
			const entranceWrapper = el.parentElement;
			const parentSection = el.closest('section'); // The sticky h-screen section
			if (!entranceWrapper || !parentSection) return;

			// Determine dynamic width and top padding vh continuously based on window width
			const width = window.innerWidth;
			
			// Interpolate mockup width dynamically between 580px and 1224px
			let calcWidth = 1224;
			if (width <= 480) {
				calcWidth = 580;
			} else if (width < 1200) {
				calcWidth = 580 + ((width - 480) / (1200 - 480)) * (1224 - 580);
			}
			setDynamicMockupWidth(calcWidth);

			// Interpolate top padding dynamic vh between 38vh and 10vh
			let calcPadding = 10;
			if (width <= 480) {
				calcPadding = 38;
			} else if (width < 1200) {
				calcPadding = 38 - ((width - 480) / (1200 - 480)) * (38 - 10);
			}
			setDynamicPaddingVh(calcPadding);

			// Interpolate dynamic tilt between 24 degrees (mobile) and 18 degrees (desktop)
			let calcTilt = 18;
			if (width <= 480) {
				calcTilt = 24;
			} else if (width < 1200) {
				calcTilt = 24 - ((width - 480) / (1200 - 480)) * (24 - 18);
			}
			setDynamicTilt(calcTilt);

			// Reset transforms briefly to measure "base" layout position
			const originalTransform = el.style.transform;
			const originalParentTransform = entranceWrapper.style.transform;
			
			el.style.transform = 'none';
			entranceWrapper.style.transform = 'none';
			
			const rect = innerEl.getBoundingClientRect();
			const parentRect = parentSection.getBoundingClientRect();
			
			// Measure the outer motion.div bounds to find its top and height
			const elRect = el.getBoundingClientRect();
			
			// Restore transforms
			el.style.transform = originalTransform;
			entranceWrapper.style.transform = originalParentTransform;
			
			// Calculate the center of the parent section
			// This is invariant to scroll position because parent and child move together.
			// When the section is "stuck", this equals the viewport center.
			const targetCenterY = parentRect.top + (parentRect.height / 2);
			
			// Calculate the natural center of the mockup aspect-ratio container
			// We use 0.425 instead of 0.5 to account for the scale-[1.15] origin-bottom of the image
			const currentCenterY = rect.top + (rect.height * 0.425);
			
			// The distance needed to reach the center
			const offset = targetCenterY - currentCenterY;
			
			setDynamicCenterOffset(offset);

			// Interpolate final scale dynamically between 0.85 (mobile) and 0.75 (desktop) to maximize space on smaller screens without feeling cramped
			let calcScale = 0.75;
			if (width <= 480) {
				calcScale = 0.85;
			} else if (width < 1200) {
				calcScale = 0.85 - ((width - 480) / (1200 - 480)) * (0.85 - 0.75);
			}
			setFinalScale(calcScale);

			// Calculate the Y percentage for transform origin relative to the outer container (el)
			if (elRect.height > 0) {
				const innerCenterYOffset = (rect.top + rect.height * 0.425) - elRect.top;
				const originY = (innerCenterYOffset / elRect.height) * 100;
				setDynamicCenterOriginY(`${originY}%`);
			}
		};

		// Run initially
		calculateOffset();
		setHasMounted(true);

		// Use a ResizeObserver to handle images loading or title wrapping
		const observer = new ResizeObserver(calculateOffset);
		if (innerMockupRef.current) observer.observe(innerMockupRef.current);
		
		window.addEventListener('resize', calculateOffset);
		return () => {
			window.removeEventListener('resize', calculateOffset);
			observer.disconnect();
		};
	}, []);

	// Framer Motion Scroll Tracking
	const { scrollYProgress } = useScroll({
		target: scrollTrackRef,
		offset: ["start start", "end end"]
	});

	const scrollProgress = useMotionValue(scrollYProgress.get());

	useEffect(() => {
		// Sync initial value if it changed before subscription, but skip during active theme transitions
		if (typeof document !== 'undefined' && (
			document.documentElement.classList.contains('theme-transition') ||
			document.documentElement.classList.contains('no-transitions')
		)) {
			// Do not sync during active transitions to prevent jump-to-0 layout collapse artifacts
		} else {
			scrollProgress.set(scrollYProgress.get());
		}

		const unsubscribe = scrollYProgress.on("change", (latest) => {
			// Skip updating when theme is transitioning to prevent layout collapse artifacts
			if (typeof document !== 'undefined' && (
				document.documentElement.classList.contains('theme-transition') ||
				document.documentElement.classList.contains('no-transitions')
			)) {
				return;
			}
			scrollProgress.set(latest);
		});
		return () => unsubscribe();
	}, [scrollYProgress, scrollProgress]);

	// Smooth out the scroll progress
	const smoothProgress = useSpring(scrollProgress, {
		stiffness: 120,
		damping: 25,
		restDelta: 0.001
	});

	// Transform Mapping for "Scrubber" Effect (using smoothProgress)
	const tiltFactor = useTransform(smoothProgress, [0, 1], [1, 0]);
	const mockupRotateX = useTransform(tiltFactor, (latest) => latest * dynamicTilt);
	const mockupScale = useTransform(smoothProgress, [0, 1], [1, finalScale]);
	// DYNAMIC Y OFFSET: Calculated to land exactly at viewport center
	const mockupY = useTransform(smoothProgress, [0, 1], [0, dynamicCenterOffset]);
	
	// Start at 0.64 to match original 0.8 * 0.8 alpha look
	const mockupDepthMask = useTransform(smoothProgress, [0, 1], [0.64, 1]); 
	
	const canvasOpacity = useTransform(smoothProgress, [0, 1], [1, 0]);
	const foregroundFadeOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
	
	const titleOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
	const titleY = useTransform(smoothProgress, [0, 0.7], [0, 150]);
	const titleBlur = useTransform(smoothProgress, [0, 0.6], ["blur(0px)", "blur(20px)"]);

	// Contact Shadow Fade
	const shadowOpacityBase = useTransform(smoothProgress, [0, 0.8], [1, 0]);
	const shadowOpacityDark = useTransform(shadowOpacityBase, [0, 1], [0, 0.6]);
	const shadowOpacityLight = useTransform(shadowOpacityBase, [0, 1], [0, 0.3]);

	// Neat Gradient Scroll Sync
	useEffect(() => {
		if (!canvasRef.current) return;

		const NeatGradientConstructor = NeatGradient;

		if (!NeatGradientConstructor) return;

		const themeColor = isDark ? "#000000" : "#FFFFFF";
		const dynamicColors = [
			{ color: project.color1 || "#FF5373", enabled: true },
			{ color: project.color2 || "#FFC858", enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true },
			{ color: themeColor, enabled: true }
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
				backgroundColor: isDark ? "#050505" : "#F5F5F5",
				backgroundAlpha: 1,
				resolution: 1,
				grainIntensity: 0,
				yOffsetWaveMultiplier: 8,
				yOffsetColorMultiplier: 4,
				yOffsetFlowMultiplier: 6
			});
		} catch (e) {
			console.error("Error initializing NeatGradient", e);
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

		window.addEventListener("scroll", handleScroll, { passive: true });

		const observer = new IntersectionObserver(
			([entry]) => {
				if (gradientRef.current) {
					// Pause the gradient animation loop when off-screen
					gradientRef.current.speed = entry.isIntersecting ? 2 : 0;
				}
			},
			{ rootMargin: "100px", threshold: 0 }
		);
		
		if (scrollTrackRef.current) {
			observer.observe(scrollTrackRef.current);
		}
		
		// Signal that the gradient is initialized
		setGradientReady(true);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafId) cancelAnimationFrame(rafId);
			observer.disconnect();
			if (gradientRef.current && typeof gradientRef.current.destroy === 'function') {
				gradientRef.current.destroy();
			}
		};
	}, [isDark, project.color1, project.color2]);

	// Entrance Motion Values - Background
	const [gradientReady, setGradientReady] = useState(false);
	const entranceCanvasOpacity = useSpring(0, { stiffness: 40, damping: 20 });
	
	// Entrance Motion Values - Title
	const entranceTitleY = useSpring(isAtTopOnMount.current ? 25 : 0, { stiffness: 120, damping: 26 });
	const entranceTitleOpacity = useSpring(isAtTopOnMount.current ? 0 : 1, { stiffness: 120, damping: 26 });
	const entranceTitleBlur = useSpring(isAtTopOnMount.current ? 12 : 0, { stiffness: 120, damping: 26 });

	// Entrance Motion Values - Mockup
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
			// Title enters immediately
			const titleTimer = setTimeout(() => {
				entranceTitleY.set(0);
				entranceTitleOpacity.set(1);
				entranceTitleBlur.set(0);
			}, 0);

			// Mockup enters with a tighter stagger for a unified 'swell'
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

	const themeTransition = {
		duration: 0
	};

	// Combine Entrance + Scroll for Canvas
	const combinedCanvasOpacity = useTransform([canvasOpacity, entranceCanvasOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));
	const combinedForegroundFadeOpacity = useTransform([foregroundFadeOpacity, entranceCanvasOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));

	// Combine Entrance + Scroll for Mockup
	const combinedMockupY = useTransform([mockupY, entranceMockupY], ([y1, y2]) => (y1 as number) + (y2 as number));
	const combinedMockupScale = useTransform([mockupScale, entranceMockupScale], ([s1, s2]) => (s1 as number) * (s2 as number));
	const combinedMockupOpacity = entranceMockupOpacity;

	// Combine Entrance + Scroll for Title
	const combinedTitleY = useTransform([titleY, entranceTitleY], ([y1, y2]) => (y1 as number) + (y2 as number));
	const combinedTitleOpacity = useTransform([titleOpacity, entranceTitleOpacity], ([o1, o2]) => (o1 as number) * (o2 as number));
	const combinedTitleBlur = useTransform([titleBlur, entranceTitleBlur], (latest) => {
		const [blurStr, blurVal] = latest;
		return typeof blurStr === 'string' && blurStr !== 'blur(0px)' ? blurStr : `blur(${blurVal}px)`;
	});

	return (
		<div ref={scrollTrackRef} className={cn("relative h-[200vh] w-full", "-mt-[var(--site-header-clearance)]")}>
			<motion.section
				className="sticky top-0 box-border flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-background"
			>
				{/* Neat Gradient Background */}
				<motion.canvas 
					ref={canvasRef} 
					style={{ opacity: combinedCanvasOpacity }}
					className="absolute inset-0 h-full w-full z-0"
				/>

				{/* Hero Content Cluster */}
				<div 
					className="relative flex h-full w-full flex-col items-center justify-between z-10"
					style={{
						paddingTop: `calc(var(--site-header-clearance) + ${dynamicPaddingVh}vh)`
					}}
				>
					
					{/* Title Section - Behind mockup */}
					<div className="relative z-10 w-full">
						<motion.h1 
							style={{ 
								y: combinedTitleY,
								opacity: combinedTitleOpacity,
								filter: combinedTitleBlur
							}}
							className={cn(
								"relative mx-auto max-w-6xl px-6 text-center font-sans text-[length:var(--text-display-xl)] font-normal leading-[0.9] tracking-[var(--tracking-display)] text-foreground md:text-[6rem] lg:text-[7rem]",
								"break-words whitespace-pre-wrap selection:bg-foreground selection:text-background"
							)}
						>
							{project.title}
						</motion.h1>
					</div>

					{/* Mockup Section - Above Title */}
					{(project.finalObjectLight || project.finalObjectDark) && (
						<div className="relative flex w-full flex-1 items-end justify-center z-20" style={{ perspective: '1400px' }}>
							<motion.div
								ref={mockupRef}
								className="pointer-events-none relative flex h-full w-full items-end justify-center select-none"
								style={{ 
									transformStyle: 'preserve-3d', 
									transformPerspective: 1400,
									rotateX: mockupRotateX,
									scale: combinedMockupScale,
									y: combinedMockupY,
									opacity: combinedMockupOpacity,
									transformOrigin: `50% ${dynamicCenterOriginY}`
								}}
							>
								{/* Contact Shadow Plane */}
								<motion.div 
									className="pointer-events-none absolute bottom-0 h-[20%] w-[80%] rounded-[100%] bg-black/40 blur-3xl"
									style={{ 
										transform: 'rotateX(90deg) translateY(50%)',
										opacity: isDark ? shadowOpacityDark : shadowOpacityLight
									}} 
								/>

								<div 
									ref={innerMockupRef}
									className="relative aspect-[16/10] flex-shrink-0"
									style={{
										width: `${dynamicMockupWidth}px`
									}}
								>
									<motion.img
										src={project.finalObjectLight?.src}
										alt={`${project.title} Mockup Light`}
										draggable="false"
										fetchPriority="high"
										decoding="async"
										className="absolute inset-0 h-auto w-full scale-[1.15] object-contain origin-bottom"
										style={{
											filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2)) drop-shadow(0 10px 10px rgba(0,0,0,0.1))',
											maskImage: useTransform(mockupDepthMask, (v) => `linear-gradient(to bottom, rgba(0,0,0,${v}) 0%, black 40%)`)
										}}
										initial={false}
										animate={{ opacity: isDark ? 0 : 1 }}
										transition={themeTransition}
									/>
									<motion.img
										src={project.finalObjectDark?.src}
										alt={`${project.title} Mockup Dark`}
										draggable="false"
										fetchPriority="high"
										decoding="async"
										className="absolute inset-0 h-auto w-full scale-[1.15] object-contain origin-bottom"
										style={{
											filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
											maskImage: useTransform(mockupDepthMask, (v) => `linear-gradient(to bottom, rgba(255,255,255,${v}) 0%, white 40%)`)
										}}
										initial={false}
										animate={{ opacity: isDark ? 1 : 0 }}
										transition={themeTransition}
									/>
								</div>
							</motion.div>
						</div>
					)}
				</div>

				{/* Foreground Fade Layers - Decoupled for Background and Content */}
				{/* 1. Background Smooth Layer - Always on, sits behind content to prevent cutoff */}
				<motion.div 
					className="pointer-events-none absolute inset-0 z-5"
					style={{ opacity: entranceCanvasOpacity }}
				>
					{/* Light smooth layer */}
					<motion.div 
						className="absolute inset-0"
						style={{
							background: `linear-gradient(to bottom, transparent 66%, rgb(250 250 250) 100%)`,
						}}
						initial={false}
						animate={{ opacity: isDark ? 0 : 1 }}
						transition={themeTransition}
					/>
					{/* Dark smooth layer */}
					<motion.div 
						className="absolute inset-0"
						style={{
							background: `linear-gradient(to bottom, transparent 66%, rgb(0 0 0) 100%)`,
						}}
						initial={false}
						animate={{ opacity: isDark ? 1 : 0 }}
						transition={themeTransition}
					/>
				</motion.div>

				{/* 2. Content Fade Layer - Sits above content, clears out as user scrolls */}
				<motion.div 
					className="pointer-events-none absolute inset-0 z-15"
					style={{ opacity: combinedForegroundFadeOpacity }}
				>
					{/* Light content fade layer */}
					<motion.div 
						className="absolute inset-0"
						style={{
							background: `linear-gradient(to bottom, transparent 66%, rgb(250 250 250) 100%)`,
						}}
						initial={false}
						animate={{ opacity: isDark ? 0 : 1 }}
						transition={themeTransition}
					/>
					{/* Dark content fade layer */}
					<motion.div 
						className="absolute inset-0"
						style={{
							background: `linear-gradient(to bottom, transparent 66%, rgb(0 0 0) 100%)`,
						}}
						initial={false}
						animate={{ opacity: isDark ? 1 : 0 }}
						transition={themeTransition}
					/>
				</motion.div>

				{/* Hide NEAT Attribution */}
				<style dangerouslySetInnerHTML={{ __html: `
					a[href*="firecms.co"] {
						display: none !important;
						opacity: 0 !important;
						pointer-events: none !important;
						visibility: hidden !important;
						z-index: -9999 !important;
					}
				`}} />
			</motion.section>
		</div>
	);
}
