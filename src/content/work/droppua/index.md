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
client: "Open Source"
year: "2023"
category: "Utilities / Networking"
techStack: ["React", "WebRTC", "Socket.io", "TypeScript", "Node.js"]
details: "Droppua is a cross-platform file-sharing utility designed to bridge the gap between different operating systems without the need for cloud intermediaries. It prioritizes privacy and speed by leveraging peer-to-peer technology."
highlights:
  - icon: "Share2"
    title: "P2P Architecture"
    description: "Built a robust peer-to-peer file transfer system using WebRTC for direct browser-to-browser communication."
  - icon: "Shield"
    title: "Secure Transfer"
    description: "Ensured data privacy through end-to-end encryption and ephemeral session management."
  - icon: "Smartphone"
    title: "Cross-platform"
    description: "Optimized for mobile and desktop using a responsive React architecture and localized storage."
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
