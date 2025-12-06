# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

## Prerequisites

Before starting with the Physical AI & Humanoid Robotics textbook, ensure you have:

- **System Requirements**:
  - For Workstation: NVIDIA RTX 4070 Ti (12GB VRAM) min, Core i7, 64GB RAM
  - For Edge Kit: NVIDIA Jetson Orin Nano/NX + Intel RealSense D435i + ReSpeaker Mic
  - Operating System: Ubuntu 22.04 (as per course constitution)

- **Software Requirements**:
  - Node.js 18+ and npm
  - Git
  - Python 3.8+ (for ROS 2 compatibility)

## Setting Up the Development Environment

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```
   This will start the Docusaurus server and open the textbook in your browser at `http://localhost:3000`.

## Building the Documentation

To build the static documentation site:

```bash
npm run build
```

The built site will be available in the `build/` directory.

## Adding New Content

1. **Content Structure**: All content follows the numerical prefixing system:
   - `docs/01-intro/01-embodied-intelligence.md`
   - `docs/02-setup/01-workstation-rtx.md`
   - etc.

2. **Required Frontmatter**: Each content file must include:
   ```yaml
   ---
   id: unique-identifier
   title: Page Title
   sidebar_label: Sidebar Label
   sidebar_position: 1
   description: Brief description for SEO
   ---
   ```

3. **Admonitions**: Use Docusaurus admonitions as required by the constitution:
   ```markdown
   :::danger
   Safety warning for hardware handling
   :::

   :::warning
   Latency trap warning for cloud robotics
   :::

   :::note
   Important information
   :::

   :::tip
   Helpful tip
   :::
   ```

4. **Mathematical Content**: Use LaTeX for physics equations:
   ```markdown
   $$F = ma$$
   ```

## Navigation Structure

The textbook is organized into 7 main sections:
1. Introduction & Philosophy
2. Lab Setup
3. Module 1: The Nervous System (Weeks 1-5)
4. Module 2: The Digital Twin (Weeks 6-7)
5. Module 3: The AI-Robot Brain (Weeks 8-10)
6. Module 4: VLA & Capstone (Weeks 11-13)
7. Appendices

## Hardware-Specific Instructions

When documenting hardware-specific procedures:

1. **Differentiate Workstation vs Edge Device**: Clearly label commands and instructions
2. **Use Side-by-Side Examples**:
   ```markdown
   **Workstation (Sim):**
   ```bash
   ros2 launch isaac_sim example.launch.py
   ```

   **Edge Device (Jetson):**
   ```bash
   ros2 run robot_control controller_node
   ```
   ```

3. **Include Safety Warnings**: Use `:::danger` admonitions for hardware safety

## Course Schedule

The content is designed for a 13-week capstone course:
- **Weeks 1-5**: Module 1 - The Nervous System (ROS 2, URDF, rclpy)
- **Weeks 6-7**: Module 2 - The Digital Twin (Gazebo, Unity, Physics Simulation)
- **Weeks 8-10**: Module 3 - The AI-Robot Brain (Isaac Sim, Isaac ROS, Nav2, VSLAM)
- **Weeks 11-13**: Module 4 - VLA & Capstone (Vision-Language-Action, OpenAI Whisper, LLM Integration)

## Validation

Before submitting content changes:
1. Verify the build process: `npm run build`
2. Check for broken links: `npm run serve` and review in browser
3. Ensure all frontmatter is properly formatted
4. Confirm admonitions are used appropriately
5. Verify LaTeX equations render correctly