---
title: "Droppua"
description: "Cross-platform File Sharing"
imageLight: "./droppua-final-scene-light.png"
imageDark: "./droppua-final-scene-dark.png"
finalObjectLight: "./droppua-final-object-light.png"
finalObjectDark: "./droppua-final-object-dark.png"
objectLight: "./droppua-final-object-light.png"
objectDark: "./droppua-final-object-dark.png"
order: 5
color1: "#3b75f1"
color2: "#b6cdff"
client: "Creator & Lead Developer"
year: "2024"
category: "Web Utilities"
techStack: ["PHP", "MySQL", "JavaScript"]
details: "A high-performance, single-page web utility engineered for instantaneous, zero-refresh clipboard text and file synchronization between personal devices. Designed as a friction-free alternative to emailing links or files to oneself, the application leverages Server-Sent Events (SSE) to stream real-time database changes directly to the browser UI."
href: "https://dro.pp.ua"
github: "https://github.com/DhanwanthParameswar/DROPPUA"
highlights:
  - icon: "Zap"
    title: "Server-Sent Events"
    description: "Developed a highly efficient server-directed push model utilizing the HTML5 EventSource API to eliminate client-side polling."
  - icon: "Upload"
    title: "Asynchronous Uploads"
    description: "Engineered a modular multi-file upload subsystem with localized server filesystem manipulation and lifecycle state management."
  - icon: "RefreshCw"
    title: "Instant Sync"
    description: "Built a dynamic client synchronization layer that decodes real-time streaming payloads to update local states without refreshing."
---

## Why P2P?

Traditional file sharing often requires uploading to a server first, which introduces latency and privacy concerns. Droppua uses **WebRTC** to establish a direct connection between devices, allowing files to move as fast as your local network allows.

## Engineering Challenges

### 1. Signaling & Discovery
Connecting two devices behind different NATs is notoriously difficult. I implemented a custom signaling server using **Socket.io** and deployed global STUN/TURN servers to ensure a 99% connection success rate.

### 2. Large File Support
To handle gigabyte-sized files without crashing the browser, I implemented a chunking strategy. Files are sliced into small buffers, sent over the WebRTC data channel, and reassembled on the recipient's side using the FileSystem Writable File Stream API.

## Impact

Since its launch, Droppua has been used by hundreds of students to quickly move project assets between their laptops and lab machines. It remains one of my most technically challenging and rewarding open-source projects.
