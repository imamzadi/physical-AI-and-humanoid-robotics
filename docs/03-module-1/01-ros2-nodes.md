---
id: 01-ros2-nodes
title: ROS 2 Nodes, Topics, Services, and Actions
sidebar_label: ROS 2 Fundamentals
sidebar_position: 1
description: Comprehensive guide to ROS 2 communication patterns including nodes, topics, services, and actions for robotic systems
keywords:
  - ros2
  - nodes
  - topics
  - services
  - actions
  - robotic communication
---

# ROS 2 Nodes, Topics, Services, and Actions

## Introduction

Robot Operating System 2 (ROS 2) provides the communication infrastructure for robotic applications. Understanding the fundamental communication patterns is essential for building robust, modular robotic systems. This chapter covers the core concepts of ROS 2: nodes, topics, services, and actions.

## Core Architecture Concepts

### Nodes

A **node** is a process that performs computation. In ROS 2, nodes are the fundamental building blocks of a robotic application. Each node typically performs a specific task and communicates with other nodes to achieve complex behaviors.

#### Node Characteristics
- **Process-based**: Each node runs as a separate process
- **Namespaced**: Nodes have unique names within the ROS graph
- **Communicative**: Nodes interact through topics, services, and actions
- **Modular**: Each node performs a specific function

#### Creating a Node in Python (rclpy)

```python
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
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

### Topics

**Topics** enable asynchronous, many-to-many communication between nodes using a publish-subscribe pattern. Publishers send messages to topics, and subscribers receive messages from topics.

#### Topic Characteristics
- **Asynchronous**: Publishers and subscribers don't need to run simultaneously
- **Many-to-many**: Multiple publishers and subscribers can use the same topic
- **Unidirectional**: Data flows in one direction (publisher → subscriber)
- **Message-based**: Communication uses standardized message types

#### Publisher Example

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__('talker')
        self.publisher = self.create_publisher(String, 'chatter', 10)
        timer_period = 0.5
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: {msg.data}')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    talker = Talker()
    rclpy.spin(talker)
    talker.destroy_node()
    rclpy.shutdown()
```

#### Subscriber Example

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Listener(Node):
    def __init__(self):
        super().__init__('listener')
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: {msg.data}')

def main(args=None):
    rclpy.init(args=args)
    listener = Listener()
    rclpy.spin(listener)
    listener.destroy_node()
    rclpy.shutdown()
```

### Services

**Services** enable synchronous, request-response communication between nodes. A service client sends a request and waits for a response from a service server.

#### Service Characteristics
- **Synchronous**: Client waits for response from server
- **Request-response**: One request generates one response
- **Two-way**: Data flows in both directions
- **Blocking**: Client is blocked until response received

#### Service Definition Example (add_two_ints.srv)

```
int64 a
int64 b
---
int64 sum
```

#### Service Server Example

```python
from example_interfaces.srv import AddTwoInts
import rclpy
from rclpy.node import Node

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Returning {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    minimal_service = MinimalService()
    rclpy.spin(minimal_service)
    rclpy.shutdown()
```

#### Service Client Example

```python
from example_interfaces.srv import AddTwoInts
import rclpy
from rclpy.node import Node

class MinimalClientAsync(Node):
    def __init__(self):
        super().__init__('minimal_client_async')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('service not available, waiting again...')
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()

def main(args=None):
    rclpy.init(args=args)
    minimal_client = MinimalClientAsync()
    response = minimal_client.send_request(1, 2)
    minimal_client.get_logger().info(f'Result of add_two_ints: {response.sum}')
    minimal_client.destroy_node()
    rclpy.shutdown()
```

### Actions

**Actions** enable goal-oriented, long-running communication between nodes. Actions are ideal for tasks that take time to complete and may provide feedback during execution.

#### Action Characteristics
- **Goal-oriented**: Designed for long-running tasks
- **Feedback**: Provides intermediate feedback during execution
- **Preemption**: Goals can be canceled or preempted
- **Status tracking**: Monitors execution status

#### Action Definition Example (Fibonacci.action)

```
int32 order
---
int32[] sequence
---
int32[] partial_sequence
```

#### Action Server Example

```python
from rclpy.action import ActionServer
from rclpy.node import Node
from example_interfaces.action import Fibonacci

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
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            feedback_msg.partial_sequence.append(
                feedback_msg.partial_sequence[i] + feedback_msg.partial_sequence[i-1])

            goal_handle.publish_feedback(feedback_msg)
            time.sleep(1)

        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.partial_sequence
        self.get_logger().info(f'Result: {result.sequence}')
        return result
```

## Quality of Service (QoS) Profiles

QoS profiles allow you to specify communication behavior for topics and services, particularly important for real-time and safety-critical systems.

### Common QoS Profiles

#### Sensor Data (Reliability: Best Effort)
```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy

sensor_qos = QoSProfile(
    depth=10,
    reliability=QoSReliabilityPolicy.BEST_EFFORT,
    history=QoSHistoryPolicy.KEEP_LAST
)
```

#### Control Commands (Reliability: Reliable)
```python
control_qos = QoSProfile(
    depth=10,
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST
)
```

## Launch Files

Launch files allow you to start multiple nodes with a single command and configure their parameters.

### Launch File Example

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='demo_nodes_py',
            executable='talker',
            name='talker',
            parameters=[
                {'param_name': 'param_value'}
            ],
            remappings=[
                ('original_topic', 'new_topic')
            ]
        ),
        Node(
            package='demo_nodes_py',
            executable='listener',
            name='listener'
        )
    ])
```

## Hardware Awareness in ROS 2

### Workstation vs. Edge Considerations

#### Workstation (Simulation Environment)
- **High-bandwidth communication**: Multiple high-resolution sensors
- **Complex processing**: Detailed physics simulation, complex AI models
- **Development tools**: Full visualization and debugging capabilities

#### Edge (Real Robot Control)
- **Bandwidth limitations**: Optimize message rates and sizes
- **Real-time constraints**: Deterministic execution for safety-critical tasks
- **Resource constraints**: Limited CPU, memory, and power

### Network Configuration for Multi-Machine Systems

```python
# Environment variables for multi-machine communication
# On workstation:
export ROS_DOMAIN_ID=10
export ROS_LOCALHOST_ONLY=0

# On edge device:
export ROS_DOMAIN_ID=10
export ROS_LOCALHOST_ONLY=0
```

## Best Practices and Safety Considerations

### Node Design Best Practices

1. **Single Responsibility**: Each node should perform one primary function
2. **Error Handling**: Implement proper exception handling and recovery
3. **Resource Management**: Properly clean up resources when shutting down
4. **Logging**: Use appropriate log levels for debugging and monitoring

### Safety in Communication

1. **Validation**: Always validate incoming data before processing
2. **Limits**: Implement joint and velocity limits in control nodes
3. **Emergency Stop**: Implement global emergency stop mechanisms
4. **Monitoring**: Continuously monitor system state and health

## Practical Exercise: Temperature Monitoring System

Let's create a practical example that demonstrates all communication patterns:

### Publisher Node (Temperature Sensor Simulation)

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class TemperatureSensor(Node):
    def __init__(self):
        super().__init__('temperature_sensor')
        self.publisher = self.create_publisher(Float32, 'temperature', 10)
        timer_period = 1.0  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

    def timer_callback(self):
        msg = Float32()
        # Simulate temperature reading with some noise
        msg.data = 20.0 + random.uniform(-2.0, 2.0)  # Room temperature ± noise
        self.publisher.publish(msg)
        self.get_logger().info(f'Temperature: {msg.data:.2f}°C')

def main(args=None):
    rclpy.init(args=args)
    temp_sensor = TemperatureSensor()
    rclpy.spin(temp_sensor)
    temp_sensor.destroy_node()
    rclpy.shutdown()
```

### Service Node (Temperature Calibration)

```python
from example_interfaces.srv import Trigger
import rclpy
from rclpy.node import Node

class TemperatureCalibrator(Node):
    def __init__(self):
        super().__init__('temperature_calibrator')
        self.srv = self.create_service(
            Trigger,
            'calibrate_temperature',
            self.calibrate_callback)
        self.calibration_offset = 0.0

    def calibrate_callback(self, request, response):
        # In a real system, this would perform actual calibration
        self.calibration_offset = 0.0  # Reset offset
        response.success = True
        response.message = f'Temperature calibrated with offset: {self.calibration_offset}'
        self.get_logger().info(response.message)
        return response

def main(args=None):
    rclpy.init(args=args)
    calibrator = TemperatureCalibrator()
    rclpy.spin(calibrator)
    calibrator.destroy_node()
    rclpy.shutdown()
```

## Academic Rigor in Implementation

### Theoretical Foundations
- **Distributed Systems**: Understanding of asynchronous communication patterns
- **Real-time Systems**: Knowledge of timing constraints and deterministic behavior
- **System Architecture**: Principles of modular, decoupled system design

### Practical Validation
- **Testing**: Unit tests for individual nodes, integration tests for systems
- **Documentation**: Clear API documentation and system architecture diagrams
- **Performance Analysis**: Profiling communication overhead and timing

## Summary

ROS 2 communication patterns form the backbone of robotic systems:

- **Nodes** provide modular computation units
- **Topics** enable asynchronous data distribution
- **Services** provide synchronous request-response communication
- **Actions** enable goal-oriented, long-running operations

Understanding these patterns is crucial for building robust, scalable robotic systems that can operate effectively in both simulation and real-world environments. The proper selection and implementation of communication patterns directly impacts system performance, reliability, and safety.

---

:::note
Mastering ROS 2 communication patterns is fundamental to robotic development. These patterns will be used extensively throughout the course and in real robotic applications.
:::

:::tip
Start with simple examples and gradually build complexity. Understanding the basics thoroughly will make advanced concepts much easier to grasp.
:::

:::warning
Always consider timing and reliability requirements when choosing communication patterns. Real-time systems have different requirements than offline processing.
:::

:::danger
Never ignore error conditions in robotic communication. Proper error handling is essential for safe robot operation.
:::