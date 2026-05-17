import { getCollection } from 'astro:content';

async function check() {
  const allProjects = await getCollection('work');
  console.log('Project IDs:', allProjects.map(p => p.id));
}

// Since I can't run this directly easily without a server, 
// I'll check the terminal output if I can, or use the REPL if HISE was related (it's not).
// Actually, I can just use a temporary page to dump the IDs.
