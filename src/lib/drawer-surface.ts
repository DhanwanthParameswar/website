import { cn } from '@/lib/utils';

/** Frosted panel surface — shared by mobile nav drawer and desktop contact QR popup. */
export const drawerPanelSurface = cn(
	'flex w-full flex-col overflow-hidden rounded-[var(--header-radius)] border-[0.5px] border-solid border-border-footer bg-[color:var(--surface-header-bar)] p-4 [backdrop-filter:blur(var(--header-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--header-backdrop-blur))]',
);

/** Centered modal shell — same rhythm as the mobile nav drawer (`gap-1`, `p-4`). */
export const drawerModalPanel = cn(drawerPanelSurface, 'w-[min(100%,20rem)] gap-1');

export const drawerModalTitle =
	'type-nav m-0 px-1 py-2 text-center text-foreground';

export const drawerActionLink = cn(
	'type-nav link-hover-motion inline-flex cursor-pointer rounded-sm px-1 text-foreground no-underline',
	'hover:opacity-60 dark:hover:opacity-80',
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40',
);

export const drawerModalDivider = 'flex w-full items-center gap-3 px-8 py-2';

export const drawerModalDividerLine = 'h-px flex-1 bg-border-footer';

export const drawerModalDividerLabel = 'type-ui-sm shrink-0 text-muted';

export const drawerOverlayClass = 'fixed inset-0 cursor-pointer bg-black/35';

export const drawerPanelMotionVariants = {
	hidden: {
		opacity: 0,
		filter: 'blur(10px)',
		y: -8,
		scale: 0.99,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
	shown: {
		opacity: 1,
		filter: 'blur(0px)',
		y: 0,
		scale: 1,
		transition: { duration: 0.2, ease: [0.44, 0, 0.56, 1] },
	},
} as const;

export const drawerOverlayMotionVariants = {
	hidden: {
		opacity: 0,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
	shown: {
		opacity: 1,
		transition: { duration: 0.2, ease: [0.44, 0, 0.56, 1] },
	},
} as const;

/** Centered modal — fade/blur only (no slide). */
export const drawerPanelFadeMotionVariants = {
	hidden: {
		opacity: 0,
		filter: 'blur(10px)',
		transition: { duration: 0.2, ease: 'easeIn' },
	},
	shown: {
		opacity: 1,
		filter: 'blur(0px)',
		transition: { duration: 0.2, ease: [0.44, 0, 0.56, 1] },
	},
} as const;
