---
id: 02-jetson-edge
title: Jetson Edge Setup (Orin Nano/NX)
sidebar_label: Jetson Edge Setup
sidebar_position: 2
description: Complete setup guide for NVIDIA Jetson Orin Nano/NX edge computing platform for robotics applications
keywords:
  - jetson setup
  - jetson orin
  - edge computing
  - robotics
  - nvidia jetson
---

# Jetson Edge Setup (Orin Nano/NX)

## Hardware Requirements

### Supported Platforms
- **NVIDIA Jetson Orin Nano Developer Kit** (4GB/8GB RAM)
- **NVIDIA Jetson Orin NX Developer Kit** (8GB/16GB RAM)
- **Power Supply**: 19V/65W (for Orin NX) or 19V/120W (for Orin Nano with maximum power mode)
- **Storage**: MicroSD card (64GB minimum, UHS-I U3 recommended) or NVMe SSD
- **Connectivity**: Ethernet cable, WiFi, and Bluetooth

### Additional Hardware
- **Intel RealSense D435i** depth camera
- **ReSpeaker 4-Mic Array** or compatible microphone array
- **USB-C to USB-A adapter** (if needed)
- **Heat sink and optional fan** for sustained performance
- **Enclosure** for safe deployment

## JetPack SDK Installation

### Prepare Host Computer
The Jetson requires a host computer running Linux or Windows (with WSL2) to flash the initial OS:

1. **Install NVIDIA SDK Manager**:
   - Download from [NVIDIA Developer Zone](https://developer.nvidia.com/sdk-manager)
   - Create/Sign in to NVIDIA Developer account
   - Select Jetson Orin target device

2. **Connect Jetson to Host**:
   - Connect USB-C cable from Jetson to host computer
   - Ensure Jetson is in recovery mode (force recovery button while connecting power)

3. **Flash Jetson**:
   - Select JetPack version 6.0 or later for Orin platforms
   - Select ROS 2 Humble during package selection
   - Start flashing process (takes 30-60 minutes)

### Post-Installation Configuration
After flashing:

1. **Initial Setup**:
   - Follow on-screen prompts to create user account
   - Connect to WiFi or Ethernet
   - Update system: `sudo apt update && sudo apt upgrade -y`

2. **Configure Jetson**:
   - Set power mode: `sudo nvpmodel -m 0` (maximum performance) or `sudo nvpmodel -m 1` (balanced)
   - Set fan speed: `sudo jetson_clocks` (for sustained performance)

## ROS 2 Configuration

### Verify ROS 2 Installation
JetPack includes ROS 2 Humble by default:
```bash
source /opt/ros/humble/setup.bash
echo $ROS_DISTRO  # Should output "humble"
```

### Create ROS Workspace
```bash
mkdir -p ~/robot_ws/src
cd ~/robot_ws
source /opt/ros/humble/setup.bash
colcon build
```

### Setup Environment
Add to your `~/.bashrc`:
```bash
source /opt/ros/humble/setup.bash
source ~/robot_ws/install/setup.bash
```

## Camera Setup (Intel RealSense D435i)

### Install RealSense SDK
```bash
# Add RealSense repository
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key F6E65AC2917C7A9E
sudo add-apt-repository "deb https://librealsense.intel.com/Debian/apt-repo $(lsb_release -cs) main" -u

# Install RealSense packages
sudo apt install librealsense2-dkms librealsense2-utils librealsense2-dev librealsense2-dbg
```

### Install RealSense ROS Package
```bash
cd ~/robot_ws/src
git clone -b ros2-humble https://github.com/IntelRealSense/realsense-ros.git
cd ~/robot_ws
rosdep install -i --from-path src --rosdistro humble -y
colcon build --symlink-install
```

### Test RealSense Camera
```bash
source ~/robot_ws/install/setup.bash
ros2 launch realsense2_camera rs_launch.py
```

## Audio Setup (ReSpeaker 4-Mic Array)

### Install Audio Drivers
```bash
# Install ALSA tools
sudo apt install alsa-utils pulseaudio

# Install ReSpeaker drivers
git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard
sudo ./install.sh
```

### Configure Audio Device
```bash
# Check available audio devices
arecord -l

# Test recording
arecord -D hw:1,0 -f cd test.wav
aplay test.wav
```

### Install Python Audio Libraries
```bash
pip3 install pyaudio speechrecognition webrtcvad
```

## Network Configuration

### Ethernet Configuration
For reliable robot communication, configure a static IP:

```bash
# Edit netplan configuration
sudo nano /etc/netplan/01-network-manager-all.yaml
```

Add the following configuration (adjust IP addresses as needed):
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

Apply the configuration:
```bash
sudo netplan apply
```

### WiFi Configuration
For WiFi connection, use nmcli or the GUI network manager. Ensure the connection is stable for real-time control.

## ROS 2 Network Setup

### Configure ROS 2 for Multi-Machine
Set these environment variables for communication with the workstation:

Add to your `~/.bashrc`:
```bash
# ROS 2 multi-machine configuration
export ROS_DOMAIN_ID=10  # Adjust if needed to avoid conflicts
export RMW_IMPLEMENTATION=rmw_cyclonedx_cpp

# If using WiFi, set localhost only to reduce network traffic
export ROS_LOCALHOST_ONLY=0  # Set to 1 if only using localhost
```

### Test Network Communication
From workstation, verify you can ping the Jetson:
```bash
ping <jetson_ip_address>
```

From Jetson, verify ROS 2 communication:
```bash
# Terminal 1
source ~/robot_ws/install/setup.bash
ros2 topic list

# Terminal 2
source ~/robot_ws/install/setup.bash
ros2 topic pub /test_topic std_msgs/String "data: 'Hello from Jetson'"
```

## Performance Optimization

### Power Management
```bash
# Check current power mode
sudo nvpmodel -q

# Set to maximum performance (increases power consumption)
sudo nvpmodel -m 0

# Set to balanced mode (recommended for most applications)
sudo nvpmodel -m 1
```

### Thermal Management
```bash
# Monitor temperature
sudo tegrastats  # Run in another terminal

# Check thermal zones
cat /sys/class/thermal/thermal_zone*/temp
```

### Memory Management
For memory-constrained applications:
```bash
# Check memory usage
free -h

# Optimize for memory usage by reducing graphics memory
# In boot configuration (requires reboot):
sudo vi /boot/extlinux/extlinux.conf
# Add "mem=4G" or appropriate value to APPEND line
```

## Edge AI Setup

### Install TensorRT
TensorRT is included with JetPack. Verify installation:
```bash
dpkg -l | grep tensorrt
```

### Install Isaac ROS Packages
```bash
cd ~/robot_ws/src

# Clone essential Isaac ROS packages
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common.git
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_image_proc.git
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_apriltag.git
git clone -b ros2-humble https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_pose_estimation.git

cd ~/robot_ws
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install
```

## Safety and Monitoring

### System Monitoring
Create a monitoring script to track system health:

```bash
# Create monitoring script
cat << 'EOF' > ~/monitor_jetson.sh
#!/bin/bash
while true; do
    echo "=== $(date) ==="
    echo "CPU Temp: $(cat /sys/class/thermal/thermal_zone0/temp | awk '{print $1/1000}')°C"
    echo "GPU Temp: $(cat /sys/class/thermal/thermal_zone1/temp | awk '{print $1/1000}')°C"
    echo "Memory: $(free | awk 'NR==2{printf "%.2f%%", $3*100/$2 }')"
    echo "Uptime: $(uptime -p)"
    sleep 10
done
EOF

chmod +x ~/monitor_jetson.sh
```

### Automatic Reboot on Failure
For unattended operation, consider setting up automatic reboot on failure:
```bash
# Edit systemd configuration
sudo nano /etc/systemd/system/jetson-monitor.service
```

## Testing the Setup

### Basic Hardware Test
```bash
# Check all connected devices
lsusb
lspci

# Test camera
v4l2-ctl --list-devices

# Test audio
arecord -D hw:1,0 -f cd -d 3 test.wav
aplay test.wav
```

### ROS 2 Test
```bash
source ~/robot_ws/install/setup.bash

# Check ROS nodes
ros2 node list

# Check ROS topics
ros2 topic list

# Run simple publisher/subscriber test
# Terminal 1:
ros2 topic echo /chatter std_msgs/String

# Terminal 2:
ros2 topic pub /chatter std_msgs/String "data: 'Hello from Jetson'"
```

## Troubleshooting

### Common Issues

1. **Camera not detected**
   - Check USB connection and power
   - Verify UVC compliance: `lsusb | grep -i camera`
   - Try different USB port

2. **Audio not working**
   - Check audio device: `arecord -l`
   - Verify permissions: `sudo usermod -a -G audio $USER`
   - Reboot after permission changes

3. **High temperatures**
   - Ensure proper cooling with heatsink/fan
   - Reduce power mode with nvpmodel
   - Check thermal paste if using custom cooling

4. **Network communication issues**
   - Verify ROS_DOMAIN_ID matches between machines
   - Check firewall settings
   - Ensure both machines are on same network

## Summary

Your Jetson Orin platform is now configured for edge robotics applications with:
- JetPack SDK with ROS 2 Humble
- Intel RealSense D435i camera integration
- ReSpeaker microphone array setup
- Network configuration for multi-machine ROS 2
- Performance optimization for edge AI
- Safety monitoring setup

The Jetson serves as the "Physical Edge" computing platform that processes sensor data and executes robot control commands in real-time, complementing the workstation's simulation and development capabilities.

---

:::note
The Jetson Orin platform provides powerful edge computing capabilities for real-time robot control. Proper thermal management is crucial for sustained performance.
:::

:::tip
For optimal performance, use the maximum power mode (nvpmodel -m 0) during active robot operation and switch to balanced mode when idle.
:::

:::warning
Monitor temperatures during intensive AI processing. The Jetson can throttle performance or shut down if temperatures exceed safe limits.
:::

:::danger
Never operate the Jetson without proper cooling, especially when running AI models at full capacity. Overheating can permanently damage the SoC.
:::