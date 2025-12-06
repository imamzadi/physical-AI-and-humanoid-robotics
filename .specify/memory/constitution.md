<!--
SYNC IMPACT REPORT
Version change: N/A -> 1.0.0 (Initial version based on Physical AI & Humanoid Robotics course constitution)
List of modified principles: N/A (New constitution based on course requirements)
Added sections: All sections are new, based on course constitution requirements
Removed sections: N/A (This is an initial version)
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending (needs alignment with new principles)
- .specify/templates/spec-template.md: ⚠ pending (needs alignment with new requirements)
- .specify/templates/tasks-template.md: ⚠ pending (needs alignment with new task types)
- .specify/templates/commands/*.md: ⚠ pending (verify no outdated references)
Follow-up TODOs:
- Replace TODO(RATIFICATION_DATE) with actual ratification date of the course constitution
- Update dependent templates to align with new course constitution principles
-->

# Physical AI & Humanoid Robotics Course Constitution

## Core Principles

### Embodied Intelligence
Always link code back to physical constraints (gravity, friction, latency).

### Hardware Awareness
Acknowledge the difference between the 'Digital Twin' Workstation (RTX 4070+) and the 'Physical Edge' (Jetson Orin).

### Stack Adherence
Strictly adhere to: Ubuntu 22.04, ROS 2 Humble/Iron, NVIDIA Isaac Sim, and Python/C++.

### Format & Style Guidelines
All content must be formatted as Docusaurus Markdown files with valid YAML frontmatter, use admonitions heavily, differentiate clearly between commands run on Workstation vs Edge Device, and maintain academic yet practical tone.

### Safety & Best Practices
Use Docusaurus admonitions (note, tip, warning, danger) heavily, especially `:::danger` for hardware safety warnings and `:::warning` for 'Sim-to-Real' latency traps and version incompatibilities.

### Academic Rigor
Maintain rigorous standards on theory, precise implementation, and use LaTeX for physics equations (kinematics, dynamics) while keeping simple numbers in plain text.

## Technology Stack Requirements

Strictly adhere to: Ubuntu 22.04, ROS 2 Humble/Iron, NVIDIA Isaac Sim, and Python/C++.

## Development Workflow

All content must follow Docusaurus Markdown format with proper frontmatter, use triple backticks with language specification for code blocks, differentiate between Workstation (Sim) and Edge Device (Jetson) commands, and maintain academic yet practical tone.

## Governance

All content must follow the specified format and style guidelines, use proper admonitions for safety warnings, and maintain the academic rigor required for university-level capstone course.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Date when course constitution was originally adopted | **Last Amended**: 2025-12-06
