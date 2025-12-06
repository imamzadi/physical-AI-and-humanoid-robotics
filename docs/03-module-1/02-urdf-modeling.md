---
id: 02-urdf-modeling
title: URDF Robot Modeling and Kinematics
sidebar_label: URDF Modeling
sidebar_position: 2
description: Comprehensive guide to Unified Robot Description Format (URDF) for robot modeling and kinematic representation
keywords:
  - urdf
  - robot modeling
  - kinematics
  - robot description
  - xacro
  - robotic simulation
---

# URDF Robot Modeling and Kinematics

## Introduction

Unified Robot Description Format (URDF) is the standard for representing robot models in ROS. It defines the physical and visual properties of a robot, including its kinematic structure, dynamics, and appearance. Understanding URDF is crucial for creating accurate robot models for simulation, visualization, and control.

## URDF Fundamentals

### What is URDF?

URDF (Unified Robot Description Format) is an XML-based format that describes robots in terms of:
- **Links**: Rigid parts of the robot (e.g., chassis, arms, wheels)
- **Joints**: Connections between links (e.g., revolute, prismatic, fixed)
- **Visual properties**: How the robot appears in simulation and visualization
- **Collision properties**: How the robot interacts with the environment
- **Inertial properties**: Mass, center of mass, and inertia for physics simulation

### Basic URDF Structure

```xml
<?xml version="1.0"?>
<robot name="simple_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.5 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.5 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Wheel link -->
  <link name="wheel_link">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
      <origin rpy="1.57079632679 0 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
      <origin rpy="1.57079632679 0 0"/>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Joint connecting base and wheel -->
  <joint name="wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="wheel_link"/>
    <origin xyz="0.2 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>
</robot>
```

## Link Elements

### Visual Properties

The `<visual>` element defines how a link appears in visualization and simulation:

```xml
<visual>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <box size="1 1 1"/>
    <!-- or <cylinder radius="1" length="1"/> -->
    <!-- or <sphere radius="1"/> -->
    <!-- or <mesh filename="package://path/to/mesh.stl"/> -->
  </geometry>
  <material name="red">
    <color rgba="1 0 0 1"/>
  </material>
</visual>
```

### Collision Properties

The `<collision>` element defines the collision geometry:

```xml
<collision>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <box size="1 1 1"/>
  </geometry>
</collision>
```

### Inertial Properties

The `<inertial>` element defines the physical properties for simulation:

```xml
<inertial>
  <mass value="1.0"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
</inertial>
```

## Joint Elements

### Joint Types

URDF supports several joint types:

1. **Fixed**: No movement (0 DOF)
   ```xml
   <joint name="fixed_joint" type="fixed">
     <parent link="parent_link"/>
     <child link="child_link"/>
     <origin xyz="1 0 0" rpy="0 0 0"/>
   </joint>
   ```

2. **Revolute**: Single axis rotation with limits (1 DOF)
   ```xml
   <joint name="revolute_joint" type="revolute">
     <parent link="parent_link"/>
     <child link="child_link"/>
     <origin xyz="0 0 0" rpy="0 0 0"/>
     <axis xyz="0 0 1"/>
     <limit lower="-1.57" upper="1.57" effort="10.0" velocity="1.0"/>
   </joint>
   ```

3. **Continuous**: Unlimited rotation (1 DOF)
   ```xml
   <joint name="continuous_joint" type="continuous">
     <parent link="parent_link"/>
     <child link="child_link"/>
     <origin xyz="0 0 0" rpy="0 0 0"/>
     <axis xyz="0 0 1"/>
   </joint>
   ```

4. **Prismatic**: Linear sliding motion with limits (1 DOF)
   ```xml
   <joint name="prismatic_joint" type="prismatic">
     <parent link="parent_link"/>
     <child link="child_link"/>
     <origin xyz="0 0 0" rpy="0 0 0"/>
     <axis xyz="0 0 1"/>
     <limit lower="0" upper="0.5" effort="10.0" velocity="1.0"/>
   </joint>
   ```

5. **Planar**: Movement in a plane (2 DOF)
6. **Floating**: Free movement in 3D space (6 DOF)

## Complete Robot Example: Simple Manipulator

```xml
<?xml version="1.0"?>
<robot name="simple_manipulator">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.1"/>
      </geometry>
      <material name="grey">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" iyz="0.0" izz="0.01"/>
    </inertial>
  </link>

  <!-- First link (shoulder) -->
  <link name="shoulder_link">
    <visual>
      <geometry>
        <box size="0.05 0.05 0.3"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.05 0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Shoulder joint -->
  <joint name="shoulder_joint" type="revolute">
    <parent link="base_link"/>
    <child link="shoulder_link"/>
    <origin xyz="0 0 0.05"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100.0" velocity="1.0"/>
  </joint>

  <!-- Second link (elbow) -->
  <link name="elbow_link">
    <visual>
      <geometry>
        <box size="0.05 0.05 0.2"/>
      </geometry>
      <material name="red">
        <color rgba="1 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.05 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.3"/>
      <inertia ixx="0.002" ixy="0.0" ixz="0.0" iyy="0.002" iyz="0.0" izz="0.0005"/>
    </inertial>
  </link>

  <!-- Elbow joint -->
  <joint name="elbow_joint" type="revolute">
    <parent link="shoulder_link"/>
    <child link="elbow_link"/>
    <origin xyz="0 0 0.3"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100.0" velocity="1.0"/>
  </joint>

  <!-- End effector -->
  <link name="end_effector">
    <visual>
      <geometry>
        <sphere radius="0.02"/>
      </geometry>
      <material name="green">
        <color rgba="0 1 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.02"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.05"/>
      <inertia ixx="0.0001" ixy="0.0" ixz="0.0" iyy="0.0001" iyz="0.0" izz="0.0001"/>
    </inertial>
  </link>

  <!-- End effector joint -->
  <joint name="ee_joint" type="fixed">
    <parent link="elbow_link"/>
    <child link="end_effector"/>
    <origin xyz="0 0 0.2"/>
  </joint>
</robot>
```

## Xacro for Complex Models

Xacro (XML Macros) allows you to create more maintainable and reusable URDF models using macros, properties, and mathematical expressions.

### Basic Xacro Example

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="xacro_robot">

  <!-- Properties -->
  <xacro:property name="M_PI" value="3.1415926535897931" />
  <xacro:property name="base_width" value="0.5" />
  <xacro:property name="base_length" value="0.5" />
  <xacro:property name="base_height" value="0.2" />

  <!-- Macro for wheel -->
  <xacro:macro name="wheel" params="prefix parent *origin">
    <link name="${prefix}_wheel">
      <visual>
        <geometry>
          <cylinder radius="0.1" length="0.05"/>
        </geometry>
        <origin rpy="${M_PI/2} 0 0"/>
      </visual>
      <collision>
        <geometry>
          <cylinder radius="0.1" length="0.05"/>
        </geometry>
        <origin rpy="${M_PI/2} 0 0"/>
      </collision>
      <inertial>
        <mass value="0.1"/>
        <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
      </inertial>
    </link>

    <joint name="${prefix}_wheel_joint" type="continuous">
      <parent link="${parent}"/>
      <child link="${prefix}_wheel"/>
      <xacro:insert_block name="origin"/>
      <axis xyz="0 0 1"/>
    </joint>
  </xacro:macro>

  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="${base_width} ${base_length} ${base_height}"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="${base_width} ${base_length} ${base_height}"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Wheels using macro -->
  <xacro:wheel prefix="front_left" parent="base_link">
    <origin xyz="${base_width/2} ${base_length/2} 0"/>
  </xacro:wheel>

  <xacro:wheel prefix="front_right" parent="base_link">
    <origin xyz="${base_width/2} ${-base_length/2} 0"/>
  </xacro:wheel>

  <xacro:wheel prefix="rear_left" parent="base_link">
    <origin xyz="${-base_width/2} ${base_length/2} 0"/>
  </xacro:wheel>

  <xacro:wheel prefix="rear_right" parent="base_link">
    <origin xyz="${-base_width/2} ${-base_length/2} 0"/>
  </xacro:wheel>

</robot>
```

## Kinematic Concepts

### Forward Kinematics

Forward kinematics calculates the end-effector position and orientation given joint angles. This is handled automatically by ROS tools like TF2.

### Inverse Kinematics

Inverse kinematics calculates joint angles needed to achieve a desired end-effector position. This often requires specialized solvers or packages like MoveIt.

## Robot State Publisher

The `robot_state_publisher` node reads the URDF and joint positions to publish the robot's state to TF2:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from std_msgs.msg import Header
from tf2_ros import TransformBroadcaster

class RobotStatePublisher(Node):
    def __init__(self):
        super().__init__('robot_state_publisher')
        self.joint_state_subscriber = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )
        self.tf_broadcaster = TransformBroadcaster(self)

    def joint_state_callback(self, msg):
        # Process joint states and broadcast transforms
        pass
```

## Hardware-Specific Considerations

### Workstation vs. Edge Modeling

#### Workstation (Simulation Environment)
- **Detailed Models**: High-resolution meshes and accurate physics properties
- **Complex Sensors**: Detailed sensor models with realistic noise characteristics
- **Full Kinematics**: Complete robot models for simulation

#### Edge (Real Robot Control)
- **Simplified Models**: Reduced mesh complexity for real-time performance
- **Essential Kinematics**: Only necessary kinematic chains for control
- **Calibrated Parameters**: Accurate inertial and geometric parameters from real measurements

### Sensor Integration in URDF

```xml
<!-- Camera mounted on robot -->
<link name="camera_link">
  <visual>
    <geometry>
      <box size="0.02 0.05 0.02"/>
    </geometry>
  </visual>
  <collision>
    <geometry>
      <box size="0.02 0.05 0.02"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="0.05"/>
    <inertia ixx="0.0001" ixy="0.0" ixz="0.0" iyy="0.0001" iyz="0.0" izz="0.0001"/>
  </inertial>
</link>

<joint name="camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.1 0 0.1" rpy="0 0 0"/>
</joint>

<!-- Camera optical frame -->
<joint name="camera_optical_joint" type="fixed">
  <parent link="camera_link"/>
  <child link="camera_optical_frame"/>
  <origin xyz="0 0 0" rpy="${-M_PI/2} 0 ${-M_PI/2}"/>
</joint>

<link name="camera_optical_frame"/>
```

## Validation and Debugging

### URDF Validation

```bash
# Check URDF syntax
check_urdf /path/to/robot.urdf

# Parse Xacro to URDF
xacro input.xacro > output.urdf
```

### Visualization Tools

```bash
# Visualize robot model
rviz2 -d `ros2 pkg prefix rviz_default_plugins`/share/rviz_default_plugins/default.rviz

# Use robot state publisher with joint state publisher GUI
ros2 run joint_state_publisher_gui joint_state_publisher_gui
ros2 run robot_state_publisher robot_state_publisher --ros-args -p robot_description:='$(cat robot.urdf)'
```

## Best Practices

### Modeling Best Practices

1. **Use Proper Units**: Always use SI units (meters, kilograms, radians)
2. **Realistic Inertial Properties**: Use calculated or measured values
3. **Consistent Naming**: Use descriptive and consistent link/joint names
4. **Modular Design**: Break complex robots into logical subsystems
5. **Documentation**: Comment complex models for maintainability

### Performance Considerations

1. **Mesh Simplification**: Use simplified meshes for real-time applications
2. **Collision Optimization**: Use simple geometric shapes when possible
3. **LOD Models**: Consider different levels of detail for different use cases

## Academic Rigor in Robot Modeling

### Theoretical Foundations
- **Kinematics**: Understanding of forward and inverse kinematics
- **Dynamics**: Knowledge of mass, inertia, and force relationships
- **Geometry**: Understanding of 3D transformations and coordinate systems

### Practical Validation
- **Physical Measurements**: Compare model parameters with real robot measurements
- **Simulation Validation**: Verify model behavior matches expectations
- **Experimental Verification**: Test with real hardware when possible

## Practical Exercise: Mobile Robot Model

Let's create a complete URDF model for a differential drive mobile robot:

```xml
<?xml version="1.0"?>
<robot name="diff_drive_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!-- Properties -->
  <xacro:property name="M_PI" value="3.1415926535897931" />
  <xacro:property name="base_width" value="0.3" />
  <xacro:property name="base_length" value="0.4" />
  <xacro:property name="base_height" value="0.15" />
  <xacro:property name="wheel_radius" value="0.05" />
  <xacro:property name="wheel_width" value="0.025" />
  <xacro:property name="wheel_y_offset" value="0.15" />
  <xacro:property name="wheel_z_offset" value="0.0" />

  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="${base_length} ${base_width} ${base_height}"/>
      </geometry>
      <material name="orange">
        <color rgba="1 0.5 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="${base_length} ${base_width} ${base_height}"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia
        ixx="0.1" ixy="0.0" ixz="0.0"
        iyy="0.1" iyz="0.0"
        izz="0.1"/>
    </inertial>
  </link>

  <!-- Inertial measurement unit (IMU) -->
  <link name="imu_link">
    <inertial>
      <mass value="0.01"/>
      <inertia ixx="0.0001" ixy="0.0" ixz="0.0" iyy="0.0001" iyz="0.0" izz="0.0001"/>
    </inertial>
  </link>

  <joint name="imu_joint" type="fixed">
    <parent link="base_link"/>
    <child link="imu_link"/>
    <origin xyz="0 0 0.05"/>
  </joint>

  <!-- Left wheel -->
  <link name="left_wheel">
    <visual>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
      <origin rpy="${M_PI/2} 0 0"/>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
      <origin rpy="${M_PI/2} 0 0"/>
    </collision>
    <inertial>
      <mass value="0.2"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <origin xyz="0 ${wheel_y_offset} ${wheel_z_offset}" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
  </joint>

  <!-- Right wheel -->
  <link name="right_wheel">
    <visual>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
      <origin rpy="${M_PI/2} 0 0"/>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
      <origin rpy="${M_PI/2} 0 0"/>
    </collision>
    <inertial>
      <mass value="0.2"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <joint name="right_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="right_wheel"/>
    <origin xyz="0 ${-wheel_y_offset} ${wheel_z_offset}" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
  </joint>

  <!-- Camera -->
  <link name="camera_link">
    <visual>
      <geometry>
        <box size="0.05 0.1 0.03"/>
      </geometry>
      <material name="grey">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.1 0.03"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <joint name="camera_joint" type="fixed">
    <parent link="base_link"/>
    <child link="camera_link"/>
    <origin xyz="${base_length/2 - 0.025} 0 ${base_height/2}" rpy="0 0 0"/>
  </joint>

  <!-- Camera optical frame -->
  <joint name="camera_optical_joint" type="fixed">
    <parent link="camera_link"/>
    <child link="camera_optical_frame"/>
    <origin xyz="0 0 0" rpy="${-M_PI/2} 0 ${-M_PI/2}"/>
  </joint>

  <link name="camera_optical_frame"/>

</robot>
```

## Summary

URDF is the standard format for representing robot models in ROS, enabling:
- **Accurate Simulation**: Physics-based simulation of robot behavior
- **Visualization**: Proper rendering in RViz and simulators
- **Kinematic Analysis**: Forward and inverse kinematics calculations
- **Control Integration**: Mapping between real and simulated robots

Proper URDF modeling is essential for the sim-to-real transfer that is central to Physical AI. The model must accurately represent the physical robot while being computationally efficient for real-time applications.

---

:::note
URDF forms the foundation for robot simulation and visualization. Accurate models are essential for effective sim-to-real transfer learning.
:::

:::tip
Start with simple models and gradually add complexity. Validate your URDF with visualization tools before moving to complex simulations.
:::

:::warning
Always verify that your URDF model matches the physical robot's dimensions and kinematics. Mismatches can cause sim-to-real transfer failures.
:::

:::danger
Never ignore inertial properties in dynamic simulations. Incorrect inertial parameters can cause unstable or unrealistic simulation behavior.
:::