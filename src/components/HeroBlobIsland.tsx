import { lazy, Suspense, useEffect, useState } from 'react';

const HeroBlobBackdrop = lazy(() =>
	import('@/components/HeroBlobBackdrop').then((m) => ({ default: m.HeroBlobBackdrop })),
);

/**
 * Low-priority WebGPU hero wash — separate island so the shaders chunk does not compete
 * with hero copy hydration. Mounts after idle on all devices (including mobile).
 */
export function HeroBlobIsland() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const mount = () => setReady(true);

		if (typeof requestIdleCallback === 'function') {
			const id = requestIdleCallback(mount, { timeout: 2500 });
			return () => cancelIdleCallback(id);
		}

		const timeoutId = window.setTimeout(mount, 1);
		return () => window.clearTimeout(timeoutId);
	}, []);

	if (!ready) return null;

	return (
		<Suspense fallback={null}>
			<HeroBlobBackdrop />
		</Suspense>
	);
}
