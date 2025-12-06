---
id: 03-rclpy-basics
title: rclpy - Python Client Library for ROS 2
sidebar_label: rclpy Basics
sidebar_position: 3
description: Comprehensive guide to using rclpy, the Python client library for ROS 2, for robotic application development
keywords:
  - rclpy
  - python ros2
  - ros2 client library
  - robotic programming
  - python robotics
---

# rclpy - Python Client Library for ROS 2

## Introduction

rclpy is the Python client library for ROS 2, providing a Python API to interact with the ROS 2 middleware. It enables developers to create ROS 2 nodes, publishers, subscribers, services, and actions using Python. rclpy is particularly valuable for rapid prototyping, AI integration, and educational purposes due to Python's simplicity and rich ecosystem.

## Core Concepts

### Node Creation

In rclpy, all ROS 2 functionality is organized within nodes. A node is created by subclassing `rclpy.node.Node`:

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        # Initialize the node with a name
        super().__init__('my_node_name')
        # Node initialization code goes here

def main(args=None):
    # Initialize the ROS 2 client library
    rclpy.init(args=args)

    # Create an instance of your node
    my_node = MyNode()

    # Spin the node to process callbacks
    rclpy.spin(my_node)

    # Destroy the node explicitly
    my_node.destroy_node()

    # Shutdown the ROS 2 client library
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Publishers

Publishers send messages to topics. Here's how to create and use a publisher:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')

        # Create a publisher for String messages on the 'topic' topic
        self.publisher_ = self.create_publisher(String, 'topic', 10)

        # Create a timer to publish messages periodically
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Subscribers

Subscribers receive messages from topics:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')

        # Create a subscription to the 'topic' topic
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)  # QoS history depth
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()
    rclpy.spin(minimal_subscriber)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Advanced Node Features

### Parameters

Nodes can have configurable parameters:

```python
import rclpy
from rclpy.node import Node
from rclpy.parameter import Parameter

class ParameterNode(Node):
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values
        self.declare_parameter('param_name', 'default_value')
        self.declare_parameter('frequency', 1.0)
        self.declare_parameter('threshold', 0.5)

        # Get parameter values
        self.param_value = self.get_parameter('param_name').value
        self.frequency = self.get_parameter('frequency').value
        self.threshold = self.get_parameter('threshold').value

        # Create timer using parameter value
        self.timer = self.create_timer(1.0/self.frequency, self.timer_callback)

        # Add callback for parameter changes
        self.add_on_set_parameters_callback(self.parameters_callback)

    def parameters_callback(self, params):
        for param in params:
            if param.name == 'frequency' and param.type_ == Parameter.Type.DOUBLE:
                # Update timer with new frequency
                self.destroy_timer(self.timer)
                self.timer = self.create_timer(1.0/param.value, self.timer_callback)
                self.get_logger().info(f'Updated frequency to: {param.value}')
        return SetParametersResult(successful=True)

    def timer_callback(self):
        self.get_logger().info(f'Parameter value: {self.param_value}')
```

### Services

Creating service servers and clients:

```python
# Service Server
from example_interfaces.srv import AddTwoInts
import rclpy
from rclpy.node import Node

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Returning {response.sum}')
        return response

# Service Client
class MinimalClientAsync(Node):
    def __init__(self):
        super().__init__('minimal_client_async')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')

        # Wait for service to be available
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()
```

### Actions

Creating action servers and clients:

```python
# Action Server
from rclpy.action import ActionServer
from rclpy.node import Node
from example_interfaces.action import Fibonacci
import time

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback)

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')

        feedback_msg = Fibonacci.Feedback()
        feedback_msg.partial_sequence = [0, 1]

        for i in range(1, goal_handle.request.order):
            # Check if goal was canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            # Update feedback
            feedback_msg.partial_sequence.append(
                feedback_msg.partial_sequence[i] + feedback_msg.partial_sequence[i-1])

            # Publish feedback
            goal_handle.publish_feedback(feedback_msg)

            # Simulate work
            time.sleep(1)

        # Complete the goal
        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.partial_sequence
        self.get_logger().info(f'Result: {result.sequence}')
        return result
```

## Quality of Service (QoS) in rclpy

QoS profiles control the communication behavior of publishers and subscribers:

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy, QoSDurabilityPolicy

# For sensor data (best effort, keep last 10 samples)
sensor_qos = QoSProfile(
    depth=10,
    reliability=QoSReliabilityPolicy.BEST_EFFORT,
    history=QoSHistoryPolicy.KEEP_LAST,
    durability=QoSDurabilityPolicy.VOLATILE
)

# For control commands (reliable, keep last 1 sample)
control_qos = QoSProfile(
    depth=1,
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST,
    durability=QoSDurabilityPolicy.VOLATILE
)

# Using QoS in publisher/subscriber
class QoSDemoNode(Node):
    def __init__(self):
        super().__init__('qos_demo_node')

        # Publisher with custom QoS
        self.sensor_publisher = self.create_publisher(
            String,
            'sensor_data',
            sensor_qos
        )

        # Subscriber with custom QoS
        self.control_subscriber = self.create_subscription(
            String,
            'control_commands',
            self.control_callback,
            control_qos
        )
```

## Working with Different Message Types

### Standard Messages

```python
from std_msgs.msg import String, Int32, Float32, Bool
from geometry_msgs.msg import Twist, Pose, Point, Vector3
from sensor_msgs.msg import LaserScan, Image, JointState
from nav_msgs.msg import Odometry

# Publishing geometry_msgs/Twist for robot control
def publish_velocity_command(self, linear_x, angular_z):
    twist_msg = Twist()
    twist_msg.linear.x = linear_x
    twist_msg.angular.z = angular_z
    self.cmd_vel_publisher.publish(twist_msg)

# Subscribing to sensor_msgs/LaserScan
def laser_callback(self, msg):
    # Process laser scan data
    ranges = msg.ranges
    min_distance = min(ranges) if ranges else float('inf')
    self.get_logger().info(f'Min distance: {min_distance}')
```

### Custom Messages

To use custom messages, ensure your package is properly configured with message definitions:

```python
# Assuming you have a custom message RobotStatus in your_package_msgs
from your_package_msgs.msg import RobotStatus

class StatusPublisher(Node):
    def __init__(self):
        super().__init__('status_publisher')
        self.status_pub = self.create_publisher(RobotStatus, 'robot_status', 10)

    def publish_status(self, battery_level, temperature, operational):
        status_msg = RobotStatus()
        status_msg.battery_level = battery_level
        status_msg.temperature = temperature
        status_msg.operational = operational
        self.status_pub.publish(status_msg)
```

## Timer-Based Operations

Timers are essential for periodic operations:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import math

class SineWaveNode(Node):
    def __init__(self):
        super().__init__('sine_wave_node')
        self.publisher = self.create_publisher(Float32, 'sine_wave', 10)

        # Create timer with 10Hz frequency
        self.timer = self.create_timer(0.1, self.timer_callback)
        self.phase = 0.0
        self.frequency = 1.0  # Hz

    def timer_callback(self):
        # Generate sine wave value
        value = math.sin(2 * math.pi * self.frequency * self.phase)
        msg = Float32()
        msg.data = value

        self.publisher.publish(msg)
        self.get_logger().info(f'Sine wave value: {value:.3f}')

        # Increment phase
        self.phase += 0.1
```

## Exception Handling and Best Practices

### Proper Resource Management

```python
import rclpy
from rclpy.node import Node
from rclpy.exceptions import ParameterNotDeclaredException

class RobustNode(Node):
    def __init__(self):
        super().__init__('robust_node')
        self.setup_resources()

    def setup_resources(self):
        try:
            # Setup publishers, subscribers, services
            self.pub = self.create_publisher(String, 'output', 10)
            self.sub = self.create_subscription(String, 'input', self.input_callback, 10)

            # Setup parameters with defaults
            self.declare_parameter('timeout', 5.0)

        except Exception as e:
            self.get_logger().error(f'Failed to setup resources: {e}')
            raise

    def input_callback(self, msg):
        try:
            # Process message
            processed_data = msg.data.upper()
            output_msg = String()
            output_msg.data = processed_data
            self.pub.publish(output_msg)
        except Exception as e:
            self.get_logger().error(f'Error processing message: {e}')

    def destroy_node(self):
        # Clean up resources if needed
        self.get_logger().info('Cleaning up resources...')
        super().destroy_node()
```

### Logging Best Practices

```python
class LoggingDemoNode(Node):
    def __init__(self):
        super().__init__('logging_demo_node')

        # Different log levels
        self.get_logger().debug('Debug information')
        self.get_logger().info('General information')
        self.get_logger().warn('Warning message')
        self.get_logger().error('Error message')
        self.get_logger().fatal('Fatal error')

        # Formatted logging
        value = 42
        self.get_logger().info(f'Value is: {value}')
```

## Hardware-Aware Programming

### Workstation vs. Edge Considerations

When programming for both workstation and edge environments:

```python
import rclpy
from rclpy.node import Node
import sys

class HardwareAwareNode(Node):
    def __init__(self):
        super().__init__('hardware_aware_node')

        # Detect platform capabilities
        self.is_edge_device = self.detect_edge_platform()

        if self.is_edge_device:
            # Optimize for resource constraints
            self.setup_edge_optimized()
        else:
            # Use full capabilities on workstation
            self.setup_workstation_optimized()

    def detect_edge_platform(self):
        # Simple detection based on available resources
        import psutil
        total_memory_gb = psutil.virtual_memory().total / (1024**3)

        # Assume edge if less than 16GB RAM
        return total_memory_gb < 16

    def setup_edge_optimized(self):
        # Use lower resolution, reduced frequency
        self.image_qos = self.create_qos_profile(depth=1)
        self.publish_frequency = 5  # Hz
        self.get_logger().info('Configured for edge device')

    def setup_workstation_optimized(self):
        # Use higher resolution, higher frequency
        self.image_qos = self.create_qos_profile(depth=10)
        self.publish_frequency = 30  # Hz
        self.get_logger().info('Configured for workstation')
```

## Integration with Python Ecosystem

### NumPy and Scientific Computing

```python
import rclpy
from rclpy.node import Node
import numpy as np
from std_msgs.msg import Float32MultiArray

class NumpyNode(Node):
    def __init__(self):
        super().__init__('numpy_node')
        self.array_publisher = self.create_publisher(Float32MultiArray, 'numpy_array', 10)

        # Create timer for periodic operations
        self.timer = self.create_timer(1.0, self.publish_array)

    def publish_array(self):
        # Create numpy array
        data = np.random.random(10).astype(np.float32)

        # Convert to ROS message
        msg = Float32MultiArray()
        msg.data = data.tolist()  # Convert numpy array to list

        self.array_publisher.publish(msg)
        self.get_logger().info(f'Published array: {data}')
```

### OpenCV Integration

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2

class OpenCVNode(Node):
    def __init__(self):
        super().__init__('opencv_node')
        self.image_pub = self.create_publisher(Image, 'processed_image', 10)
        self.image_sub = self.create_subscription(Image, 'input_image', self.image_callback, 10)

        self.bridge = CvBridge()

    def image_callback(self, msg):
        try:
            # Convert ROS Image to OpenCV
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Process image with OpenCV
            processed_image = cv2.Canny(cv_image, 100, 200)

            # Convert back to ROS Image
            output_msg = self.bridge.cv2_to_imgmsg(processed_image, encoding='mono8')

            self.image_pub.publish(output_msg)
        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')
```

## Launch File Integration

Create launch files to run your rclpy nodes:

```python
# launch/demo_launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot_package',
            executable='my_node',
            name='my_node',
            parameters=[
                {'param1': 'value1'},
                {'param2': 42}
            ],
            remappings=[
                ('input_topic', 'remapped_input'),
                ('output_topic', 'remapped_output')
            ]
        )
    ])
```

## Practical Exercise: Robot Controller Node

Let's create a comprehensive example that demonstrates multiple rclpy concepts:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from std_msgs.msg import Float32
from rclpy.qos import QoSProfile
import math

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')

        # QoS profile for sensor data (best effort for performance)
        sensor_qos = QoSProfile(depth=5, reliability=2)  # BEST_EFFORT

        # Publishers and subscribers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.scan_sub = self.create_subscription(LaserScan, 'scan', self.scan_callback, sensor_qos)
        self.distance_pub = self.create_publisher(Float32, 'min_distance', 10)

        # Parameters
        self.declare_parameter('safety_distance', 0.5)
        self.declare_parameter('max_linear_speed', 0.5)
        self.declare_parameter('max_angular_speed', 1.0)

        # State variables
        self.min_distance = float('inf')
        self.safety_distance = self.get_parameter('safety_distance').value
        self.max_linear = self.get_parameter('max_linear_speed').value
        self.max_angular = self.get_parameter('max_angular_speed').value

        # Timer for control loop
        self.control_timer = self.create_timer(0.1, self.control_loop)

        self.get_logger().info('Robot Controller Node Initialized')

    def scan_callback(self, msg):
        # Find minimum distance in front of robot (within 30 degrees)
        if len(msg.ranges) > 0:
            # Get ranges in front of robot (±15 degrees)
            front_ranges = msg.ranges[:len(msg.ranges)//12] + msg.ranges[-len(msg.ranges)//12:]
            valid_ranges = [r for r in front_ranges if not math.isinf(r) and not math.isnan(r)]

            if valid_ranges:
                self.min_distance = min(valid_ranges)
            else:
                self.min_distance = float('inf')

        # Publish minimum distance
        dist_msg = Float32()
        dist_msg.data = self.min_distance
        self.distance_pub.publish(dist_msg)

    def control_loop(self):
        twist = Twist()

        # Simple obstacle avoidance
        if self.min_distance > self.safety_distance * 2:
            # Safe to move forward
            twist.linear.x = self.max_linear
            twist.angular.z = 0.0
        elif self.min_distance > self.safety_distance:
            # Slow down as we approach obstacle
            twist.linear.x = self.max_linear * (self.min_distance / (self.safety_distance * 2))
            twist.angular.z = 0.0
        else:
            # Stop and turn to avoid obstacle
            twist.linear.x = 0.0
            twist.angular.z = self.max_angular

        self.cmd_vel_pub.publish(twist)

        # Log state
        self.get_logger().info(f'Distance: {self.min_distance:.2f}, Command: [{twist.linear.x:.2f}, {twist.angular.z:.2f}]')

def main(args=None):
    rclpy.init(args=args)
    controller = RobotController()

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        controller.get_logger().info('Shutting down due to keyboard interrupt')
    finally:
        controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Academic Rigor in Implementation

### Theoretical Foundations
- **Event-Driven Programming**: Understanding of asynchronous, callback-based programming
- **Real-Time Systems**: Knowledge of timing constraints and deterministic behavior
- **Distributed Systems**: Understanding of node communication patterns

### Practical Validation
- **Testing**: Unit tests for individual functions and integration tests for complete nodes
- **Documentation**: Proper docstrings and API documentation
- **Performance Analysis**: Profiling node execution and resource usage

## Best Practices Summary

1. **Always call `rclpy.init()` and `rclpy.shutdown()`** to properly manage the ROS client library lifecycle
2. **Use `rclpy.spin()`** to process callbacks and keep your node running
3. **Implement proper exception handling** to ensure robust operation
4. **Use appropriate QoS profiles** based on your application's requirements
5. **Declare parameters** to make your nodes configurable
6. **Use logging** instead of print statements for debugging information
7. **Clean up resources** in `destroy_node()` when needed
8. **Follow naming conventions** for topics, services, and parameters

## Summary

rclpy provides a powerful and Pythonic interface to ROS 2, enabling rapid development of robotic applications. Its integration with Python's rich ecosystem makes it ideal for AI integration, data processing, and educational purposes. Understanding rclpy fundamentals is essential for effective robotic development in the ROS 2 ecosystem.

The library's design emphasizes ease of use while maintaining the robust communication patterns necessary for complex robotic systems. Whether developing on resource-rich workstations or constrained edge devices, rclpy provides the tools needed to create effective robotic applications.

---

:::note
rclpy is particularly valuable for AI integration due to Python's rich ecosystem of machine learning and data processing libraries. This makes it ideal for Physical AI applications.
:::

:::tip
Start with simple examples and gradually build complexity. Understanding the callback-based programming model is crucial for effective rclpy development.
:::

:::warning
Be mindful of timing constraints when running on edge devices. Python's garbage collection and interpreter overhead may affect real-time performance.
:::

:::danger
Always implement proper error handling in robotic applications. Unhandled exceptions can cause robot systems to stop responding, potentially leading to safety issues.
:::