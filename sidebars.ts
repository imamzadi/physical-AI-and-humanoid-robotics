import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar structure for Physical AI & Humanoid Robotics Textbook
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Intro & Philosophy',
      collapsed: false,
      items: [
        'intro/01-embodied-intelligence',
        'intro/02-philosophy-of-physical-ai',
        'intro/03-course-overview',
      ],
    },
    {
      type: 'category',
      label: 'Lab Setup',
      collapsed: true,
      items: [
        'setup/01-workstation-rtx',
        'setup/02-jetson-edge',
        'setup/03-hardware-options',
        'setup/04-jetson-flashing',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: The Nervous System (Weeks 1-5)',
      collapsed: true,
      items: [
        'module-1/04-week1-5-overview',
        'module-1/01-ros2-nodes',
        'module-1/02-urdf-modeling',
        'module-1/03-rclpy-basics',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Weeks 6-7)',
      collapsed: true,
      items: [
        'module-2/04-physics-simulation',
        'module-2/01-digital-twin-concepts',
        'module-2/02-gazebo-simulation',
        'module-2/03-unity-integration',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (Weeks 8-10)',
      collapsed: true,
      items: [
        'module-3/01-ai-robot-brain-concepts',
        'module-3/02-nvidia-isaac-sim',
        'module-3/03-isaac-ros-integration',
        'module-3/04-nav2-navigation'
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA & Capstone (Weeks 11-13)',
      collapsed: true,
      items: [
        'module-4/01-vla-overview',
        'module-4/02-openai-whisper-integration',
        'module-4/03-llm-integration',
        'module-4/04-capstone-project',
        'module-4/05-vla-implementation-guide',
      ],
    },
  ],
};

export default sidebars;
