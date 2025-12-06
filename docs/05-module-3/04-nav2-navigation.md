---
id: 04-nav2-navigation
title: Nav2 Navigation Stack
sidebar_label: Nav2 Navigation
sidebar_position: 4
description: Comprehensive guide to ROS 2 Navigation Stack (Nav2), including configuration, planning, and autonomous navigation systems
keywords:
  - nav2
  - navigation stack
  - ros2 navigation
  - path planning
  - autonomous navigation
  - slam
---

# Nav2 Navigation Stack

## Introduction

ROS 2 Navigation Stack (Nav2) is the official navigation framework for ROS 2, providing a comprehensive set of tools for autonomous robot navigation. Nav2 enables robots to autonomously navigate in complex environments using simultaneous localization and mapping (SLAM), path planning, and obstacle avoidance. This chapter explores Nav2's architecture, configuration, and implementation for autonomous navigation systems.

## Nav2 Architecture Overview

### Core Components

Nav2 is built around a modular architecture that includes:

#### Navigation System Components
- **World Model**: Maintains representation of environment and obstacles
- **Path Planner**: Computes optimal paths from start to goal
- **Controller**: Generates velocity commands to follow planned path
- **Recovery**: Handles navigation failures and recovers from stuck situations
- **Behavior Trees**: Orchestrates navigation behaviors and decision-making

#### Service Interfaces
- **Navigation Actions**: High-level navigation goals and control
- **Map Services**: Map loading, saving, and management
- **Lifecycle Management**: Component state management and coordination

### Nav2 System Architecture

```
                    +------------------+
                    |   Navigation     |
                    |   Action Server  |
                    +------------------+
                            |
                    +------------------+
                    |   Behavior Tree  |
                    |   (BT Navigator) |
                    +------------------+
                            |
        +-------------------+-------------------+
        |                                       |
+------------------+                    +------------------+
|   Path Planning  |                    |   Path Following |
|   (Planner Server)|                    |   (Controller    |
+------------------+                    |   Server)       |
        |                                       |
+------------------+                    +------------------+
|   Costmap Server |                    |   Costmap Server |
|   (Local/Global) |                    |   (Local/Global) |
+------------------+                    +------------------+
        |                                       |
+------------------+                    +------------------+
|   Sensor Fusion |                    |   Sensor Fusion  |
|   & Filtering   |                    |   & Filtering    |
+------------------+                    +------------------+
```

## Nav2 Installation and Setup

### Prerequisites

#### Software Requirements
- **ROS 2**: Humble Hawksbill or Iron Irwini
- **Operating System**: Ubuntu 22.04 LTS
- **Build Tools**: colcon, CMake, Python 3.8+

#### Installation Process

```bash
# Install Nav2 packages
sudo apt update
sudo apt install ros-humble-navigation2
sudo apt install ros-humble-nav2-bringup
sudo apt install ros-humble-nav2-gui

# Install additional dependencies
sudo apt install ros-humble-dwb-core
sudo apt install ros-humble-robot-localization
sudo apt install ros-humble-slam-toolbox
```

### Verification of Installation

```bash
# Check Nav2 packages
ros2 pkg list | grep nav2

# Check available launch files
ls /opt/ros/humble/share/nav2_bringup/launch/

# Test basic Nav2 functionality
ros2 run nav2_util lifecycle_bringup
```

## Nav2 Configuration

### Basic Configuration Files

#### Navigation Parameters (nav2_params.yaml)
```yaml
amcl:
  ros__parameters:
    use_sim_time: false
    alpha1: 0.2
    alpha2: 0.2
    alpha3: 0.2
    alpha4: 0.2
    alpha5: 0.2
    base_frame_id: "base_footprint"
    beam_skip_distance: 0.5
    beam_skip_error_threshold: 0.9
    beam_skip_threshold: 0.3
    do_beamskip: false
    global_frame_id: "map"
    lambda_short: 0.1
    likelihood_max_dist: 2.0
    max_beams: 60
    max_particles: 2000
    min_particles: 500
    odom_frame_id: "odom"
    pf_err: 0.05
    pf_z: 0.99
    recovery_alpha_fast: 0.0
    recovery_alpha_slow: 0.0
    resample_interval: 1
    robot_model_type: "nav2_amcl::DifferentialMotionModel"
    save_pose_rate: 0.5
    sigma_hit: 0.2
    tf_broadcast: true
    transform_tolerance: 1.0
    update_min_a: 0.2
    update_min_d: 0.25
    z_hit: 0.5
    z_max: 0.05
    z_rand: 0.5
    z_short: 0.05
    scan_topic: scan

amcl_map_client:
  ros__parameters:
    use_sim_time: false

amcl_rclcpp_node:
  ros__parameters:
    use_sim_time: false

bt_navigator:
  ros__parameters:
    use_sim_time: false
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    bt_loop_duration: 10
    default_server_timeout: 20
    enable_groot_monitoring: True
    enable_bt_monitoring: True
    groot_zmq_publisher_port: 1666
    groot_zmq_server_port: 1667
    # Specify the path to the Behavior Tree XML file
    default_nav_through_poses_bt_xml: "navigate_w_replanning_and_recovery.xml"
    default_nav_to_pose_bt_xml: "navigate_w_replanning_and_recovery.xml"
    plugin_lib_names:
    - nav2_compute_path_to_pose_action_bt_node
    - nav2_compute_path_through_poses_action_bt_node
    - nav2_smooth_path_action_bt_node
    - nav2_follow_path_action_bt_node
    - nav2_spin_action_bt_node
    - nav2_wait_action_bt_node
    - nav2_back_up_action_bt_node
    - nav2_drive_on_heading_bt_node
    - nav2_clear_costmap_service_bt_node
    - nav2_is_stuck_condition_bt_node
    - nav2_are_error_recovery_enabled_condition_bt_node
    - nav2_would_a_controller_recovery_help_condition_bt_node
    - nav2_would_a_planner_recovery_help_condition_bt_node
    - nav2_would_a_smoother_recovery_help_condition_bt_node
    - nav2_initial_pose_received_condition_bt_node
    - nav2_reinitialize_global_localization_service_bt_node
    - nav2_rate_controller_bt_node
    - nav2_distance_controller_bt_node
    - nav2_speed_controller_bt_node
    - nav2_truncate_path_action_bt_node
    - nav2_truncate_path_local_action_bt_node
    - nav2_goal_reached_condition_bt_node
    - nav2_goal_updated_condition_bt_node
    - nav2_globally_consistent_condition_bt_node
    - nav2_is_path_valid_condition_bt_node
    - nav2_remove_passed_goals_action_bt_node
    - nav2_planner_selector_bt_node
    - nav2_controller_selector_bt_node
    - nav2_goal_checker_selector_bt_node
    - nav2_controller_cancel_bt_node
    - nav2_path_longer_on_approach_bt_node
    - nav2_wait_cancel_bt_node
    - nav2_spin_cancel_bt_node
    - nav2_back_up_cancel_bt_node
    - nav2_drive_on_heading_cancel_bt_node

bt_navigator_rclcpp_node:
  ros__parameters:
    use_sim_time: false

controller_server:
  ros__parameters:
    use_sim_time: false
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.5
    min_theta_velocity_threshold: 0.001
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]

    # Progress checker parameters
    progress_checker:
      plugin: "nav2_controller::SimpleProgressChecker"
      required_movement_radius: 0.5
      movement_time_allowance: 10.0

    # Goal checker parameters
    goal_checker:
      plugin: "nav2_controller::SimpleGoalChecker"
      xy_goal_tolerance: 0.25
      yaw_goal_tolerance: 0.25
      stateful: True

    # DWB parameters
    FollowPath:
      plugin: "dwb_core::DWBLocalPlanner"
      debug_trajectory_details: True
      min_vel_x: 0.0
      min_vel_y: 0.0
      max_vel_x: 0.5
      max_vel_y: 0.0
      max_vel_theta: 1.0
      min_speed_xy: 0.0
      max_speed_xy: 0.5
      min_speed_theta: 0.0
      acc_lim_x: 2.5
      acc_lim_y: 0.0
      acc_lim_theta: 3.2
      decel_lim_x: -2.5
      decel_lim_y: 0.0
      decel_lim_theta: -3.2
      vx_samples: 20
      vy_samples: 5
      vtheta_samples: 20
      sim_time: 1.7
      linear_granularity: 0.05
      angular_granularity: 0.025
      transform_tolerance: 0.2
      xy_goal_tolerance: 0.25
      trans_stopped_velocity: 0.25
      short_circuit_trajectory_evaluation: True
      stateful: True
      critics: ["RotateToGoal", "Oscillation", "BaseObstacle", "GoalAlign", "PathAlign", "PathDist", "GoalDist"]
      BaseObstacle.scale: 0.02
      PathAlign.scale: 32.0
      PathAlign.forward_point_distance: 0.1
      GoalAlign.scale: 24.0
      GoalAlign.forward_point_distance: 0.1
      PathDist.scale: 32.0
      GoalDist.scale: 24.0
      RotateToGoal.scale: 32.0
      RotateToGoal.slowing_factor: 5.0
      RotateToGoal.lookahead_time: -1.0

controller_server_rclcpp_node:
  ros__parameters:
    use_sim_time: false

local_costmap:
  local_costmap:
    ros__parameters:
      update_frequency: 5.0
      publish_frequency: 2.0
      global_frame: odom
      robot_base_frame: base_link
      use_sim_time: false
      rolling_window: true
      width: 3
      height: 3
      resolution: 0.05
      robot_radius: 0.22
      plugins: ["voxel_layer", "inflation_layer"]
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      voxel_layer:
        plugin: "nav2_costmap_2d::VoxelLayer"
        enabled: True
        publish_voxel_map: True
        origin_z: 0.0
        z_resolution: 0.05
        z_voxels: 16
        max_obstacle_height: 2.0
        mark_threshold: 0
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      always_send_full_costmap: True
  local_costmap_client:
    ros__parameters:
      use_sim_time: false
  local_costmap_rclcpp_node:
    ros__parameters:
      use_sim_time: false

global_costmap:
  global_costmap:
    ros__parameters:
      update_frequency: 1.0
      publish_frequency: 1.0
      global_frame: map
      robot_base_frame: base_link
      use_sim_time: false
      robot_radius: 0.22
      resolution: 0.05
      track_unknown_space: true
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: True
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      always_send_full_costmap: True
  global_costmap_client:
    ros__parameters:
      use_sim_time: false
  global_costmap_rclcpp_node:
    ros__parameters:
      use_sim_time: false

map_server:
  ros__parameters:
    use_sim_time: false
    yaml_filename: "turtlebot3_world.yaml"

map_saver:
  ros__parameters:
    use_sim_time: false
    save_map_timeout: 5.0
    free_thresh_default: 0.25
    occupied_thresh_default: 0.65

planner_server:
  ros__parameters:
    expected_planner_frequency: 20.0
    use_sim_time: false
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner::NavfnPlanner"
      tolerance: 0.5
      use_astar: false
      allow_unknown: true

planner_server_rclcpp_node:
  ros__parameters:
    use_sim_time: false

smoother_server:
  ros__parameters:
    use_sim_time: false
    smoother_plugins: ["simple_smoother"]
    simple_smoother:
      plugin: "nav2_smoother::SimpleSmoother"
      tolerance: 1.0e-10
      max_its: 1000
      w_smooth: 0.9
      w_data: 0.1

behavior_server:
  ros__parameters:
    costmap_topic: local_costmap/costmap_raw
    footprint_topic: local_costmap/published_footprint
    cycle_frequency: 10.0
    behavior_plugins: ["spin", "backup", "drive_on_heading", "wait"]
    spin:
      plugin: "nav2_behaviors::Spin"
    backup:
      plugin: "nav2_behaviors::BackUp"
    drive_on_heading:
      plugin: "nav2_behaviors::DriveOnHeading"
    wait:
      plugin: "nav2_behaviors::Wait"
    global_frame: odom
    robot_base_frame: base_link
    transform_tolerance: 0.1
    use_sim_time: false
    simulate_ahead_time: 2.0
    max_rotational_vel: 1.0
    min_rotational_vel: 0.4
    rotational_acc_lim: 3.2

robot_state_publisher:
  ros__parameters:
    use_sim_time: false
```

### Launch File Configuration

#### Nav2 Bringup Launch File
```python
# launch/navigation_launch.py
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node, ComposableNodeContainer
from launch_ros.descriptions import ComposableNode
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Launch arguments
    use_sim_time = LaunchConfiguration('use_sim_time', default='false')
    autostart = LaunchConfiguration('autostart', default='true')
    params_file = LaunchConfiguration('params_file')
    bt_xml_file = LaunchConfiguration('bt_xml_file')
    map_yaml_file = LaunchConfiguration('map')

    # Parameters file
    nav2_params = PathJoinSubstitution([
        FindPackageShare('my_robot_navigation'),
        'config',
        'nav2_params.yaml'
    ])

    # Behavior tree file
    bt_navigator_bt_xml = PathJoinSubstitution([
        FindPackageShare('nav2_bt_navigator'),
        'behavior_trees',
        'navigate_w_replanning_and_recovery.xml'
    ])

    # Navigation container
    navigation_container = ComposableNodeContainer(
        name='nav2_container',
        namespace='',
        package='rclcpp_components',
        executable='component_container_mt',
        composable_node_descriptions=[
            ComposableNode(
                package='nav2_controller',
                plugin='nav2_controller::ControllerServer',
                name='controller_server',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}],
                remappings=[('/cmd_vel', '/cmd_vel_nav')]
            ),
            ComposableNode(
                package='nav2_planner',
                plugin='nav2_planner::PlannerServer',
                name='planner_server',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}]
            ),
            ComposableNode(
                package='nav2_recoveries',
                plugin='nav2_recoveries::RecoveryServer',
                name='recovery_server',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}]
            ),
            ComposableNode(
                package='nav2_bt_navigator',
                plugin='nav2_bt_navigator::BtNavigator',
                name='bt_navigator',
                parameters=[nav2_params, {'use_sim_time': use_sim_time, 'bt_xml_filename': bt_navigator_bt_xml}]
            ),
            ComposableNode(
                package='nav2_waypoint_follower',
                plugin='nav2_waypoint_follower::WaypointFollower',
                name='waypoint_follower',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}]
            ),
            ComposableNode(
                package='nav2_lifecycle_manager',
                plugin='nav2_lifecycle_manager::LifecycleManager',
                name='lifecycle_manager_navigation',
                parameters=[{'use_sim_time': use_sim_time,
                           'autostart': autostart,
                           'node_names': ['controller_server',
                                        'planner_server',
                                        'recoveries_server',
                                        'bt_navigator',
                                        'waypoint_follower']}]
            )
        ],
        output='screen'
    )

    # Local costmap container
    local_costmap_container = ComposableNodeContainer(
        name='local_costmap_container',
        namespace='',
        package='rclcpp_components',
        executable='component_container_mt',
        composable_node_descriptions=[
            ComposableNode(
                package='nav2_costmap_2d',
                plugin='nav2_costmap_2d::LocalCostmap',
                name='local_costmap',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}],
                remappings=[('scan', 'scan'),
                           ('tf', 'tf'),
                           ('tf_static', 'tf_static')]
            ),
            ComposableNode(
                package='nav2_lifecycle_manager',
                plugin='nav2_lifecycle_manager::LifecycleManager',
                name='lifecycle_manager_local_costmap',
                parameters=[{'use_sim_time': use_sim_time,
                           'autostart': autostart,
                           'node_names': ['local_costmap']}]
            )
        ],
        output='screen'
    )

    # Global costmap container
    global_costmap_container = ComposableNodeContainer(
        name='global_costmap_container',
        namespace='',
        package='rclcpp_components',
        executable='component_container_mt',
        composable_node_descriptions=[
            ComposableNode(
                package='nav2_costmap_2d',
                plugin='nav2_costmap_2d::GlobalCostmap',
                name='global_costmap',
                parameters=[nav2_params, {'use_sim_time': use_sim_time}],
                remappings=[('scan', 'scan'),
                           ('tf', 'tf'),
                           ('tf_static', 'tf_static'),
                           ('global_costmap/costmap_raw', 'global_costmap/costmap_raw'),
                           ('global_costmap/costmap', 'global_costmap/costmap'),
                           ('global_costmap/costmap_updates', 'global_costmap/costmap_updates')]
            ),
            ComposableNode(
                package='nav2_lifecycle_manager',
                plugin='nav2_lifecycle_manager::LifecycleManager',
                name='lifecycle_manager_global_costmap',
                parameters=[{'use_sim_time': use_sim_time,
                           'autostart': autostart,
                           'node_names': ['global_costmap']}]
            )
        ],
        output='screen'
    )

    return LaunchDescription([
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='false',
            description='Use simulation time if true'
        ),
        DeclareLaunchArgument(
            'autostart',
            default_value='true',
            description='Automatically startup the nav2 stack'
        ),
        DeclareLaunchArgument(
            'params_file',
            default_value=nav2_params,
            description='Full path to the ROS2 parameters file to use'
        ),
        DeclareLaunchArgument(
            'bt_xml_file',
            default_value=bt_navigator_bt_xml,
            description='Full path to the behavior tree xml file to use'
        ),
        navigation_container,
        local_costmap_container,
        global_costmap_container
    ])
```

## Path Planning in Nav2

### Global Path Planners

#### Navfn Planner
```python
import rclpy
from rclpy.node import Node
from nav_msgs.msg import Path
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np

class NavfnPlannerNode(Node):
    def __init__(self):
        super().__init__('navfn_planner_node')

        # Publishers and subscribers
        self.path_pub = self.create_publisher(Path, 'global_plan', 10)
        self.marker_pub = self.create_publisher(MarkerArray, 'path_markers', 10)

        # Timer for path planning
        self.plan_timer = self.create_timer(5.0, self.plan_path)

        # Navigation state
        self.start_pose = None
        self.goal_pose = None

    def plan_path(self):
        """Plan path using Navfn algorithm"""
        if self.start_pose is None or self.goal_pose is None:
            return

        # In Nav2, this would use the planner server
        # For demonstration, we'll create a simple path
        path = self.create_simple_path(self.start_pose, self.goal_pose)

        # Publish path
        self.path_pub.publish(path)

        # Visualize path
        self.visualize_path(path)

    def create_simple_path(self, start, goal):
        """Create a simple path from start to goal (for demonstration)"""
        path = Path()
        path.header.frame_id = 'map'
        path.header.stamp = self.get_clock().now().to_msg()

        # Simple linear path (in real Nav2, this would be computed by the planner)
        steps = 20
        for i in range(steps + 1):
            ratio = i / steps
            pose = PoseStamped()
            pose.header.frame_id = 'map'
            pose.pose.position.x = start.position.x + ratio * (goal.position.x - start.position.x)
            pose.pose.position.y = start.position.y + ratio * (goal.position.y - start.position.y)
            pose.pose.position.z = 0.0

            # Simple orientation toward goal
            dx = goal.position.x - start.position.x
            dy = goal.position.y - start.position.y
            yaw = np.arctan2(dy, dx)

            from tf_transformations import quaternion_from_euler
            quat = quaternion_from_euler(0, 0, yaw)
            pose.pose.orientation.x = quat[0]
            pose.pose.orientation.y = quat[1]
            pose.pose.orientation.z = quat[2]
            pose.pose.orientation.w = quat[3]

            path.poses.append(pose)

        return path

    def visualize_path(self, path):
        """Visualize path using markers"""
        marker_array = MarkerArray()

        for i, pose in enumerate(path.poses):
            marker = Marker()
            marker.header = path.header
            marker.ns = "path"
            marker.id = i
            marker.type = Marker.SPHERE
            marker.action = Marker.ADD

            marker.pose = pose.pose
            marker.scale.x = 0.1
            marker.scale.y = 0.1
            marker.scale.z = 0.1

            marker.color.r = 0.0
            marker.color.g = 1.0
            marker.color.b = 0.0
            marker.color.a = 1.0

            marker_array.markers.append(marker)

        self.marker_pub.publish(marker_array)
```

### Local Path Planners (DWB - Dynamic Window Approach)

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, PoseStamped
from nav_msgs.msg import Path
from sensor_msgs.msg import LaserScan
import numpy as np

class DWBControllerNode(Node):
    def __init__(self):
        super().__init__('dwb_controller_node')

        # Publishers and subscribers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.path_sub = self.create_subscription(Path, 'global_plan', self.path_callback, 10)
        self.scan_sub = self.create_subscription(LaserScan, 'scan', self.scan_callback, 10)
        self.odom_sub = self.create_subscription(PoseStamped, 'current_pose', self.odom_callback, 10)

        # Controller parameters
        self.controller_frequency = 20.0  # Hz
        self.max_linear_speed = 0.5  # m/s
        self.max_angular_speed = 1.0  # rad/s
        self.min_linear_speed = 0.05  # m/s
        self.arrival_threshold = 0.2  # meters

        # Navigation state
        self.current_path = []
        self.current_pose = None
        self.path_index = 0

        # Timer for control loop
        self.control_timer = self.create_timer(1.0/self.controller_frequency, self.control_loop)

    def path_callback(self, msg):
        """Receive global path from planner"""
        self.current_path = msg.poses
        self.path_index = 0  # Reset to beginning of path
        self.get_logger().info(f'Received path with {len(self.current_path)} waypoints')

    def scan_callback(self, msg):
        """Receive laser scan for obstacle detection"""
        # Store scan data for collision checking
        self.laser_scan = msg

    def odom_callback(self, msg):
        """Receive current robot pose"""
        self.current_pose = msg.pose

    def control_loop(self):
        """Main control loop"""
        if not self.current_path or self.current_pose is None:
            return

        # Get current path target
        target_pose = self.get_current_target()

        if target_pose is None:
            self.stop_robot()
            return

        # Calculate control commands
        cmd_vel = self.calculate_control_command(target_pose)

        # Check for obstacles
        if self.is_path_clear(cmd_vel):
            self.cmd_vel_pub.publish(cmd_vel)
        else:
            # Emergency stop if path is blocked
            emergency_cmd = Twist()
            self.cmd_vel_pub.publish(emergency_cmd)

    def get_current_target(self):
        """Get current target pose along the path"""
        if self.path_index >= len(self.current_path):
            return None

        # Find closest path point
        closest_index = self.find_closest_path_point()
        self.path_index = closest_index

        # Look ahead to next point
        look_ahead_index = min(self.path_index + 5, len(self.current_path) - 1)
        return self.current_path[look_ahead_index].pose

    def find_closest_path_point(self):
        """Find the closest point on the path to current position"""
        if not self.current_path or self.current_pose is None:
            return 0

        min_distance = float('inf')
        closest_index = 0

        for i, pose_stamped in enumerate(self.current_path):
            pose = pose_stamped.pose
            distance = np.sqrt(
                (pose.position.x - self.current_pose.position.x)**2 +
                (pose.position.y - self.current_pose.position.y)**2
            )

            if distance < min_distance:
                min_distance = distance
                closest_index = i

        return closest_index

    def calculate_control_command(self, target_pose):
        """Calculate velocity command to reach target pose"""
        cmd_vel = Twist()

        if self.current_pose is None:
            return cmd_vel

        # Calculate direction to target
        dx = target_pose.position.x - self.current_pose.position.x
        dy = target_pose.position.y - self.current_pose.position.y
        distance_to_target = np.sqrt(dx**2 + dy**2)

        # Calculate desired orientation
        desired_yaw = np.arctan2(dy, dx)

        # Get current orientation
        from tf_transformations import euler_from_quaternion
        current_quat = [
            self.current_pose.orientation.x,
            self.current_pose.orientation.y,
            self.current_pose.orientation.z,
            self.current_pose.orientation.w
        ]
        current_euler = euler_from_quaternion(current_quat)
        current_yaw = current_euler[2]

        # Calculate orientation error
        yaw_error = desired_yaw - current_yaw
        while yaw_error > np.pi:
            yaw_error -= 2 * np.pi
        while yaw_error < -np.pi:
            yaw_error += 2 * np.pi

        # Simple proportional control
        if distance_to_target > self.arrival_threshold:
            # Turn toward target
            cmd_vel.angular.z = np.clip(yaw_error * 2.0, -self.max_angular_speed, self.max_angular_speed)

            # Move forward if approximately aligned
            if abs(yaw_error) < 0.3:
                cmd_vel.linear.x = min(self.max_linear_speed, distance_to_target)
        else:
            # Close to target, rotate to final orientation
            final_yaw = self.get_final_orientation()
            final_yaw_error = final_yaw - current_yaw
            while final_yaw_error > np.pi:
                final_yaw_error -= 2 * np.pi
            while final_yaw_error < -np.pi:
                final_yaw_error += 2 * np.pi

            cmd_vel.angular.z = np.clip(final_yaw_error * 2.0, -self.max_angular_speed, self.max_angular_speed)

        return cmd_vel

    def get_final_orientation(self):
        """Get final orientation from path (if specified)"""
        if self.current_path:
            final_pose = self.current_path[-1].pose
            from tf_transformations import euler_from_quaternion
            quat = [
                final_pose.orientation.x,
                final_pose.orientation.y,
                final_pose.orientation.z,
                final_pose.orientation.w
            ]
            euler = euler_from_quaternion(quat)
            return euler[2]  # yaw
        return 0.0

    def is_path_clear(self, cmd_vel):
        """Check if path is clear of obstacles"""
        if not hasattr(self, 'laser_scan'):
            return True  # Assume clear if no scan data

        # Simple obstacle detection in forward direction
        scan = self.laser_scan
        forward_range = len(scan.ranges) // 2

        # Check forward direction (±30 degrees)
        start_idx = max(0, forward_range - 15)
        end_idx = min(len(scan.ranges), forward_range + 15)

        for i in range(start_idx, end_idx):
            if not (np.isinf(scan.ranges[i]) or np.isnan(scan.ranges[i])):
                if scan.ranges[i] < 0.5:  # Obstacle within 0.5m
                    self.get_logger().warn('Obstacle detected ahead, stopping robot')
                    return False

        return True

    def stop_robot(self):
        """Stop the robot"""
        cmd_vel = Twist()
        self.cmd_vel_pub.publish(cmd_vel)
```

## Costmap Configuration

### Local Costmap

The local costmap represents the immediate environment around the robot:

```yaml
local_costmap:
  local_costmap:
    ros__parameters:
      update_frequency: 5.0
      publish_frequency: 2.0
      global_frame: odom
      robot_base_frame: base_link
      use_sim_time: false
      rolling_window: true
      width: 3  # meters
      height: 3  # meters
      resolution: 0.05  # meters per cell
      robot_radius: 0.22  # meters
      plugins: ["obstacle_layer", "inflation_layer"]
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      always_send_full_costmap: True
```

### Global Costmap

The global costmap represents the entire known environment:

```yaml
global_costmap:
  global_costmap:
    ros__parameters:
      update_frequency: 1.0
      publish_frequency: 1.0
      global_frame: map
      robot_base_frame: base_link
      use_sim_time: false
      robot_radius: 0.22
      resolution: 0.05
      track_unknown_space: true
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: True
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      always_send_full_costmap: True
```

## Behavior Trees in Nav2

### Behavior Tree Structure

Nav2 uses behavior trees for complex navigation decision-making:

```xml
<!-- navigate_w_replanning_and_recovery.xml -->
<root main_tree_to_execute="MainTree">
    <BehaviorTree ID="MainTree">
        <RecoveryNode number_of_retries="6" name="NavigateRecovery">
            <PipelineSequence name="NavigateWithReplanning">
                <RateController hz="1.0">
                    <RecoveryNode number_of_retries="1" name="ComputePathToPose">
                        <ComputePathToPose goal="{goal}" path="{path}" planner_id="GridBased"/>
                        <ClearEntireCostmap name="ClearGlobalCostmap-Context" service_name="global_costmap/clear_entirely_global_costmap"/>
                    </RecoveryNode>
                </RateController>
                <RecoveryNode number_of_retries="1" name="FollowPath">
                    <FollowPath path="{path}" controller_id="FollowPath"/>
                    <ClearEntireCostmap name="ClearLocalCostmap-Context" service_name="local_costmap/clear_entirely_local_costmap"/>
                </RecoveryNode>
            </PipelineSequence>
            <ReactiveFallback name="RecoveryFallback">
                <GoalUpdated/>
                <ClearCostmap name="ClearLocalCostmap-Subtree" service_name="local_costmap/clear_entirely_local_costmap"/>
                <ClearCostmap name="ClearGlobalCostmap-Subtree" service_name="global_costmap/clear_entirely_global_costmap"/>
                <RecoveryNode number_of_retries="1" name="Spin">
                    <Spin spin_dist="1.57"/>
                </RecoveryNode>
            </ReactiveFallback>
        </RecoveryNode>
    </BehaviorTree>
</root>
```

### Custom Behavior Tree Node

```python
import rclpy
from rclpy.node import Node
from py_trees_ros.trees importBehaviourTree
from py_trees_ros.interfaces import ServiceClient
from geometry_msgs.msg import PoseStamped
from nav2_msgs.action import NavigateToPose
import py_trees

class CustomNavBehavior(py_trees.behaviour.Behaviour):
    def __init__(self, name, goal_pose):
        super().__init__(name)
        self.goal_pose = goal_pose
        self.feedback_message = "initialising"

    def setup(self, node):
        """Initialise the service client"""
        self.node = node
        self.nav_client = self.node.create_client(NavigateToPose, 'navigate_to_pose')

    def update(self):
        """Execute the behaviour"""
        if not self.nav_client.service_is_ready():
            self.feedback_message = "waiting for navigate_to_pose service"
            return py_trees.common.Status.RUNNING

        # Send navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose = self.goal_pose

        self.nav_client.wait_for_service()
        future = self.nav_client.call_async(goal_msg)

        if future.done():
            result = future.result()
            if result.result:
                self.feedback_message = "navigation completed"
                return py_trees.common.Status.SUCCESS
            else:
                self.feedback_message = "navigation failed"
                return py_trees.common.Status.FAILURE

        self.feedback_message = "navigating..."
        return py_trees.common.Status.RUNNING

    def terminate(self, new_status):
        """Clean up when the behaviour terminates"""
        self.feedback_message = f"terminated with status {new_status}"
```

## Recovery Behaviors

### Recovery Actions

Nav2 includes several recovery behaviors for handling navigation failures:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_srvs.srv import Empty
import time

class RecoveryActionsNode(Node):
    def __init__(self):
        super().__init__('recovery_actions_node')

        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)

        # Recovery services
        self.clear_costmaps_service = self.create_service(
            Empty, 'recovery/clear_costmaps', self.clear_costmaps_callback)
        self.spin_service = self.create_service(
            Empty, 'recovery/spin', self.spin_callback)
        self.backup_service = self.create_service(
            Empty, 'recovery/backup', self.backup_callback)

    def clear_costmaps_callback(self, request, response):
        """Clear costmaps to recover from local minima"""
        self.get_logger().info('Clearing costmaps...')
        # In real Nav2, this would call the costmap clearing service
        return response

    def spin_callback(self, request, response):
        """Spin in place to clear local minima"""
        self.get_logger().info('Executing spin recovery...')

        cmd_vel = Twist()
        cmd_vel.angular.z = 0.5  # Spin at 0.5 rad/s

        # Spin for 5 seconds
        start_time = time.time()
        while time.time() - start_time < 5.0:
            self.cmd_vel_pub.publish(cmd_vel)
            time.sleep(0.1)

        # Stop
        cmd_vel.angular.z = 0.0
        self.cmd_vel_pub.publish(cmd_vel)

        return response

    def backup_callback(self, request, response):
        """Backup to clear obstacle"""
        self.get_logger().info('Executing backup recovery...')

        cmd_vel = Twist()
        cmd_vel.linear.x = -0.2  # Back up at 0.2 m/s

        # Backup for 2 seconds
        start_time = time.time()
        while time.time() - start_time < 2.0:
            self.cmd_vel_pub.publish(cmd_vel)
            time.sleep(0.1)

        # Stop
        cmd_vel.linear.x = 0.0
        self.cmd_vel_pub.publish(cmd_vel)

        return response
```

## Hardware-Aware Navigation Configuration

### Workstation vs. Edge Navigation

#### Workstation Navigation (Development & Testing)
- **High-Fidelity Mapping**: Detailed costmaps with high resolution
- **Complex Planning**: Sophisticated path planning algorithms
- **Full Sensor Suite**: All available sensors for maximum awareness
- **Development Tools**: Full debugging and visualization capabilities

#### Edge Navigation (Deployment)
- **Optimized Performance**: Lightweight algorithms for real-time operation
- **Resource Efficiency**: Minimal computational overhead
- **Essential Sensors**: Only necessary sensors for navigation
- **Real-time Constraints**: Guaranteed timing for safety-critical operations

### Performance Optimization

```python
class Nav2Optimizer:
    def __init__(self, nav_mode="workstation"):
        self.nav_mode = nav_mode
        self.configure_parameters()

    def configure_parameters(self):
        """Configure Nav2 parameters based on target platform"""
        if self.nav_mode == "workstation":
            # High-performance settings for development
            self.costmap_resolution = 0.025  # High resolution (0.025m/cell)
            self.planning_frequency = 20.0   # High frequency (20Hz)
            self.controller_frequency = 50.0 # High frequency (50Hz)
            self.max_planning_attempts = 10  # More attempts for complex paths
        else:
            # Optimized settings for edge deployment
            self.costmap_resolution = 0.05   # Lower resolution (0.05m/cell)
            self.planning_frequency = 5.0    # Lower frequency (5Hz)
            self.controller_frequency = 20.0 # Lower frequency (20Hz)
            self.max_planning_attempts = 3   # Fewer attempts for speed

    def get_optimized_params(self):
        """Get optimized parameters for Nav2 configuration"""
        params = {
            'costmap_resolution': self.costmap_resolution,
            'planning_frequency': self.planning_frequency,
            'controller_frequency': self.controller_frequency,
            'max_planning_attempts': self.max_planning_attempts
        }
        return params
```

## Nav2 Best Practices

### System Configuration
1. **Tune Parameters**: Adjust parameters based on robot dynamics and environment
2. **Validate Safety**: Ensure emergency stop and obstacle detection work properly
3. **Test Gradually**: Start with simple navigation tasks and increase complexity
4. **Monitor Performance**: Track navigation success rates and execution times

### Costmap Configuration
1. **Resolution Balance**: Balance resolution with performance requirements
2. **Inflation Radius**: Set appropriate inflation for robot size and safety margin
3. **Sensor Fusion**: Properly configure multiple sensor inputs
4. **Update Rates**: Match update rates to sensor and control frequencies

### Path Planning
1. **Algorithm Selection**: Choose appropriate planners for your environment
2. **Replanning Strategy**: Configure when and how often to replan
3. **Path Smoothing**: Apply smoothing for smoother robot motion
4. **Dynamic Obstacles**: Consider moving obstacles in planning

## Practical Exercise: Complete Nav2 Navigation System

Let's create a complete Nav2 navigation system:

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from rclpy.qos import QoSProfile
from geometry_msgs.msg import PoseStamped, Twist
from nav_msgs.msg import Path, Odometry
from sensor_msgs.msg import LaserScan
from nav2_msgs.action import NavigateToPose
from tf_transformations import quaternion_from_euler
import numpy as np
import time

class CompleteNav2System(Node):
    def __init__(self):
        super().__init__('complete_nav2_system')

        # QoS profile for sensor data
        sensor_qos = QoSProfile(depth=10)

        # Subscriptions
        self.odom_sub = self.create_subscription(
            Odometry, 'odom', self.odom_callback, sensor_qos)
        self.scan_sub = self.create_subscription(
            LaserScan, 'scan', self.scan_callback, sensor_qos)

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.path_pub = self.create_publisher(Path, 'current_path', 10)

        # Action client for navigation
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')

        # Navigation state
        self.current_pose = None
        self.laser_scan = None
        self.navigation_active = False

        # Navigation parameters
        self.linear_speed = 0.3
        self.angular_speed = 0.5
        self.arrival_threshold = 0.3
        self.safety_distance = 0.5

        # Timer for safety monitoring
        self.safety_timer = self.create_timer(0.1, self.safety_monitor)

    def odom_callback(self, msg):
        """Update current robot pose"""
        if self.current_pose is None:
            self.current_pose = np.zeros(3)  # x, y, theta

        self.current_pose[0] = msg.pose.pose.position.x
        self.current_pose[1] = msg.pose.pose.position.y

        # Convert quaternion to yaw
        from tf_transformations import euler_from_quaternion
        quat = [
            msg.pose.pose.orientation.x,
            msg.pose.pose.orientation.y,
            msg.pose.pose.orientation.z,
            msg.pose.pose.orientation.w
        ]
        euler = euler_from_quaternion(quat)
        self.current_pose[2] = euler[2]

    def scan_callback(self, msg):
        """Update laser scan data"""
        self.laser_scan = msg

    def send_navigation_goal(self, x, y, theta=0.0):
        """Send navigation goal to Nav2"""
        if not self.nav_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation action server not available')
            return

        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map'
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()
        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        goal_msg.pose.pose.position.z = 0.0

        # Set orientation
        quat = quaternion_from_euler(0, 0, theta)
        goal_msg.pose.pose.orientation.x = quat[0]
        goal_msg.pose.pose.orientation.y = quat[1]
        goal_msg.pose.pose.orientation.z = quat[2]
        goal_msg.pose.pose.orientation.w = quat[3]

        self.navigation_active = True
        self.get_logger().info(f'Sending navigation goal to ({x}, {y})')

        # Send goal
        self.nav_client.send_goal_async(
            goal_msg,
            feedback_callback=self.navigation_feedback
        ).add_done_callback(self.navigation_result)

    def navigation_feedback(self, feedback_msg):
        """Handle navigation feedback"""
        self.get_logger().debug(f'Navigation progress: {feedback_msg.feedback}')

    def navigation_result(self, future):
        """Handle navigation result"""
        goal_result = future.result()
        if goal_result.status == 4:  # SUCCEEDED
            self.get_logger().info('Navigation succeeded!')
        else:
            self.get_logger().info(f'Navigation failed with status: {goal_result.status}')
        self.navigation_active = False

    def safety_monitor(self):
        """Monitor safety conditions and stop robot if needed"""
        if not self.laser_scan or not self.navigation_active:
            return

        # Check for obstacles in front of robot
        front_scan = self.laser_scan.ranges[len(self.laser_scan.ranges)//2 - 30:len(self.laser_scan.ranges)//2 + 30]

        min_distance = min([r for r in front_scan if not (np.isinf(r) or np.isnan(r))], default=float('inf'))

        if min_distance < self.safety_distance:
            self.get_logger().warn(f'Obstacle detected at {min_distance:.2f}m, stopping robot')
            self.emergency_stop()

    def emergency_stop(self):
        """Emergency stop the robot"""
        cmd_vel = Twist()
        self.cmd_vel_pub.publish(cmd_vel)
        self.get_logger().info('Emergency stop activated')

    def get_robot_position(self):
        """Get current robot position"""
        if self.current_pose is not None:
            return self.current_pose[:2]
        return None

    def is_navigation_active(self):
        """Check if navigation is currently active"""
        return self.navigation_active

def main(args=None):
    rclpy.init(args=args)

    try:
        nav_system = CompleteNav2System()

        # Example: Send a navigation goal
        time.sleep(2)  # Wait for system to initialize
        nav_system.send_navigation_goal(2.0, 2.0)  # Navigate to (2, 2)

        rclpy.spin(nav_system)
    except KeyboardInterrupt:
        print("Navigation system interrupted by user")
    finally:
        nav_system.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Academic Rigor in Nav2 Implementation

### Theoretical Foundations
- **Path Planning Theory**: Understanding of A*, Dijkstra, and other planning algorithms
- **Control Theory**: Knowledge of feedback control and trajectory following
- **Probabilistic Robotics**: Understanding of uncertainty representation and filtering
- **Real-time Systems**: Knowledge of timing constraints and deterministic behavior

### Practical Validation
- **Performance Benchmarking**: Compare navigation success rates and times
- **Safety Validation**: Ensure obstacle detection and emergency stopping work correctly
- **Parameter Tuning**: Systematically tune parameters for optimal performance
- **Reproducibility**: Ensure results can be reproduced by others

## Summary

ROS 2 Navigation Stack (Nav2) provides a comprehensive framework for autonomous robot navigation, including:

- **Modular Architecture**: Flexible, component-based design for customization
- **Path Planning**: Sophisticated global and local path planning algorithms
- **Obstacle Avoidance**: Real-time obstacle detection and avoidance
- **Recovery Behaviors**: Automatic recovery from navigation failures
- **Behavior Trees**: Complex decision-making and task orchestration

Nav2 is the standard for ROS 2 navigation, providing production-ready navigation capabilities that can be configured and tuned for specific robot platforms and environments. The system's modular design allows for customization and extension while maintaining robust performance in complex environments.

Proper configuration and tuning of Nav2 parameters is crucial for successful navigation, requiring understanding of robot dynamics, sensor characteristics, and environmental constraints.

---

:::note
Nav2 is a complex system with many configurable parameters. Start with the default configuration and gradually tune parameters based on your specific robot and environment.
:::

:::tip
Always test navigation systems in simulation first, and ensure proper safety measures are in place before deploying on real robots, especially in environments with humans or obstacles.
:::

:::warning
Navigation systems can fail in unexpected ways. Implement proper safety checks, emergency stops, and validation procedures before deployment in critical applications.
:::

:::danger
Never deploy navigation systems without proper safety measures and human oversight, especially in environments with humans or valuable property. Always validate obstacle detection and emergency stopping capabilities.
:::