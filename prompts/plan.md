Create a detailed execution plan for the Docusaurus content. **For all Docusaurus structural validation (sidebars, paths), USE THE context7 tools provided in mcp.**

**Required Output:**
1.  **Sidebar Structure (`sidebars.js` logic):**
    * Intro & Philosophy (Physical AI, Embodied Intelligence).
    * Lab Setup (Hardware options, Workstation Setup, Jetson Flashing).
    * Module 1: The Nervous System (Weeks 1-5).
    * Module 2: The Digital Twin (Weeks 6-7).
    * Module 3: The AI-Robot Brain (Weeks 8-10).
    * Module 4: VLA & Capstone (Weeks 11-13).
    * Appendices (Cheatsheets, Troubleshooting).

2.  **File Tree:**
    Generate the list of `.md` files needed, ensuring numerical prefixing for explicit ordering:
    * `docs/01-intro/01-embodied-intelligence.md`
    * `docs/02-setup/01-workstation-rtx.md`
    * `docs/02-setup/02-jetson-edge.md`
    * `docs/03-module-1/01-ros2-nodes.md`
    ...and so on for all 13 weeks.

3.  **Milestones:**
    * Phase 1: Foundation & Hardware (Intro + Module 1).
    * Phase 2: Simulation (Module 2 + 3).
    * Phase 3: VLA & Capstone (Module 4).