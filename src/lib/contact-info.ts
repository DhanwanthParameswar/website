/**
 * Contact section copy + links.
 *
 * Framer splits the block into two visual columns:
 *  - "Direct"  → labeled Email/Phone rows (label + value)
 *  - "Socials" → label-only rows whose label *is* the link (LinkedIn/GitHub/X)
 *
 * Kept as two arrays so the component renders them with distinct semantics
 * (description list vs. social list) without prop drilling layout flags.
 */

export type ContactDirectEntry = {
	label: string;
	value: string;
	href: string;
};

export type ContactSocialEntry = {
	label: string;
	href: string;
};

export const CONTACT_HEADING = 'Contact';

/** Two-line intro; the visual break sits between the lines (rendered as <br />). */
export const CONTACT_INTRO_LINES: readonly [string, string] = [
	'Got a question or a great idea?',
	"I'd love to hear from you!",
];

export const CONTACT_DIRECT: readonly ContactDirectEntry[] = [
	{ label: 'Email', value: 'im@dhanwanth.com', href: 'mailto:im@dhanwanth.com' },
	{ label: 'Phone', value: '+1 7342692684', href: 'tel:+17342692684' },
];

export const CONTACT_SOCIALS: readonly ContactSocialEntry[] = [
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/dhanwanthp' },
	{ label: 'GitHub', href: 'https://github.com/DhanwanthParameswar' },
	{ label: 'X', href: 'https://x.com/dhanwanthp' },
];
