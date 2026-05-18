import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
	CONTACT_DIRECT,
	CONTACT_HEADING,
	CONTACT_INTRO_LINES,
	CONTACT_SOCIALS,
} from '@/lib/contact-info';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';
import { cn } from '@/lib/utils';

const contactLink =
	'rounded-sm text-foreground no-underline hover:opacity-50 dark:hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40';

const labelType = 'font-sans font-normal text-[1.225rem] leading-[0.9] md:text-[1.4rem]';
const valueType =
	'font-sans font-normal text-[0.875rem] leading-[var(--text-body-sm--line-height)] md:text-body-sm';

const introClass =
	'm-0 w-full max-w-[1018px] text-pretty text-center font-sans font-normal text-body-md leading-[var(--text-body-md--line-height)] text-foreground md:w-[75%] md:text-body-lg md:leading-[var(--text-body-lg--line-height)] [text-rendering:optimizeLegibility]';

export function ContactSection() {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	return (
		<section id="contact" aria-labelledby="contact-heading">
			<div className="mx-auto box-border flex w-full max-w-[1440px] flex-col items-center gap-[15px] overflow-hidden px-10 py-24 md:py-[150px]">
				<motion.h2
					id="contact-heading"
					className="w-full max-w-[600px] text-center font-sans font-normal text-[length:var(--text-work-section-title)] leading-[var(--text-work-section-title--line-height)] tracking-[-0.04em] text-foreground [text-rendering:optimizeLegibility]"
					{...reveal}
				>
					{CONTACT_HEADING}
				</motion.h2>

				<div className="h-[39px] w-full shrink-0" aria-hidden />

				<motion.p className={introClass} {...reveal}>
					{CONTACT_INTRO_LINES[0]}
					<br />
					{CONTACT_INTRO_LINES[1]}
				</motion.p>

				<div className="flex w-full items-center justify-center gap-[30px] pt-[50px] md:w-[80%]">
					<dl className="m-0 flex flex-1 flex-col items-end gap-2.5">
						{CONTACT_DIRECT.map(({ label, value, href }) => (
							<Fragment key={label}>
								<motion.dt className={cn(labelType, 'text-foreground')} {...reveal}>
									{label}
								</motion.dt>
								<motion.dd
									className={cn('m-0 w-full text-right text-foreground', valueType)}
									{...reveal}
								>
									<a
										className={contactLink}
										href={href}
										rel="noopener"
										data-cursor-tooltip="Go"
										data-umami-event="Contact Click"
										data-umami-event-type={label}
										data-umami-event-value={href}
									>
										{value}
									</a>
								</motion.dd>
							</Fragment>
						))}
					</dl>

					<ul className="m-0 flex flex-1 list-none flex-col items-start gap-2.5 p-0">
						{CONTACT_SOCIALS.map(({ label, href }) => (
							<motion.li key={label} className="w-full text-left" {...reveal}>
								<span className={cn(labelType, 'text-foreground')}>
									<a
										className={contactLink}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										data-cursor-tooltip="Go"
										data-umami-event="Social Link Click"
										data-umami-event-platform={label}
									>
										{label}
									</a>
								</span>
							</motion.li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
