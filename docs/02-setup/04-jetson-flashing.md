---
id: 04-jetson-flashing
title: Jetson Flashing and Recovery
sidebar_label: Jetson Flashing
sidebar_position: 4
description: Detailed guide for flashing NVIDIA Jetson platforms with JetPack SDK and recovery procedures
keywords:
  - jetson flashing
  - jetpack sdk
  - recovery
  - nvidia jetson
  - system installation
---

# Jetson Flashing and Recovery

## Introduction

This guide provides detailed instructions for flashing NVIDIA Jetson platforms with the JetPack SDK, including recovery procedures for various scenarios. Proper flashing is critical for reliable robot operation and course success.

## Prerequisites for Flashing

### Host Computer Requirements
- **Operating System**: Ubuntu 20.04 LTS or 22.04 LTS (recommended) or Windows 10/11 with WSL2
- **Memory**: 8GB RAM minimum (16GB recommended)
- **Storage**: 50GB free space minimum
- **Internet**: Stable connection for downloading components
- **USB Port**: USB 3.0 or higher for fast flashing

### Hardware Requirements
- **NVIDIA Jetson Developer Kit** (Orin Nano/NX for this course)
- **High-quality USB-C cable** (at least 1 meter, USB 3.0 rated)
- **Power adapter**: Appropriate voltage/current for your Jetson model
- **MicroSD card**: 64GB minimum for Orin platforms (UHS-I U3 recommended)
- **Ethernet cable**: For initial setup and reliable updates

## JetPack SDK Installation on Host

### On Ubuntu Host

1. **Download SDK Manager**:
   ```bash
   # Visit NVIDIA Developer Zone to download SDK Manager
   # Or download directly if available:
   wget https://developer.download.nvidia.com/devzone/nvidia-sdk-manager/nvidia_sdk_manager_1.9.5_amd64.deb
   ```

2. **Install SDK Manager**:
   ```bash
   sudo dpkg -i nvidia_sdk_manager_*.deb
   sudo apt install -f  # Fix any dependency issues
   ```

3. **Launch SDK Manager**:
   ```bash
   nvidia-sdk-manager
   ```

### On Windows with WSL2

1. **Install WSL2 with Ubuntu**:
   ```powershell
   wsl --install Ubuntu-22.04
   ```

2. **Install dependencies in WSL**:
   ```bash
   sudo apt update
   sudo apt install curl wget apt-transport-https gnupg lsb-release
   ```

3. **Download and install SDK Manager** following Ubuntu instructions above

## Preparing Jetson for Flashing

### Physical Preparation

1. **Locate Force Recovery Button**:
   - On Jetson Orin Nano: Small button near USB-C port
   - On Jetson Orin NX: Small button near DC power jack

2. **Connect USB-C Cable**:
   - Connect USB-C cable from Jetson to host computer
   - Do NOT connect power yet

3. **Enter Force Recovery Mode**:
   - Press and hold the Force Recovery button
   - While holding the button, connect the power adapter
   - Continue holding for 3-5 seconds after power connection
   - Release the button

4. **Verify Recovery Mode**:
   On the host computer, check for device detection:
   ```bash
   lsusb
   ```
   Look for "NVIDIA Corp." device in recovery mode.

## Using SDK Manager for Flashing

### Launch SDK Manager
```bash
nvidia-sdk-manager
```

### Initial Setup in SDK Manager

1. **Sign In**: Create or sign in to NVIDIA Developer account
2. **Accept Terms**: Review and accept all license agreements
3. **Select Target**: Choose "Jetson" as target OS
4. **Select Platform**: Choose your specific Jetson model (Orin Nano/NX)

### Configure Flash Settings

1. **JetPack Version**: Select JetPack 6.0 or later for Orin platforms
2. **Target OS**: Ubuntu 22.04 LTS (default and recommended)
3. **Additional Components**: Select based on course requirements:
   - **ROS 2 Humble**: Essential for course
   - **Isaac ROS**: For perception packages
   - **CUDA**: For GPU acceleration
   - **OpenCV**: For computer vision
   - **DeepStream**: For AI applications (optional)

### Start Flashing Process

1. **Download Components**: SDK Manager will download all required components
2. **Verify Connection**: Ensure Jetson is in recovery mode
3. **Begin Flashing**: Click "Continue" to start the flashing process
4. **Monitor Progress**: The process takes 30-60 minutes depending on components selected

### Post-Flash Configuration

1. **First Boot**: Allow 5-10 minutes for first boot and system initialization
2. **Initial Setup**: Follow on-screen prompts to create user account
3. **Network Configuration**: Connect to WiFi or Ethernet
4. **System Updates**: Run system updates after first boot

## Manual Flashing (Alternative Method)

### Prerequisites for Manual Flashing

1. **Install Dependencies**:
   ```bash
   sudo apt install python3-pip python3-dev
   pip3 install nvidia-pytools
   ```

2. **Download JetPack Components Manually**:
   - Download L4T (Linux for Tegra) BSP
   - Download rootfs and other required components

### Manual Flashing Process

1. **Extract and Prepare**:
   ```bash
   tar -xf Jetson-<platform>_Linux_R<version>_aarch64.tbz2
   cd Linux_for_Tegra
   ```

2. **Configure Boot Options**:
   ```bash
   sudo ./flash.sh <board> mmcblk0p1
   ```
   Replace `<board>` with your specific board (e.g., `jetson-orin-nx-devkit`)

## Recovery Procedures

### Recovery Mode Access

If the Jetson fails to boot normally:

1. **Disconnect Power**: Remove power adapter
2. **Connect USB-C**: Connect to host computer
3. **Press Recovery Button**: Hold while reconnecting power
4. **Wait**: Hold for 5 seconds after power connection
5. **Release**: Release the button

### SDK Manager Recovery

1. **Launch SDK Manager**: Open NVIDIA SDK Manager
2. **Select Recovery**: Choose recovery mode option
3. **Select Target**: Choose your Jetson platform
4. **Download Components**: Download necessary components
5. **Start Recovery**: Begin the recovery process

### Command Line Recovery

For advanced users, command line recovery:

```bash
cd Linux_for_Tegra
sudo ./flash.sh -r <board> mmcblk0p1
```

## Troubleshooting Flashing Issues

### Common Flashing Problems

#### USB Connection Issues
- **Symptom**: Device not detected in recovery mode
- **Solution**:
  - Try different USB port/cable
  - Check USB permissions: `sudo usermod -a -G dialout $USER`
  - Reboot host computer and retry

#### Network Issues During Flashing
- **Symptom**: Download fails or flashing stalls
- **Solution**:
  - Ensure stable internet connection
  - Retry during off-peak hours
  - Use Ethernet instead of WiFi

#### Insufficient Storage
- **Symptom**: Flashing fails due to space constraints
- **Solution**:
  - Free up disk space on host computer
  - Ensure 50GB+ free space available
  - Move temporary files to larger drive if needed

#### Power Issues
- **Symptom**: Jetson resets or fails to boot after flashing
- **Solution**:
  - Use official power adapter
  - Ensure power supply meets specifications
  - Check for loose connections

### Recovery Troubleshooting

#### Recovery Mode Not Working
- **Verify button press**: Ensure you're pressing the correct recovery button
- **Try multiple times**: Sometimes requires several attempts
- **Check hardware**: Ensure no physical damage to Jetson

#### SDK Manager Stuck
- **Cancel and restart**: Cancel current operation and restart SDK Manager
- **Clear cache**: Clear SDK Manager cache and temporary files
- **Update SDK Manager**: Ensure using latest version

## Post-Flash Verification

### System Verification

1. **Boot Test**: Verify Jetson boots to desktop environment
2. **Network Test**: Confirm internet connectivity
3. **Hardware Test**: Verify all hardware components are detected:
   ```bash
   # Check GPU
   sudo /usr/bin/jetson_clocks --show

   # Check memory
   free -h

   # Check storage
   df -h
   ```

### ROS 2 Verification

```bash
# Source ROS 2
source /opt/ros/humble/setup.bash

# Check ROS 2 installation
echo $ROS_DISTRO  # Should output "humble"

# Check available packages
ros2 pkg list | grep ros
```

### GPU Verification

```bash
# Check GPU status
nvidia-smi

# Check CUDA
nvcc --version

# Test CUDA functionality
cd /usr/local/cuda/samples/1_Utilities/deviceQuery
sudo make
./deviceQuery
```

## Customization After Flashing

### System Optimization

1. **Performance Mode**:
   ```bash
   sudo nvpmodel -m 0  # Maximum performance
   sudo jetson_clocks  # Lock clocks for consistent performance
   ```

2. **Swap Configuration** (if needed):
   ```bash
   # Create swap file (adjust size as needed)
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **User Configuration**:
   - Add user to appropriate groups: `sudo usermod -a -G dialout,audio $USER`
   - Configure development environment
   - Set up SSH access if needed

### Security Considerations

1. **Change Default Passwords**: Update default user passwords
2. **Configure Firewall**: Set up appropriate firewall rules
3. **Disable Unnecessary Services**: Disable services not needed for robotics
4. **SSH Configuration**: Secure SSH access for remote operations

## Backup and Restore Procedures

### Creating System Backup

```bash
# On host computer with Jetson connected via recovery mode
cd Linux_for_Tegra
sudo ./flash.sh -r -k APP -G backup.img <board> mmcblk0p1
```

### Restoring from Backup

```bash
# Flash backup image
sudo ./flash.sh -r -k APP -U backup.img <board> mmcblk0p1
```

## Maintenance and Updates

### Regular Maintenance

1. **System Updates**: Regularly update the system:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Jetson Package Updates**: Update Jetson-specific packages:
   ```bash
   sudo apt install --only-upgrade "*nvidia*"
   ```

3. **Monitor System Health**: Regularly check temperatures and performance

### When to Re-flash

Consider re-flashing when:
- Major system corruption occurs
- Performance significantly degrades
- Multiple package conflicts arise
- Before important demonstrations or projects

## Academic Rigor in Hardware Setup

### Documentation Requirements

When flashing and configuring Jetson platforms for course work:

1. **Record Specifications**: Document exact JetPack version, OS version, and hardware configuration
2. **Performance Benchmarks**: Record baseline performance metrics
3. **Configuration Changes**: Document any custom configurations made
4. **Issues Encountered**: Record any problems and solutions for future reference

### Reproducibility

Maintain detailed records to enable:
- Reproduction of results by others
- Troubleshooting of issues
- Comparison of different configurations
- Academic validation of findings

## Summary

Proper Jetson flashing is critical for successful completion of the Physical AI & Humanoid Robotics course. The process requires careful attention to hardware preparation, software requirements, and post-installation verification. Always maintain detailed records of your hardware configuration and any customizations made during the flashing process.

Recovery procedures should be understood before beginning the flashing process, as they may be needed if issues occur. With proper preparation and execution, the Jetson platform will provide a reliable edge computing platform for your robotics projects.

---

:::note
Flashing the Jetson is a critical step that requires careful attention to detail. Follow all steps precisely and maintain detailed records of your configuration.
:::

:::tip
Before flashing, ensure you have a stable internet connection and adequate time, as the process can take 30-60 minutes to complete.
:::

:::warning
Incorrect flashing procedures can permanently damage your Jetson. Always follow the official NVIDIA documentation and verify each step.
:::

:::danger
Never interrupt the flashing process once started. Interruption can permanently damage the Jetson and require professional repair or replacement.
:::