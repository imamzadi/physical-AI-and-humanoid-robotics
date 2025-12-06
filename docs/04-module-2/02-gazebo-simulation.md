---
id: 02-gazebo-simulation
title: Gazebo Simulation Environment
sidebar_label: Gazebo Simulation
sidebar_position: 2
description: Comprehensive guide to Gazebo simulation environment, including setup, model creation, and integration with ROS 2
keywords:
  - gazebo
  - simulation
  - robot simulation
  - ros2 integration
  - physics simulation
  - model creation
---

# Gazebo Simulation Environment

## Introduction

Gazebo is a powerful open-source robotics simulator that provides realistic physics simulation, high-quality graphics, and seamless integration with ROS and ROS 2. This chapter explores the Gazebo simulation environment, covering installation, configuration, model creation, and integration with ROS 2. Understanding Gazebo is essential for developing and testing robotic systems in safe virtual environments.

## Gazebo Overview

### What is Gazebo?

Gazebo is a 3D simulation environment that provides:
- **Realistic Physics**: Accurate simulation of rigid body dynamics, contact forces, and friction
- **High-Quality Graphics**: OpenGL-based rendering for visual simulation
- **Sensor Simulation**: Accurate simulation of cameras, LIDAR, IMU, and other sensors
- **ROS Integration**: Native support for ROS and ROS 2 communication
- **Plugin Architecture**: Extensible functionality through custom plugins

### Gazebo Versions

- **Gazebo Classic**: The original version, widely used with ROS 1
- **Gazebo Garden**: The newer version, designed for ROS 2 with improved architecture
- **Ignition Gazebo**: Modular simulation framework (now part of Gazebo project)

## Gazebo Installation and Setup

### Installation on Ubuntu 22.04

```bash
# Add Gazebo repository
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:openrobotics/gazebo
sudo apt update

# Install Gazebo Garden
sudo apt install gazebo
```

### Alternative Installation Methods

#### Using APT (Recommended)
```bash
# Install complete Gazebo environment
sudo apt install gazebo libgazebo-dev

# Install additional plugins
sudo apt install gazebo-plugin-base gazebo-plugin-ros
```

#### Using Docker
```bash
# Pull Gazebo Docker image
docker pull gazebo:gz-sim-harmonic

# Run Gazebo in Docker
docker run -it --rm -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix gazebo:gz-sim-harmonic gazebo
```

### Verification of Installation

```bash
# Check Gazebo version
gz --version

# Launch Gazebo GUI
gz sim

# Or launch with a specific world file
gz sim -r -v 4 empty.sdf
```

## Gazebo World Creation

### World File Structure

Gazebo uses SDF (Simulation Description Format) files to define simulation worlds:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="default">
    <!-- Include models from fuel.ignitionrobotics.org -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Define a simple robot -->
    <model name="simple_robot">
      <pose>0 0 0.5 0 0 0</pose>
      <link name="chassis">
        <pose>0 0 0 0 0 0</pose>
        <collision name="collision">
          <geometry>
            <box><size>1.0 0.5 0.2</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box><size>1.0 0.5 0.2</size></box>
          </geometry>
          <material>
            <ambient>0.4 0.4 0.4 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>10.0</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <!-- Physics engine configuration -->
    <physics name="1ms" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000.0</real_time_update_rate>
    </physics>
  </world>
</sdf>
```

### Lighting and Environment

```xml
<!-- Adding lighting to the world -->
<world name="lit_world">
  <!-- Sun light source -->
  <light name="sun" type="directional">
    <pose>0 0 10 0 0 0</pose>
    <diffuse>0.8 0.8 0.8 1</diffuse>
    <specular>0.2 0.2 0.2 1</specular>
    <attenuation>
      <range>1000</range>
      <constant>0.9</constant>
      <linear>0.01</linear>
      <quadratic>0.001</quadratic>
    </attenuation>
    <direction>-0.5 0.1 -0.9</direction>
  </light>

  <!-- Ambient lighting -->
  <scene>
    <ambient>0.3 0.3 0.3 1</ambient>
    <background>0.8 0.9 1 1</background>
    <shadows>true</shadows>
  </scene>
</world>
```

## Model Creation and Configuration

### Basic Model Structure

A Gazebo model typically includes:
- **Links**: Rigid bodies with visual, collision, and inertial properties
- **Joints**: Connections between links with specific motion constraints
- **Plugins**: Custom functionality for sensors, controllers, or other features

```xml
<?xml version="1.0"?>
<sdf version="1.7">
  <model name="my_robot">
    <!-- Base link -->
    <link name="base_link">
      <inertial>
        <mass>5.0</mass>
        <inertia>
          <ixx>0.1</ixx> <ixy>0</ixy> <ixz>0</ixz>
          <iyy>0.1</iyy> <iyz>0</iyz>
          <izz>0.2</izz>
        </inertia>
      </inertial>

      <visual name="base_visual">
        <geometry>
          <cylinder><radius>0.3</radius><length>0.2</length></cylinder>
        </geometry>
        <material>
          <ambient>0.0 0.0 1.0 1</ambient>
          <diffuse>0.0 0.0 1.0 1</diffuse>
        </material>
      </visual>

      <collision name="base_collision">
        <geometry>
          <cylinder><radius>0.3</radius><length>0.2</length></cylinder>
        </geometry>
      </collision>
    </link>

    <!-- Wheel links -->
    <link name="front_left_wheel">
      <inertial>
        <mass>0.5</mass>
        <inertia>
          <ixx>0.001</ixx> <ixy>0</ixy> <ixz>0</ixz>
          <iyy>0.001</iyy> <iyz>0</iyz>
          <izz>0.002</izz>
        </inertia>
      </inertial>
      <visual name="wheel_visual">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
      </visual>
      <collision name="wheel_collision">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
      </collision>
    </link>

    <!-- Joints -->
    <joint name="front_left_wheel_joint" type="continuous">
      <parent>base_link</parent>
      <child>front_left_wheel</child>
      <pose>0.2 0.2 -0.1 0 0 0</pose>
      <axis>
        <xyz>0 1 0</xyz>
      </axis>
    </joint>
  </model>
</sdf>
```

### Sensor Integration

Gazebo supports various sensors that can be attached to robot models:

#### Camera Sensor
```xml
<sensor name="camera" type="camera">
  <pose>0.3 0 0.1 0 0 0</pose>
  <camera name="head">
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.1</near>
      <far>10</far>
    </clip>
  </camera>
  <always_on>1</always_on>
  <update_rate>30</update_rate>
  <visualize>true</visualize>
</sensor>
```

#### LIDAR Sensor
```xml
<sensor name="lidar" type="ray">
  <pose>0.3 0 0.2 0 0 0</pose>
  <ray>
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>10.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <plugin name="lidar_controller" filename="libgazebo_ros_ray_sensor.so">
    <ros>
      <namespace>lidar</namespace>
      <remapping>~/out:=scan</remapping>
    </ros>
    <output_type>sensor_msgs/LaserScan</output_type>
  </plugin>
  <always_on>1</always_on>
  <update_rate>10</update_rate>
  <visualize>true</visualize>
</sensor>
```

## Gazebo-ROS 2 Integration

### Gazebo ROS Packages

Install the necessary packages for ROS 2 integration:

```bash
# Install Gazebo ROS packages
sudo apt install ros-humble-gazebo-ros-pkgs
sudo apt install ros-humble-gazebo-ros2-control
sudo apt install ros-humble-gazebo-dev
```

### Launch Files for Gazebo Integration

Create launch files to start Gazebo with your robot model:

```python
# launch/gazebo_launch.py
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription, ExecuteProcess
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare
from launch_ros.actions import Node

def generate_launch_description():
    # Start Gazebo with world file
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('gazebo_ros'),
                'launch',
                'gazebo.launch.py'
            ])
        ]),
        launch_arguments={
            'world': PathJoinSubstitution([
                FindPackageShare('my_robot_description'),
                'worlds',
                'my_world.sdf'
            ])
        }.items()
    )

    # Spawn robot in Gazebo
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', 'robot_description',
            '-entity', 'my_robot'
        ],
        output='screen'
    )

    return LaunchDescription([
        gazebo,
        spawn_entity
    ])
```

### Robot State Publisher Integration

```xml
<!-- URDF with Gazebo-specific elements -->
<robot name="my_robot">
  <!-- Your URDF links and joints -->

  <!-- Gazebo-specific elements -->
  <gazebo>
    <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
      <parameters>$(find my_robot_control)/config/my_robot_control.yaml</parameters>
    </plugin>
  </gazebo>

  <!-- Link-specific Gazebo elements -->
  <gazebo reference="base_link">
    <material>Gazebo/Blue</material>
  </gazebo>
</robot>
```

## Physics Engine Configuration

### ODE (Open Dynamics Engine)

ODE is the default physics engine in Gazebo:

```xml
<physics name="ode_physics" type="ode">
  <!-- Time stepping -->
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000.0</real_time_update_rate>

  <!-- Solver parameters -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>10</iters>
      <sor>1.3</sor>
    </solver>
    <constraints>
      <cfm>0.0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

### Contact Materials

Define how different materials interact:

```xml
<world name="material_world">
  <!-- Define materials -->
  <gazebo reference="link_name">
    <mu1>0.5</mu1>  <!-- Static friction coefficient -->
    <mu2>0.4</mu2>  <!-- Dynamic friction coefficient -->
    <kp>1000000.0</kp>  <!-- Contact stiffness -->
    <kd>100.0</kd>     <!-- Contact damping -->
    <max_vel>100.0</max_vel>  <!-- Maximum contact correction velocity -->
    <min_depth>0.001</min_depth>  <!-- Minimum contact depth -->
  </gazebo>
</world>
```

## Control Integration

### ROS 2 Control Setup

To control your robot in Gazebo, set up ROS 2 control:

```yaml
# config/my_robot_control.yaml
controller_manager:
  ros__parameters:
    update_rate: 100  # Hz

    joint_state_broadcaster:
      type: joint_state_broadcaster/JointStateBroadcaster

    velocity_controller:
      type: velocity_controllers/JointGroupVelocityController

velocity_controller:
  ros__parameters:
    joints:
      - front_left_wheel_joint
      - front_right_wheel_joint
      - rear_left_wheel_joint
      - rear_right_wheel_joint
```

### Controller Launch

```python
# launch/control_launch.py
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Controller manager
    controller_manager = Node(
        package='controller_manager',
        executable='ros2_control_node',
        parameters=[
            PathJoinSubstitution([
                FindPackageShare('my_robot_control'),
                'config',
                'my_robot_control.yaml'
            ])
        ]
    )

    # Joint state broadcaster
    joint_state_broadcaster_spawner = Node(
        package='controller_manager',
        executable='spawner',
        arguments=['joint_state_broadcaster'],
    )

    # Velocity controller spawner
    velocity_controller_spawner = Node(
        package='controller_manager',
        executable='spawner',
        arguments=['velocity_controller'],
    )

    # Delay velocity controller spawner after joint_state_broadcaster_spawner
    delay_velocity_controller_spawner_after_joint_state_broadcaster_spawner = RegisterEventHandler(
        event_handler=OnProcessStart(
            target_action=joint_state_broadcaster_spawner,
            on_start=[velocity_controller_spawner],
        )
    )

    return LaunchDescription([
        controller_manager,
        joint_state_broadcaster_spawner,
        delay_velocity_controller_spawner_after_joint_state_broadcaster_spawner,
    ])
```

## Hardware Awareness in Gazebo

### Workstation vs. Edge Simulation

#### Workstation Simulation (Development)
- **High-Fidelity Physics**: Detailed collision meshes and accurate physics
- **Realistic Rendering**: High-resolution graphics for computer vision
- **Complex Environments**: Detailed world models with many objects
- **Development Tools**: Full debugging and visualization capabilities

#### Edge Simulation (Deployment Testing)
- **Optimized Performance**: Simplified meshes for real-time operation
- **Reduced Fidelity**: Lower-resolution sensors and physics
- **Lightweight Worlds**: Simplified environments for faster simulation
- **Resource Efficiency**: Minimal computational overhead

### Performance Optimization

#### Model Simplification
```xml
<!-- Use simplified collision geometry -->
<link name="simplified_link">
  <collision name="collision">
    <!-- Use box instead of complex mesh -->
    <geometry>
      <box><size>0.5 0.5 0.5</size></box>
    </geometry>
  </collision>
  <visual name="visual">
    <!-- Use detailed mesh for visualization -->
    <geometry>
      <mesh><uri>model://detailed_mesh.stl</uri></mesh>
    </geometry>
  </visual>
</link>
```

#### Physics Optimization
```xml
<!-- Optimize physics for performance -->
<physics name="fast_physics" type="ode">
  <max_step_size>0.01</max_step_size>  <!-- Larger step size for speed -->
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>100.0</real_time_update_rate>  <!-- Lower update rate -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>5</iters>  <!-- Fewer iterations for speed -->
      <sor>1.3</sor>
    </solver>
  </ode>
</physics>
```

## Gazebo Plugins

### Sensor Plugins

Create custom sensor plugins for specialized functionality:

```cpp
// example_sensor_plugin.cc
#include <gazebo/gazebo.hh>
#include <gazebo/sensors/sensors.hh>
#include <ros/ros.h>
#include <sensor_msgs/Range.h>

namespace gazebo
{
  class CustomSensorPlugin : public SensorPlugin
  {
    public: void Load(sensors::SensorPtr _sensor, sdf::ElementPtr _sdf)
    {
      // Get sensor
      this->parentSensor =
        std::dynamic_pointer_cast<sensors::RaySensor>(_sensor);

      if (!this->parentSensor)
      {
        gzerr << "CustomSensorPlugin not attached to a ray sensor\n";
        return;
      }

      // Connect to sensor update event
      this->updateConnection = this->parentSensor->ConnectUpdated(
          std::bind(&CustomSensorPlugin::OnUpdate, this));

      // Initialize ROS
      if (!ros::isInitialized())
      {
        int argc = 0;
        char** argv = NULL;
        ros::init(argc, argv, "gazebo_custom_sensor");
      }

      // Create ROS publisher
      this->rosNode.reset(new ros::NodeHandle());
      this->pub = this->rosNode->advertise<sensor_msgs::Range>("custom_range", 1);
    }

    private: void OnUpdate()
    {
      // Get range data
      auto ranges = this->parentSensor->Ranges();

      // Publish to ROS
      sensor_msgs::Range msg;
      msg.header.stamp = ros::Time::now();
      msg.range = *std::min_element(ranges.begin(), ranges.end());
      this->pub.publish(msg);
    }

    private: sensors::RaySensorPtr parentSensor;
    private: event::ConnectionPtr updateConnection;
    private: std::unique_ptr<ros::NodeHandle> rosNode;
    private: ros::Publisher pub;
  };

  GZ_REGISTER_SENSOR_PLUGIN(CustomSensorPlugin)
}
```

### Controller Plugins

Create custom controller plugins for specialized robot control:

```cpp
// differential_drive_plugin.cc
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>
#include <ros/ros.h>
#include <geometry_msgs/Twist.h>

namespace gazebo
{
  class DifferentialDrivePlugin : public ModelPlugin
  {
    public: void Load(physics::ModelPtr _model, sdf::ElementPtr _sdf)
    {
      this->model = _model;

      // Get joints
      this->leftJoint = _model->GetJoint("left_wheel_joint");
      this->rightJoint = _model->GetJoint("right_wheel_joint");

      // Initialize ROS
      if (!ros::isInitialized())
      {
        int argc = 0;
        char** argv = NULL;
        ros::init(argc, argv, "gazebo_diff_drive");
      }

      // Create ROS subscriber
      this->rosNode.reset(new ros::NodeHandle());
      this->sub = this->rosNode->subscribe("cmd_vel", 1,
        &DifferentialDrivePlugin::OnCmdVel, this);

      // Start update loop
      this->updateConnection = event::Events::ConnectWorldUpdateBegin(
        std::bind(&DifferentialDrivePlugin::OnUpdate, this));
    }

    private: void OnCmdVel(const geometry_msgs::Twist::ConstPtr& msg)
    {
      this->targetVelX = msg->linear.x;
      this->targetAngZ = msg->angular.z;
    }

    private: void OnUpdate()
    {
      // Calculate wheel velocities
      double wheelSep = 0.5; // meters
      double wheelRadius = 0.1; // meters

      double leftVel = (this->targetVelX - this->targetAngZ * wheelSep / 2.0) / wheelRadius;
      double rightVel = (this->targetVelX + this->targetAngZ * wheelSep / 2.0) / wheelRadius;

      // Set joint velocities
      this->leftJoint->SetParam("vel", 0, leftVel);
      this->rightJoint->SetParam("vel", 0, rightVel);
    }

    private: physics::ModelPtr model;
    private: physics::JointPtr leftJoint, rightJoint;
    private: event::ConnectionPtr updateConnection;
    private: std::unique_ptr<ros::NodeHandle> rosNode;
    private: ros::Subscriber sub;
    private: double targetVelX = 0.0, targetAngZ = 0.0;
  };

  GZ_REGISTER_MODEL_PLUGIN(DifferentialDrivePlugin)
}
```

## Best Practices

### Model Development
1. **Start Simple**: Begin with basic shapes, add detail gradually
2. **Validate Physics**: Test collision and inertial properties
3. **Optimize Meshes**: Use appropriate level of detail
4. **Document Models**: Include README files with model information

### Performance Optimization
1. **Use Appropriate Time Steps**: Balance accuracy and performance
2. **Simplify Collision Geometry**: Use primitive shapes when possible
3. **Optimize Sensor Rates**: Match update rates to application needs
4. **Monitor Resource Usage**: Track CPU and memory consumption

### Integration Testing
1. **Test Individual Components**: Validate sensors and controllers separately
2. **Validate ROS Communication**: Ensure proper message flow
3. **Test Edge Cases**: Verify behavior under extreme conditions
4. **Performance Testing**: Measure simulation stability and accuracy

## Practical Exercise: Creating a Mobile Robot in Gazebo

Let's create a complete example of a differential drive robot in Gazebo:

```xml
<?xml version="1.0"?>
<sdf version="1.7">
  <model name="diff_drive_robot">
    <!-- Robot chassis -->
    <link name="chassis">
      <pose>0 0 0.1 0 0 0</pose>
      <inertial>
        <mass>10.0</mass>
        <inertia>
          <ixx>0.4</ixx> <ixy>0</ixy> <ixz>0</ixz>
          <iyy>0.4</iyy> <iyz>0</iyz>
          <izz>0.8</izz>
        </inertia>
      </inertial>

      <visual name="chassis_visual">
        <geometry>
          <box><size>0.5 0.3 0.2</size></box>
        </geometry>
        <material>
          <ambient>0.8 0.8 0.8 1</ambient>
          <diffuse>0.8 0.8 0.8 1</diffuse>
        </material>
      </visual>

      <collision name="chassis_collision">
        <geometry>
          <box><size>0.5 0.3 0.2</size></box>
        </geometry>
      </collision>
    </link>

    <!-- Left wheel -->
    <link name="left_wheel">
      <inertial>
        <mass>0.5</mass>
        <inertia>
          <ixx>0.001</ixx> <ixy>0</ixy> <ixz>0</ixz>
          <iyy>0.001</iyy> <iyz>0</iyz>
          <izz>0.002</izz>
        </inertia>
      </inertial>

      <visual name="left_wheel_visual">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
        <material>
          <ambient>0.2 0.2 0.2 1</ambient>
          <diffuse>0.2 0.2 0.2 1</diffuse>
        </material>
      </visual>

      <collision name="left_wheel_collision">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
      </collision>
    </link>

    <!-- Right wheel -->
    <link name="right_wheel">
      <inertial>
        <mass>0.5</mass>
        <inertia>
          <ixx>0.001</ixx> <ixy>0</ixy> <ixz>0</ixz>
          <iyy>0.001</iyy> <iyz>0</iyz>
          <izz>0.002</izz>
        </inertia>
      </inertial>

      <visual name="right_wheel_visual">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
        <material>
          <ambient>0.2 0.2 0.2 1</ambient>
          <diffuse>0.2 0.2 0.2 1</diffuse>
        </material>
      </visual>

      <collision name="right_wheel_collision">
        <geometry>
          <cylinder><radius>0.1</radius><length>0.05</length></cylinder>
        </geometry>
      </collision>
    </link>

    <!-- Wheel joints -->
    <joint name="left_wheel_joint" type="continuous">
      <parent>chassis</parent>
      <child>left_wheel</child>
      <pose>0 0.2 0 0 0 0</pose>
      <axis>
        <xyz>0 1 0</xyz>
      </axis>
    </joint>

    <joint name="right_wheel_joint" type="continuous">
      <parent>chassis</parent>
      <child>right_wheel</child>
      <pose>0 -0.2 0 0 0 0</pose>
      <axis>
        <xyz>0 1 0</xyz>
      </axis>
    </joint>

    <!-- Camera sensor -->
    <sensor name="camera" type="camera">
      <pose>0.25 0 0.1 0 0 0</pose>
      <camera name="head_camera">
        <horizontal_fov>1.047</horizontal_fov>
        <image>
          <width>640</width>
          <height>480</height>
          <format>R8G8B8</format>
        </image>
        <clip>
          <near>0.1</near>
          <far>10</far>
        </clip>
      </camera>
      <always_on>1</always_on>
      <update_rate>30</update_rate>
      <visualize>true</visualize>
    </sensor>

    <!-- IMU sensor -->
    <sensor name="imu" type="imu">
      <pose>0 0 0.05 0 0 0</pose>
      <always_on>1</always_on>
      <update_rate>100</update_rate>
      <visualize>false</visualize>
    </sensor>

    <!-- Gazebo plugins -->
    <gazebo>
      <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
        <ros>
          <namespace>diff_robot</namespace>
          <remapping>cmd_vel:=cmd_vel</remapping>
          <remapping>odom:=odom</remapping>
        </ros>
        <update_rate>30</update_rate>
        <left_joint>left_wheel_joint</left_joint>
        <right_joint>right_wheel_joint</right_joint>
        <wheel_separation>0.4</wheel_separation>
        <wheel_diameter>0.2</wheel_diameter>
        <max_wheel_torque>20</max_wheel_torque>
        <max_wheel_acceleration>1.0</max_wheel_acceleration>
        <publish_odom>true</publish_odom>
        <publish_odom_tf>true</publish_odom_tf>
        <publish_wheel_tf>true</publish_wheel_tf>
        <odometry_frame>odom</odometry_frame>
        <robot_base_frame>chassis</robot_base_frame>
      </plugin>
    </gazebo>
  </model>
</sdf>
```

## Academic Rigor in Gazebo Simulation

### Theoretical Foundations
- **Physics Simulation**: Understanding of rigid body dynamics and collision detection
- **Control Theory**: Knowledge of feedback control and system dynamics
- **Computer Graphics**: Understanding of 3D rendering and visualization
- **Real-time Systems**: Knowledge of timing constraints and deterministic behavior

### Practical Validation
- **Analytical Solutions**: Compare simulation results with known physics solutions
- **Real-world Validation**: Test that simulation behavior matches physical systems
- **Performance Metrics**: Quantify simulation accuracy and computational efficiency
- **Reproducibility**: Ensure results can be reproduced by others

## Summary

Gazebo provides a comprehensive simulation environment for robotics development, offering realistic physics, high-quality graphics, and seamless ROS integration. The platform enables safe and cost-effective testing of robotic systems before deployment on real hardware.

Key aspects of Gazebo simulation include:
- **Accurate Physics**: Realistic simulation of rigid body dynamics and collisions
- **Sensor Integration**: Accurate modeling of various robot sensors
- **ROS Integration**: Native support for ROS and ROS 2 communication
- **Extensibility**: Plugin architecture for custom functionality
- **Performance Optimization**: Tools for balancing accuracy and computational efficiency

Understanding Gazebo is essential for effective robotics development, providing the foundation for sim-to-real transfer learning and safe algorithm validation.

---

:::note
Gazebo is a powerful simulation environment that requires careful configuration to match real-world physics. Pay attention to mass, inertia, and friction parameters for accurate simulation.
:::

:::tip
Start with simple models and gradually add complexity. Validate your simulation results with basic physics principles before moving to complex scenarios.
:::

:::warning
The physics parameters in Gazebo may not perfectly match real-world behavior. Always validate critical algorithms on real hardware before deployment.
:::

:::danger
Never assume simulation results will perfectly match real-world performance. The sim-to-real gap can be significant and must be carefully managed in safety-critical applications.
:::