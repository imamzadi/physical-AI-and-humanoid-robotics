# Data Model: Physical AI & Humanoid Robotics Textbook

## Course Module
- **id**: Unique identifier for the module
- **title**: Display title of the module
- **description**: Brief overview of the module content
- **weeks**: Range of weeks covered (e.g., "Weeks 1-5")
- **prerequisites**: List of required knowledge/skills
- **learning_outcomes**: List of skills students will gain
- **content_path**: Path to the module's content files

## Hardware Configuration
- **id**: Unique identifier for the configuration
- **name**: Display name (e.g., "Workstation RTX", "Jetson Edge")
- **components**: List of required hardware components
- **setup_guide_path**: Path to the setup guide file
- **requirements**: System requirements and dependencies
- **compatibility_notes**: Notes about compatible alternatives

## Sim-to-Real Scenario
- **id**: Unique identifier for the scenario
- **name**: Display name of the scenario
- **simulation_path**: Path to simulation instructions
- **physical_implementation_path**: Path to physical robot implementation
- **validation_criteria**: Criteria for successful transfer
- **troubleshooting_path**: Path to troubleshooting guide

## Content Page
- **id**: Unique identifier for the page
- **title**: Page title
- **slug**: URL-friendly identifier
- **sidebar_label**: Label for sidebar navigation
- **sidebar_position**: Position in sidebar (numeric)
- **description**: Brief description for metadata
- **tags**: List of relevant tags for search/filtering
- **frontmatter**: Additional YAML metadata
- **content_path**: File system path to the content