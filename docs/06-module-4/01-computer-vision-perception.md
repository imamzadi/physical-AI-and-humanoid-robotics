---
id: 01-computer-vision-perception
title: Computer Vision and Perception for Robotics
sidebar_label: Computer Vision & Perception
sidebar_position: 1
description: Comprehensive guide to computer vision and perception systems in robotics, including image processing, feature detection, and 3D perception techniques
keywords:
  - computer vision
  - robotics perception
  - image processing
  - opencv
  - 3d perception
  - feature detection
  - depth sensing
---

# Computer Vision and Perception for Robotics

## Introduction

Computer vision and perception are fundamental components of modern robotics, enabling robots to understand and interact with their environment. In robotics, perception systems process visual information from cameras, LiDAR, and other sensors to identify objects, navigate spaces, and make intelligent decisions. This module explores the integration of computer vision techniques with ROS 2, covering fundamental concepts, practical implementations, and advanced perception algorithms.

## Perception Fundamentals

### Overview of Robot Perception

Robot perception encompasses the ability of a robot to interpret sensory data from its environment. This includes:

- **Visual Perception**: Processing camera images and video streams
- **Depth Perception**: Understanding 3D spatial relationships
- **Object Recognition**: Identifying and classifying objects
- **Scene Understanding**: Comprehending the context and relationships between objects
- **Sensor Fusion**: Combining data from multiple sensors for robust perception

### Types of Sensors in Robotics

#### Vision Sensors
- **RGB Cameras**: Provide color image data
- **Monochrome Cameras**: Higher sensitivity, faster processing
- **Stereo Cameras**: Depth estimation through disparity
- **Event Cameras**: Ultra-fast response to motion

#### Depth Sensors
- **LiDAR**: Precise distance measurements using laser pulses
- **Structured Light**: Pattern projection for depth estimation
- **Time-of-Flight**: Direct distance measurement
- **Stereo Vision**: Depth from multiple camera views

## ROS 2 Image Processing Infrastructure

### Image Transport

ROS 2 provides the `image_transport` package for efficient image data transmission. This package supports various compression formats and transport mechanisms optimized for image data.

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2

class ImageSubscriber(Node):
    def __init__(self):
        super().__init__('image_subscriber')

        # Create CV bridge for converting between ROS and OpenCV formats
        self.bridge = CvBridge()

        # Subscribe to image topic
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )
        self.subscription  # Prevent unused variable warning

    def image_callback(self, msg):
        """Convert ROS Image message to OpenCV image"""
        try:
            # Convert ROS Image message to OpenCV image
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Process the image
            processed_image = self.process_image(cv_image)

            # Display the image
            cv2.imshow('Robot Camera', processed_image)
            cv2.waitKey(1)

        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def process_image(self, image):
        """Example image processing function"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Apply threshold
        _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)

        # Convert back to BGR for display
        result = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)

        return result

def main(args=None):
    rclpy.init(args=args)
    image_subscriber = ImageSubscriber()

    try:
        rclpy.spin(image_subscriber)
    except KeyboardInterrupt:
        pass
    finally:
        image_subscriber.destroy_node()
        rclpy.shutdown()
        cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
```

### Image Publisher

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class ImagePublisher(Node):
    def __init__(self):
        super().__init__('image_publisher')

        # Create publisher
        self.publisher = self.create_publisher(Image, '/camera/image_processed', 10)

        # Create CV bridge
        self.bridge = CvBridge()

        # Timer for publishing images
        self.timer = self.create_timer(0.1, self.publish_image)

        # Initialize camera
        self.cap = cv2.VideoCapture(0)

    def publish_image(self):
        """Capture and publish image"""
        ret, frame = self.cap.read()
        if ret:
            # Process frame (example: add timestamp)
            height, width = frame.shape[:2]
            timestamp_text = f"Time: {self.get_clock().now().seconds_nanoseconds()}"
            cv2.putText(frame, timestamp_text, (10, height - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

            # Convert OpenCV image to ROS Image message
            ros_image = self.bridge.cv2_to_imgmsg(frame, encoding='bgr8')

            # Publish image
            self.publisher.publish(ros_image)

    def destroy_node(self):
        """Clean up resources"""
        self.cap.release()
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    image_publisher = ImagePublisher()

    try:
        rclpy.spin(image_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        image_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## OpenCV Integration with ROS 2

### Setting up OpenCV in ROS 2

OpenCV integration in ROS 2 is facilitated through the `cv_bridge` package, which provides conversions between ROS image messages and OpenCV image formats.

```xml
<!-- package.xml dependencies -->
<depend>cv_bridge</depend>
<depend>sensor_msgs</depend>
<depend>std_msgs</depend>
```

### Basic Image Processing Pipeline

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class ImageProcessor(Node):
    def __init__(self):
        super().__init__('image_processor')

        self.bridge = CvBridge()

        # Subscriptions
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Publishers
        self.edge_pub = self.create_publisher(Image, '/camera/edges', 10)
        self.contour_pub = self.create_publisher(Image, '/camera/contours', 10)
        self.feature_pub = self.create_publisher(Image, '/camera/features', 10)

        # Processing parameters
        self.canny_low = 50
        self.canny_high = 150

        self.get_logger().info('Image processor initialized')

    def image_callback(self, msg):
        """Process incoming image"""
        try:
            # Convert ROS image to OpenCV
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Perform edge detection
            edges = self.edge_detection(cv_image)

            # Find contours
            contour_img = self.find_contours(cv_image.copy(), edges)

            # Detect features
            feature_img = self.feature_detection(cv_image.copy())

            # Publish results
            self.edge_pub.publish(self.bridge.cv2_to_imgmsg(edges, encoding='mono8'))
            self.contour_pub.publish(self.bridge.cv2_to_imgmsg(contour_img, encoding='bgr8'))
            self.feature_pub.publish(self.bridge.cv2_to_imgmsg(feature_img, encoding='bgr8'))

        except Exception as e:
            self.get_logger().error(f'Error in image processing: {e}')

    def edge_detection(self, image):
        """Apply Canny edge detection"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, self.canny_low, self.canny_high)
        return edges

    def find_contours(self, image, edges):
        """Find and draw contours on image"""
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Draw contours
        cv2.drawContours(image, contours, -1, (0, 255, 0), 2)

        return image

    def feature_detection(self, image):
        """Detect and draw features (corners)"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Harris corner detection
        corners = cv2.cornerHarris(gray, 2, 3, 0.04)

        # Dilate to mark corners
        corners = cv2.dilate(corners, None)

        # Mark corners on image
        image[corners > 0.01 * corners.max()] = [0, 0, 255]

        return image

def main(args=None):
    rclpy.init(args=args)
    processor = ImageProcessor()

    try:
        rclpy.spin(processor)
    except KeyboardInterrupt:
        pass
    finally:
        processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Feature Detection and Matching

### SIFT Feature Detection

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class FeatureDetector(Node):
    def __init__(self):
        super().__init__('feature_detector')

        self.bridge = CvBridge()

        # Create SIFT detector
        self.sift = cv2.SIFT_create()

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.feature_pub = self.create_publisher(Image, '/camera/features_detected', 10)

    def image_callback(self, msg):
        """Detect features in image"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Convert to grayscale
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

            # Detect SIFT features
            keypoints, descriptors = self.sift.detectAndCompute(gray, None)

            # Draw keypoints
            feature_img = cv2.drawKeypoints(
                cv_image, keypoints, None,
                flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS
            )

            # Publish result
            self.feature_pub.publish(self.bridge.cv2_to_imgmsg(feature_img, encoding='bgr8'))

            self.get_logger().info(f'Detected {len(keypoints) if keypoints else 0} features')

        except Exception as e:
            self.get_logger().error(f'Error in feature detection: {e}')

def main(args=None):
    rclpy.init(args=args)
    detector = FeatureDetector()

    try:
        rclpy.spin(detector)
    except KeyboardInterrupt:
        pass
    finally:
        detector.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Template Matching

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class TemplateMatcher(Node):
    def __init__(self):
        super().__init__('template_matcher')

        self.bridge = CvBridge()

        # Load template image
        self.template = cv2.imread('template.jpg', 0)
        if self.template is None:
            self.get_logger().error('Template image not found!')
            return

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.match_pub = self.create_publisher(Image, '/camera/template_matches', 10)

        # Template matching parameters
        self.match_threshold = 0.8

    def image_callback(self, msg):
        """Perform template matching"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

            # Perform template matching
            result = cv2.matchTemplate(gray, self.template, cv2.TM_CCOEFF_NORMED)

            # Find locations where matching exceeds threshold
            locations = np.where(result >= self.match_threshold)

            # Draw rectangles around matches
            h, w = self.template.shape
            for pt in zip(*locations[::-1]):
                cv2.rectangle(cv_image, pt, (pt[0] + w, pt[1] + h), (0, 255, 0), 2)

            # Publish result
            self.match_pub.publish(self.bridge.cv2_to_imgmsg(cv_image, encoding='bgr8'))

        except Exception as e:
            self.get_logger().error(f'Error in template matching: {e}')

def main(args=None):
    rclpy.init(args=args)
    matcher = TemplateMatcher()

    try:
        rclpy.spin(matcher)
    except KeyboardInterrupt:
        pass
    finally:
        matcher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Color-based Object Detection

### HSV Color Space Processing

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class ColorDetector(Node):
    def __init__(self):
        super().__init__('color_detector')

        self.bridge = CvBridge()

        # Define color ranges (HSV)
        self.color_ranges = {
            'red': [(0, 50, 50), (10, 255, 255)],
            'red2': [(170, 50, 50), (180, 255, 255)],  # Red wraps around
            'blue': [(100, 50, 50), (130, 255, 255)],
            'green': [(40, 50, 50), (80, 255, 255)],
            'yellow': [(20, 50, 50), (40, 255, 255)]
        }

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.mask_pub = self.create_publisher(Image, '/camera/color_mask', 10)
        self.result_pub = self.create_publisher(Image, '/camera/color_detection', 10)

    def image_callback(self, msg):
        """Detect colored objects in image"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Convert to HSV
            hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)

            # Create combined mask
            combined_mask = np.zeros(hsv.shape[:2], dtype=np.uint8)

            # Apply each color range
            for color_name, (lower, upper) in self.color_ranges.items():
                mask = cv2.inRange(hsv, lower, upper)
                combined_mask = cv2.bitwise_or(combined_mask, mask)

            # Find contours in the combined mask
            contours, _ = cv2.findContours(
                combined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )

            # Filter contours by area and draw bounding boxes
            result_image = cv_image.copy()
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 500:  # Filter small contours
                    x, y, w, h = cv2.boundingRect(contour)
                    cv2.rectangle(result_image, (x, y), (x + w, y + h), (0, 255, 0), 2)

                    # Add label
                    cv2.putText(result_image, 'Object', (x, y - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

            # Publish mask and result
            self.mask_pub.publish(self.bridge.cv2_to_imgmsg(combined_mask, encoding='mono8'))
            self.result_pub.publish(self.bridge.cv2_to_imgmsg(result_image, encoding='bgr8'))

        except Exception as e:
            self.get_logger().error(f'Error in color detection: {e}')

def main(args=None):
    rclpy.init(args=args)
    detector = ColorDetector()

    try:
        rclpy.spin(detector)
    except KeyboardInterrupt:
        pass
    finally:
        detector.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 3D Perception and Depth Processing

### Depth Image Processing

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from cv_bridge import CvBridge
import cv2
import numpy as np

class DepthProcessor(Node):
    def __init__(self):
        super().__init__('depth_processor')

        self.bridge = CvBridge()
        self.camera_info = None
        self.intrinsic_matrix = None

        # Subscriptions
        self.depth_sub = self.create_subscription(
            Image,
            '/camera/depth/image_rect_raw',
            self.depth_callback,
            10
        )

        self.info_sub = self.create_subscription(
            CameraInfo,
            '/camera/depth/camera_info',
            self.info_callback,
            10
        )

        # Publishers
        self.obstacle_pub = self.create_publisher(Image, '/camera/obstacle_map', 10)
        self.pointcloud_pub = self.create_publisher(Image, '/camera/pointcloud_viz', 10)

    def info_callback(self, msg):
        """Store camera intrinsic parameters"""
        if self.intrinsic_matrix is None:
            self.intrinsic_matrix = np.array(msg.k).reshape(3, 3)

    def depth_callback(self, msg):
        """Process depth image"""
        try:
            # Convert depth image to numpy array
            depth_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='passthrough')

            # Convert to float32 for processing
            depth_array = np.array(depth_image, dtype=np.float32)

            # Create obstacle map (threshold-based)
            obstacle_threshold = 1.0  # meters
            obstacle_map = np.zeros_like(depth_array, dtype=np.uint8)
            obstacle_map[depth_array < obstacle_threshold] = 255

            # Create depth visualization
            depth_viz = self.create_depth_visualization(depth_array)

            # Publish results
            self.obstacle_pub.publish(self.bridge.cv2_to_imgmsg(obstacle_map, encoding='mono8'))
            self.pointcloud_pub.publish(self.bridge.cv2_to_imgmsg(depth_viz, encoding='bgr8'))

            # Log statistics
            valid_depths = depth_array[depth_array > 0]
            if len(valid_depths) > 0:
                avg_depth = np.mean(valid_depths)
                min_depth = np.min(valid_depths)
                max_depth = np.max(valid_depths)
                self.get_logger().info(
                    f'Depth stats - Avg: {avg_depth:.2f}m, '
                    f'Min: {min_depth:.2f}m, Max: {max_depth:.2f}m'
                )

        except Exception as e:
            self.get_logger().error(f'Error processing depth image: {e}')

    def create_depth_visualization(self, depth_array):
        """Create color visualization of depth data"""
        # Normalize depth values to 0-255 range
        normalized = np.zeros_like(depth_array)
        valid_mask = depth_array > 0
        if np.any(valid_mask):
            min_depth = np.min(depth_array[valid_mask])
            max_depth = np.max(depth_array[valid_mask])
            if max_depth > min_depth:
                normalized = ((depth_array - min_depth) / (max_depth - min_depth) * 255).astype(np.uint8)

        # Apply colormap
        depth_viz = cv2.applyColorMap(normalized, cv2.COLORMAP_JET)

        # Set invalid regions to black
        depth_viz[~valid_mask] = [0, 0, 0]

        return depth_viz

def main(args=None):
    rclpy.init(args=args)
    processor = DepthProcessor()

    try:
        rclpy.spin(processor)
    except KeyboardInterrupt:
        pass
    finally:
        processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Point Cloud Processing

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import PointCloud2, PointField
from sensor_msgs_py import point_cloud2
from std_msgs.msg import Header
import numpy as np

class PointCloudProcessor(Node):
    def __init__(self):
        super().__init__('pointcloud_processor')

        # Subscription
        self.pc_sub = self.create_subscription(
            PointCloud2,
            '/camera/depth/points',
            self.pointcloud_callback,
            10
        )

        # Publisher for processed point cloud
        self.processed_pub = self.create_publisher(PointCloud2, '/camera/points_processed', 10)

    def pointcloud_callback(self, msg):
        """Process incoming point cloud"""
        try:
            # Extract point cloud data
            points_list = []
            for point in point_cloud2.read_points(msg, field_names=("x", "y", "z"), skip_nans=True):
                points_list.append([point[0], point[1], point[2]])

            if not points_list:
                return

            points = np.array(points_list)

            # Apply processing: remove ground plane
            processed_points = self.remove_ground_plane(points)

            # Create new point cloud message
            header = Header()
            header.stamp = self.get_clock().now().to_msg()
            header.frame_id = msg.header.frame_id

            # Define fields for point cloud
            fields = [
                PointField(name='x', offset=0, datatype=PointField.FLOAT32, count=1),
                PointField(name='y', offset=4, datatype=PointField.FLOAT32, count=1),
                PointField(name='z', offset=8, datatype=PointField.FLOAT32, count=1)
            ]

            # Create and publish processed point cloud
            processed_msg = point_cloud2.create_cloud(header, fields, processed_points)
            self.processed_pub.publish(processed_msg)

            self.get_logger().info(f'Processed point cloud: {len(processed_points)} points after ground removal')

        except Exception as e:
            self.get_logger().error(f'Error processing point cloud: {e}')

    def remove_ground_plane(self, points, ground_z_threshold=-0.1):
        """Remove ground plane from point cloud"""
        # Filter points above ground threshold
        filtered_points = points[points[:, 2] > ground_z_threshold]
        return filtered_points

def main(args=None):
    rclpy.init(args=args)
    processor = PointCloudProcessor()

    try:
        rclpy.spin(processor)
    except KeyboardInterrupt:
        pass
    finally:
        processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Object Detection with Deep Learning

### YOLO Integration

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class YOLODetector(Node):
    def __init__(self):
        super().__init__('yolo_detector')

        self.bridge = CvBridge()

        # Load YOLO model
        self.net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')

        # Load class names
        with open('coco.names', 'r') as f:
            self.classes = [line.strip() for line in f.readlines()]

        # Get output layer names
        layer_names = self.net.getLayerNames()
        self.output_layers = [layer_names[i[0] - 1] for i in self.net.getUnconnectedOutLayers()]

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.detection_pub = self.create_publisher(Image, '/camera/detections', 10)

    def image_callback(self, msg):
        """Detect objects using YOLO"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Prepare image for YOLO
            height, width, channels = cv_image.shape
            blob = cv2.dnn.blobFromImage(cv_image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)

            # Set input to network
            self.net.setInput(blob)

            # Run forward pass
            outputs = self.net.forward(self.output_layers)

            # Process detections
            boxes, confidences, class_ids = self.process_detections(outputs, width, height)

            # Apply non-maximum suppression
            indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

            # Draw detections
            detection_img = self.draw_detections(cv_image, boxes, confidences, class_ids, indices)

            # Publish result
            self.detection_pub.publish(self.bridge.cv2_to_imgmsg(detection_img, encoding='bgr8'))

        except Exception as e:
            self.get_logger().error(f'Error in YOLO detection: {e}')

    def process_detections(self, outputs, width, height):
        """Process YOLO outputs to extract bounding boxes"""
        boxes = []
        confidences = []
        class_ids = []

        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.5:  # Confidence threshold
                    # Object detected
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    # Rectangle coordinates
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        return boxes, confidences, class_ids

    def draw_detections(self, image, boxes, confidences, class_ids, indices):
        """Draw detection results on image"""
        if len(indices) > 0:
            for i in indices.flatten():
                x, y, w, h = boxes[i]
                label = f"{self.classes[class_ids[i]]}: {confidences[i]:.2f}"

                # Draw bounding box
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Draw label
                cv2.putText(image, label, (x, y - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        return image

def main(args=None):
    rclpy.init(args=args)
    detector = YOLODetector()

    try:
        rclpy.spin(detector)
    except KeyboardInterrupt:
        pass
    finally:
        detector.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Perception for Navigation

### Obstacle Detection for Navigation

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import cv2
import numpy as np

class PerceptionNavigator(Node):
    def __init__(self):
        super().__init__('perception_navigator')

        self.bridge = CvBridge()
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        # Image subscription for visual obstacle detection
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Laser scan subscription for precise obstacle detection
        self.scan_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        # Control parameters
        self.linear_speed = 0.3
        self.angular_speed = 0.5
        self.obstacle_distance_threshold = 0.8
        self.visual_obstacle_threshold = 0.3  # Fraction of image that's obstacles

        # Robot state
        self.obstacle_detected = False
        self.obstacle_direction = 0  # -1 for left, 0 for center, 1 for right
        self.laser_scan = None

        # Timer for navigation control
        self.nav_timer = self.create_timer(0.1, self.navigation_control)

    def scan_callback(self, msg):
        """Process laser scan data for obstacle detection"""
        self.laser_scan = msg

        # Check for obstacles in front
        front_range = len(msg.ranges) // 2
        front_ranges = msg.ranges[front_range-30:front_range+30]

        # Remove invalid readings
        valid_ranges = [r for r in front_ranges if not (np.isinf(r) or np.isnan(r))]

        if valid_ranges:
            min_distance = min(valid_ranges)
            self.obstacle_detected = min_distance < self.obstacle_distance_threshold

            if self.obstacle_detected:
                # Determine obstacle direction based on left/right ranges
                left_ranges = msg.ranges[front_range-60:front_range-30]
                right_ranges = msg.ranges[front_range+30:front_range+60]

                left_distances = [r for r in left_ranges if not (np.isinf(r) or np.isnan(r))]
                right_distances = [r for r in right_ranges if not (np.isinf(r) or np.isnan(r))]

                if left_distances and right_distances:
                    avg_left = np.mean(left_distances)
                    avg_right = np.mean(right_distances)

                    if avg_left > avg_right:
                        self.obstacle_direction = 1  # Move right
                    else:
                        self.obstacle_direction = -1  # Move left
                elif left_distances:
                    self.obstacle_direction = 1  # Move right
                elif right_distances:
                    self.obstacle_direction = -1  # Move left
                else:
                    self.obstacle_direction = 0  # Stop

    def image_callback(self, msg):
        """Process image for visual obstacle detection"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Convert to HSV for color-based obstacle detection
            hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)

            # Define obstacle color range (e.g., red for danger)
            lower_red = np.array([0, 50, 50])
            upper_red = np.array([10, 255, 255])
            mask1 = cv2.inRange(hsv, lower_red, upper_red)

            lower_red = np.array([170, 50, 50])
            upper_red = np.array([180, 255, 255])
            mask2 = cv2.inRange(hsv, lower_red, upper_red)

            # Combine masks
            obstacle_mask = cv2.bitwise_or(mask1, mask2)

            # Calculate fraction of image that's obstacles
            obstacle_fraction = np.sum(obstacle_mask > 0) / (obstacle_mask.shape[0] * obstacle_mask.shape[1])

            # Update obstacle detection based on visual input
            if obstacle_fraction > self.visual_obstacle_threshold:
                self.obstacle_detected = True
                # Determine direction based on where obstacles are detected
                height, width = obstacle_mask.shape
                left_half = obstacle_mask[:, :width//2]
                right_half = obstacle_mask[:, width//2:]

                left_obstacles = np.sum(left_half > 0)
                right_obstacles = np.sum(right_half > 0)

                if left_obstacles > right_obstacles:
                    self.obstacle_direction = 1  # Move right
                else:
                    self.obstacle_direction = -1  # Move left

        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def navigation_control(self):
        """Main navigation control logic"""
        cmd_vel = Twist()

        if self.obstacle_detected:
            # Obstacle detected - avoid
            if self.obstacle_direction == 1:
                # Move right
                cmd_vel.linear.x = 0.0
                cmd_vel.angular.z = -self.angular_speed
            elif self.obstacle_direction == -1:
                # Move left
                cmd_vel.linear.x = 0.0
                cmd_vel.angular.z = self.angular_speed
            else:
                # Stop
                cmd_vel.linear.x = 0.0
                cmd_vel.angular.z = 0.0
        else:
            # No obstacles - move forward
            cmd_vel.linear.x = self.linear_speed
            cmd_vel.angular.z = 0.0

        # Publish command
        self.cmd_vel_pub.publish(cmd_vel)

def main(args=None):
    rclpy.init(args=args)
    navigator = PerceptionNavigator()

    try:
        rclpy.spin(navigator)
    except KeyboardInterrupt:
        pass
    finally:
        navigator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Performance Optimization for Perception

### Multi-threaded Image Processing

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np
import threading
from queue import Queue

class MultiThreadedImageProcessor(Node):
    def __init__(self):
        super().__init__('multithreaded_image_processor')

        self.bridge = CvBridge()

        # Queues for image processing pipeline
        self.input_queue = Queue(maxsize=2)  # Limit queue size to prevent memory buildup
        self.output_queue = Queue(maxsize=2)

        # Processing threads
        self.processing_thread = threading.Thread(target=self.process_images, daemon=True)
        self.publishing_thread = threading.Thread(target=self.publish_results, daemon=True)

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.result_pub = self.create_publisher(Image, '/camera/processed_multithreaded', 10)

        # Start processing threads
        self.processing_thread.start()
        self.publishing_thread.start()

        self.get_logger().info('Multi-threaded image processor started')

    def image_callback(self, msg):
        """Add image to processing queue"""
        try:
            # Convert ROS image to OpenCV
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Add to input queue if not full
            if not self.input_queue.full():
                self.input_queue.put((msg.header, cv_image))
            else:
                self.get_logger().warn('Input queue full, dropping frame')

        except Exception as e:
            self.get_logger().error(f'Error in image callback: {e}')

    def process_images(self):
        """Process images in separate thread"""
        while rclpy.ok():
            try:
                # Get image from queue
                if not self.input_queue.empty():
                    header, cv_image = self.input_queue.get(timeout=0.1)

                    # Perform image processing
                    processed_image = self.complex_image_processing(cv_image)

                    # Add to output queue
                    if not self.output_queue.full():
                        self.output_queue.put((header, processed_image))

            except Exception as e:
                self.get_logger().error(f'Error in processing thread: {e}')

    def publish_results(self):
        """Publish processed results in separate thread"""
        while rclpy.ok():
            try:
                # Get processed image from queue
                if not self.output_queue.empty():
                    header, processed_image = self.output_queue.get(timeout=0.1)

                    # Convert back to ROS image
                    ros_image = self.bridge.cv2_to_imgmsg(processed_image, encoding='bgr8')
                    ros_image.header = header

                    # Publish result
                    self.result_pub.publish(ros_image)

            except Exception as e:
                self.get_logger().error(f'Error in publishing thread: {e}')

    def complex_image_processing(self, image):
        """Example of complex image processing that benefits from threading"""
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(image, (15, 15), 0)

        # Convert to grayscale
        gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)

        # Apply adaptive threshold
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY, 11, 2)

        # Find and draw contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Draw contours on original image
        result = image.copy()
        cv2.drawContours(result, contours, -1, (0, 255, 0), 2)

        return result

def main(args=None):
    rclpy.init(args=args)
    processor = MultiThreadedImageProcessor()

    try:
        rclpy.spin(processor)
    except KeyboardInterrupt:
        pass
    finally:
        processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Perception Quality Assurance

### Perception Testing and Validation

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np
import time

class PerceptionTester(Node):
    def __init__(self):
        super().__init__('perception_tester')

        self.bridge = CvBridge()

        # Performance metrics
        self.processing_times = []
        self.fps_counter = 0
        self.fps_start_time = time.time()

        # Subscription and publisher
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.test_pub = self.create_publisher(Image, '/camera/test_results', 10)

    def image_callback(self, msg):
        """Process image and measure performance"""
        start_time = time.time()

        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Apply various perception algorithms
            result = self.run_perception_tests(cv_image)

            # Calculate processing time
            processing_time = time.time() - start_time
            self.processing_times.append(processing_time)

            # Calculate FPS
            self.fps_counter += 1
            current_time = time.time()
            if current_time - self.fps_start_time >= 1.0:
                fps = self.fps_counter / (current_time - self.fps_start_time)
                avg_processing_time = np.mean(self.processing_times[-10:]) if self.processing_times else 0
                self.get_logger().info(
                    f'FPS: {fps:.2f}, Avg Processing Time: {avg_processing_time*1000:.2f}ms'
                )
                self.fps_counter = 0
                self.fps_start_time = current_time

            # Publish result
            self.test_pub.publish(self.bridge.cv2_to_imgmsg(result, encoding='bgr8'))

        except Exception as e:
            self.get_logger().error(f'Error in perception test: {e}')

    def run_perception_tests(self, image):
        """Run various perception algorithms for testing"""
        height, width = image.shape[:2]

        # Add performance metrics overlay
        result = image.copy()

        # Add timestamp
        timestamp = f"Time: {time.time():.3f}s"
        cv2.putText(result, timestamp, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Add processing time if available
        if self.processing_times:
            avg_time = np.mean(self.processing_times[-10:]) * 1000  # Convert to ms
            time_text = f"Processing: {avg_time:.2f}ms"
            cv2.putText(result, time_text, (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Add frame dimensions
        dim_text = f"Size: {width}x{height}"
        cv2.putText(result, dim_text, (10, 90),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        return result

def main(args=None):
    rclpy.init(args=args)
    tester = PerceptionTester()

    try:
        rclpy.spin(tester)
    except KeyboardInterrupt:
        pass
    finally:
        tester.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for Robot Perception

### Design Principles

1. **Robustness**: Design perception systems to handle various lighting conditions, weather, and environmental changes
2. **Efficiency**: Optimize algorithms for real-time performance on robot hardware
3. **Accuracy**: Validate perception results against ground truth when possible
4. **Safety**: Implement failsafes and validation checks to prevent dangerous misperceptions
5. **Scalability**: Design modular systems that can be extended with new perception capabilities

### Common Pitfalls to Avoid

- Overfitting to specific lighting conditions or environments
- Ignoring sensor noise and uncertainty in perception results
- Failing to validate perception outputs before using them for navigation
- Not considering computational constraints of robot hardware
- Neglecting to test perception systems in real-world conditions

## Summary

Computer vision and perception are crucial for autonomous robotics, enabling robots to understand and interact with their environment. This module covered:

- ROS 2 image transport and processing infrastructure
- OpenCV integration with ROS 2
- Feature detection and matching techniques
- Color-based object detection
- 3D perception and depth processing
- Deep learning-based object detection
- Perception for navigation and obstacle avoidance
- Performance optimization techniques
- Quality assurance and testing methodologies

Effective perception systems require careful consideration of sensor characteristics, environmental conditions, and computational constraints. The modular design of ROS 2 allows for flexible integration of various perception algorithms, enabling robots to operate in diverse and challenging environments.

---

:::note
Perception systems are often the most challenging component of robotics to get right. Start with simple algorithms and gradually increase complexity as you understand the specific requirements and constraints of your robot's environment.
:::

:::tip
Always test perception systems in conditions similar to their intended deployment environment. Simulated environments can be useful for initial development, but real-world testing is essential for robust performance.
:::

:::warning
Perception failures can lead to dangerous situations in autonomous robots. Always implement safety checks and validation procedures before using perception results for navigation or manipulation.
:::

:::danger
Never deploy perception-based navigation systems without thorough testing and safety validation. Perception errors can cause collisions, property damage, or injury to people.
:::