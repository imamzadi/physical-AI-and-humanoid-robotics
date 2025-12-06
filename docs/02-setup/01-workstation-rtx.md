---
id: 01-workstation-rtx
title: Workstation Setup (RTX 4070 Ti)
sidebar_label: Workstation Setup
sidebar_position: 1
description: Complete setup guide for the NVIDIA RTX 4070 Ti workstation environment for Isaac Sim development
keywords:
  - workstation setup
  - RTX 4070 Ti
  - Isaac Sim
  - NVIDIA
  - development environment
---

# Workstation Setup (RTX 4070 Ti)

## Hardware Requirements

### Minimum Specifications
- **GPU**: NVIDIA RTX 4070 Ti (12GB VRAM) or higher
- **CPU**: Intel Core i7-12700K or AMD Ryzen 7 5800X
- **RAM**: 64GB DDR4/DDR5
- **Storage**: 2TB NVMe SSD (1TB for OS/development, 1TB for datasets/simulations)
- **OS**: Ubuntu 22.04 LTS

### Recommended Specifications
- **GPU**: NVIDIA RTX 4080/4090 for optimal performance
- **CPU**: Intel Core i9 or AMD Ryzen 9 series
- **RAM**: 128GB for large simulation environments
- **Network**: Gigabit Ethernet or WiFi 6 for cloud robotics

## OS Installation and Configuration

### Ubuntu 22.04 LTS Installation
1. Download Ubuntu 22.04 LTS ISO from [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
2. Create bootable USB using Rufus (Windows) or `dd` command (Linux/Mac)
3. Boot from USB and follow installation prompts
4. Select "Normal installation" with third-party drivers enabled

### System Configuration
After installation, run these commands:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install build-essential cmake git curl wget vim htop -y

# Install development tools
sudo apt install python3-dev python3-pip python3-venv python3-setuptools -y
```

## NVIDIA Driver Installation

### Check GPU Compatibility
```bash
lspci | grep -E "VGA|3D"
```

### Install NVIDIA Drivers
```bash
# Add graphics drivers PPA
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

# Install recommended driver (usually the latest stable)
sudo ubuntu-drivers autoinstall

# Reboot after installation
sudo reboot
```

### Verify Installation
```bash
nvidia-smi
```

You should see your RTX 4070 Ti listed with driver version 535 or higher.

## CUDA Toolkit Installation

### Download and Install CUDA
```bash
# Download CUDA toolkit (replace with latest version)
wget https://developer.download.nvidia.com/compute/cuda/12.4.0/local_installers/cuda_12.4.0_550.54.14_linux.run

# Run the installer
sudo sh cuda_12.4.0_550.54.14_linux.run
```

**Note**: During installation, deselect the driver component if you already installed it via ubuntu-drivers.

### Configure Environment Variables
Add these lines to your `~/.bashrc`:

```bash
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

Then reload your shell:
```bash
source ~/.bashrc
```

### Verify CUDA Installation
```bash
nvcc --version
```

## ROS 2 Installation (Humble Hawksbill)

### Setup Locale
```bash
locale  # check for UTF-8
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

### Add ROS 2 Repository
```bash
sudo apt update && sudo apt install -y software-properties-common
sudo add-apt-repository universe

# Add ROS 2 GPG key
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

# Add ROS 2 repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] https://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### Install ROS 2 Humble
```bash
sudo apt update
sudo apt install ros-humble-desktop-full
```

### Install ROS 2 Development Tools
```bash
sudo apt install python3-colcon-common-extensions python3-rosdep python3-vcstool
```

### Initialize rosdep
```bash
sudo rosdep init
rosdep update
```

### Setup ROS 2 Environment
Add to your `~/.bashrc`:
```bash
source /opt/ros/humble/setup.bash
```

Then reload:
```bash
source ~/.bashrc
```

## Isaac Sim Installation

### Prerequisites for Isaac Sim
```bash
# Install additional dependencies
sudo apt install python3-pip python3-dev python3-venv python3-setuptools
pip3 install --upgrade pip
```

### Download Isaac Sim
1. Visit [NVIDIA Isaac Sim Downloads](https://developer.nvidia.com/isaac-sim)
2. Register for NVIDIA Developer account if needed
3. Download Isaac Sim for Linux
4. Extract to a suitable location (e.g., `~/isaac-sim`)

### Install Isaac Sim
```bash
# Navigate to Isaac Sim directory
cd ~/isaac-sim

# Install using provided script
bash install.sh
```

### Verify Isaac Sim Installation
```bash
# Activate Isaac Sim environment
bash setup_omniverse_env.sh

# Launch Isaac Sim
./python.sh -m omni.isaac.kit --enable-extensions
```

## Isaac ROS Installation

### Clone Isaac ROS Repository
```bash
# Create ROS workspace
mkdir -p ~/isaac_ws/src
cd ~/isaac_ws

# Clone Isaac ROS packages
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common.git src/isaac_ros_common
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_visual_slam.git src/isaac_ros_visual_slam
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_pose_estimation.git src/isaac_ros_pose_estimation
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_apriltag.git src/isaac_ros_apriltag
```

### Build Isaac ROS Packages
```bash
cd ~/isaac_ws
source /opt/ros/humble/setup.bash
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install
```

### Setup Isaac ROS Environment
Add to your `~/.bashrc`:
```bash
source ~/isaac_ws/install/setup.bash
```

## Python Environment Setup

### Create Virtual Environment
```bash
cd ~
python3 -m venv physical_ai_env
source physical_ai_env/bin/activate
pip install --upgrade pip setuptools
```

### Install Required Python Packages
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install numpy scipy matplotlib pandas jupyterlab
pip install opencv-python open3d
pip install transformers datasets accelerate
```

## Development Environment

### Install VS Code
```bash
# Download VS Code .deb package from https://code.visualstudio.com/
# Install using:
sudo dpkg -i code_*.deb
sudo apt install -f  # fix any dependency issues
```

### Useful VS Code Extensions
- ROS
- Python
- C/C++
- GitLens
- Docker
- Jupyter

## Testing the Setup

### Test ROS 2
```bash
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker
```

### Test CUDA
```bash
nvidia-smi
nvcc --version
```

### Test Isaac Sim
Launch Isaac Sim and verify you can open the example scenes.

## Troubleshooting

### Common Issues and Solutions

1. **"No CUDA-capable device is detected"**
   - Ensure NVIDIA drivers are properly installed
   - Reboot the system after driver installation
   - Check with `lspci | grep -i nvidia`

2. **"Could not load dynamic library 'libcudart.so.XX'"**
   - Add CUDA paths to your `~/.bashrc`
   - Verify `LD_LIBRARY_PATH` includes CUDA lib directory

3. **ROS 2 workspace not building**
   - Ensure rosdep is initialized: `sudo rosdep init && rosdep update`
   - Check for missing dependencies with `rosdep check`

## Performance Optimization

### GPU Configuration
```bash
# Check GPU status
nvidia-smi -l 1  # Monitor every second

# For Isaac Sim optimization, consider:
# - Adjusting rendering quality in Isaac Sim settings
# - Using lower resolution for faster simulation
# - Limiting physics substeps for real-time performance
```

### System Optimization
- Disable unnecessary startup applications
- Increase swap space if using large datasets
- Use SSD for Isaac Sim assets directory

## Summary

Your workstation is now properly configured for Physical AI & Humanoid Robotics development with:
- Ubuntu 22.04 LTS with NVIDIA RTX 4070 Ti drivers
- CUDA toolkit for GPU acceleration
- ROS 2 Humble for robotics middleware
- Isaac Sim for physics simulation
- Isaac ROS for perception packages
- Optimized Python environment for AI development

---

:::note
This setup is optimized for Isaac Sim and high-performance robotics simulation. Ensure you have adequate cooling and power supply for your RTX 4070 Ti.
:::

:::tip
For best performance in Isaac Sim, close unnecessary applications and consider running in a dedicated user session.
:::

:::warning
Always backup your system before making major changes. The RTX 4070 Ti requires a robust power supply (850W+ recommended).
:::

:::danger
Never operate the GPU at temperatures above 83°C. Monitor temperatures during intensive simulations using `nvidia-smi -l 1`.
:::