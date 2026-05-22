---
title: "Iris"
description: "AI Interview Coach"
imageLight: "./iris-final-scene-light.webp"
imageDark: "./iris-final-scene-dark.webp"
finalObjectLight: "./iris-final-object-light.webp"
finalObjectDark: "./iris-final-object-dark.webp"
objectLight: "./iris-final-object-light.webp"
objectDark: "./iris-final-object-dark.webp"
order: 3
color1: "#178fff"
color2: "#5686ff"
client: "Co-Creator & Lead AI Engineer"
year: "2025"
category: "AI / EdTech"
href: "https://irisrecruiter.us"
github: "https://github.com/DhanwanthParameswar/iris"
techStack: ["React", "Workers", "Gemini API", "Firestore", "Auth0"]
details: "An edge-native, multimodal AI recording and coaching platform designed during a UB freshman hackathon to transform recruiter interactions and interview sessions into direct career actions. The system captures live audio recordings, running them concurrently with candidate resumes through the Google Gemini API to return real-time sentiment analysis, transcripts, coaching feedback, and automated follow-up communications."
highlights:
  - icon: "Cpu"
    title: "Edge Aggregation"
    description: "Engineered an asynchronous serverless pipeline using Cloudflare Workers to ingest raw audio streams and resume PDFs directly at the network edge."
  - icon: "Bot"
    title: "Multimodal Processing"
    description: "Integrated the Google Gemini API to analyze concurrent voice recordings and documents inside a unified contextual workspace."
  - icon: "Database"
    title: "Deterministic Telemetry"
    description: "Locked down generative intelligence into deterministic JSON models, synced in real-time with Firestore and secured by Auth0."
---

# Typography Kitchen Sink
This section exhausts all Markdown features supported by the `prose` typography plugin to ensure everything renders correctly in our project detail pages.

## Headings Test
Below are the standard heading levels used for document hierarchy.

### Level 3 Heading
This is a standard sub-section heading.

#### Level 4 Heading
Used for fine-grained details within a section.

##### Level 5 Heading
Rarely used, but supported for deep hierarchies.

###### Level 6 Heading
The smallest heading level available.

---

## Text Formatting
Markdown supports a variety of emphasis styles:
- **Bold text** for strong emphasis.
- *Italicized text* for subtle emphasis.
- ***Bold and Italicized*** for extreme emphasis.
- ~~Strikethrough text~~ for corrected or removed information.
- `Inline code` for variables, file names, or short snippets.
- [A clickable link](https://dhanwanth.com) to an external resource.

## Blockquotes
> "Good design is as little design as possible."
> — Dieter Rams
>
> > This is a nested blockquote to test multi-level indentation and vertical border consistency.

---

## Lists and Tasks

### Unordered Lists
- Top level item
- Another item
  - Nested item level 1
    - Nested item level 2
- Back to top level

### Ordered Lists
1. First major step
2. Second major step
   1. Sub-step A
   2. Sub-step B
3. Final step

### Task Lists
- [x] Implement AI Orchestration
- [/] Refine Typography (In Progress)
- [ ] Add Analytics
- [ ] Launch to Beta

---

## Code Blocks
Here is an example of a TypeScript code block to test syntax highlighting and line-height.

```typescript
import { motion } from 'framer-motion';

export const springTransition = {
  type: 'spring',
  duration: 0.8,
  bounce: 0
};

function TechComponent() {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      transition={springTransition}
    >
      Iris AI Engine
    </motion.div>
  );
}
```

---

## Data Tables
Tables are used to display structured information clearly.

| Feature | Support | Performance |
| :--- | :---: | ---: |
| LLM Processing | Native | < 500ms |
| Voice Sync | Beta | < 200ms |
| Mockup 3D | Stable | 60fps |
| Edge Rendering | Native | Variable |

---

## Media Integration
Testing local image resolution and captioning.

![Iris Mockup Interface](./iris-final-scene-dark.webp)
*Figure 1: The Iris AI dashboard showing real-time feedback loops.*

## Conclusion
This document ensures that every element rendered via the `<Content />` component in our `[slug].astro` template respects the `prose-invert` styling, ensuring a premium reading experience across all projects.
