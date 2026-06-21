import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button';
import {
	drawerActionLink,
	drawerModalDivider,
	drawerModalDividerLabel,
	drawerModalDividerLine,
	drawerModalPanel,
	drawerModalTitle,
	drawerOverlayClass,
	drawerOverlayMotionVariants,
	drawerPanelFadeMotionVariants,
} from '@/lib/drawer-surface';
import {
	getTouchPrimarySnapshot,
	subscribeTouchPrimary,
} from '@/lib/device-capabilities';
import { menuToggleTransition } from '@/lib/motion-presets';
import { SITE_URL } from '@/lib/seo';
import { useTheme } from '@/lib/use-theme';
import { cn } from '@/lib/utils';

const VCF_PATH = '/add-to-contacts.vcf';
const VCF_FILENAME = 'dhanwanth.vcf';
const VCF_URL = `${SITE_URL}${VCF_PATH}`;
const CONTACT_QR_DIALOG_ID = 'contact-qr-dialog';
const QR_SIZE = 200;

function focusDesktopTrigger(container: HTMLDivElement | null) {
	const button = container?.querySelector<HTMLButtonElement>(
		'button[data-site-cta]:not([aria-hidden="true"])',
	);
	button?.focus();
}

function useTouchPrimaryDevice() {
	return useSyncExternalStore(
		subscribeTouchPrimary,
		getTouchPrimarySnapshot,
		() => false,
	);
}

export function ContactAddButton() {
	const isTouchPrimary = useTouchPrimaryDevice();
	const [open, setOpen] = useState(false);
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);
	const theme = useTheme();
	const titleId = useId();
	const reduceMotion = useReducedMotion();
	const panelTransition = reduceMotion ? { duration: 0.01 } : menuToggleTransition;
	const desktopTriggerWrapRef = useRef<HTMLDivElement>(null);
	const downloadLinkRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!open) return;

		let cancelled = false;
		const resolvedTheme =
			theme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

		void import('qrcode')
			.then(({ default: QRCode }) =>
				QRCode.toDataURL(VCF_URL, {
					margin: 2,
					width: QR_SIZE,
					color: {
						dark: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
						light: '#00000000',
					},
				}),
			)
			.then((url) => {
				if (!cancelled) setQrDataUrl(url);
			})
			.catch(() => {
				if (!cancelled) setQrDataUrl(null);
			});

		return () => {
			cancelled = true;
		};
	}, [open, theme]);

	useEffect(() => {
		if (!open) {
			setQrDataUrl(null);
			return;
		}

		const prevOverflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false);
				queueMicrotask(() => focusDesktopTrigger(desktopTriggerWrapRef.current));
			}
		};

		window.addEventListener('keydown', onKeyDown);

		const focusId = requestAnimationFrame(() => {
			downloadLinkRef.current?.focus();
		});

		return () => {
			cancelAnimationFrame(focusId);
			document.documentElement.style.overflow = prevOverflow;
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	const closeDialog = () => {
		setOpen(false);
		queueMicrotask(() => focusDesktopTrigger(desktopTriggerWrapRef.current));
	};

	const dialog =
		mounted && !isTouchPrimary
			? createPortal(
					<AnimatePresence initial={false}>
						{open ? (
							<>
								<motion.button
									key="contact-qr-overlay"
									type="button"
									className={cn(drawerOverlayClass, 'z-[110]')}
									aria-label="Close add to contacts dialog"
									initial="hidden"
									animate="shown"
									exit="hidden"
									variants={drawerOverlayMotionVariants}
									transition={panelTransition}
									onClick={closeDialog}
								/>

								<div className="pointer-events-none fixed inset-0 z-[111] flex items-center justify-center p-6">
									<motion.div
										key="contact-qr-panel"
										id={CONTACT_QR_DIALOG_ID}
										role="dialog"
										aria-modal="true"
										aria-labelledby={titleId}
										className={cn(drawerModalPanel, 'pointer-events-auto')}
										initial="hidden"
										animate="shown"
										exit="hidden"
										variants={drawerPanelFadeMotionVariants}
										transition={panelTransition}
										style={{ willChange: 'opacity, filter' }}
										onClick={(event) => event.stopPropagation()}
									>
										<p id={titleId} className={drawerModalTitle}>
											Scan to add contact
										</p>

										<div className="flex w-full items-center justify-center py-2">
											{qrDataUrl ? (
												<img
													src={qrDataUrl}
													alt="QR code linking to contact card download"
													width={QR_SIZE}
													height={QR_SIZE}
													className="block size-[12.5rem]"
													decoding="async"
												/>
											) : (
												<div
													className="size-[12.5rem] animate-pulse rounded-xl bg-foreground/10"
													aria-hidden
												/>
											)}
										</div>

										<div className={drawerModalDivider} aria-hidden>
											<span className={drawerModalDividerLine} />
											<span className={drawerModalDividerLabel}>or</span>
											<span className={drawerModalDividerLine} />
										</div>

										<div className="flex w-full justify-center py-3">
											<a
												ref={downloadLinkRef}
												className={drawerActionLink}
												href={VCF_PATH}
												download={VCF_FILENAME}
											>
												Download as file
											</a>
										</div>
									</motion.div>
								</div>
							</>
						) : null}
					</AnimatePresence>,
					document.body,
				)
			: null;

	if (isTouchPrimary) {
		return (
			<Button href={VCF_PATH} download={VCF_FILENAME} variant="secondary">
				Add to contacts
			</Button>
		);
	}

	return (
		<>
			<div ref={desktopTriggerWrapRef}>
				<Button
					type="button"
					variant="secondary"
					aria-expanded={open}
					aria-controls={open ? CONTACT_QR_DIALOG_ID : undefined}
					aria-haspopup="dialog"
					onClick={() => setOpen(true)}
				>
					Add to contacts
				</Button>
			</div>

			{dialog}
		</>
	);
}
