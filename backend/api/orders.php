<?php
// CORS preflight handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 3600");
    http_response_code(204);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch ($method) {
    case 'GET':
        // Get all orders
        $query = "SELECT * FROM orders ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $orders = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $orders[] = $row;
        }
        
        http_response_code(200);
        echo json_encode(["success" => true, "data" => $orders]);
        break;
        
    case 'POST':
        // Create new order
        if (!empty($data->service_id) && !empty($data->customer_name)) {
            $query = "INSERT INTO orders (service_id, service_name, customer_name, customer_phone, customer_email, address, scheduled_date, notes, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([
                $data->service_id,
                $data->service_name,
                $data->customer_name,
                $data->customer_phone,
                $data->customer_email,
                $data->address,
                $data->scheduled_date,
                $data->notes,
                $data->total_price
            ])) {
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Order created successfully",
                    "id" => $db->lastInsertId()
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to create order"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Required fields missing"]);
        }
        break;
        
    case 'PUT':
        // Update order status
        if (!empty($data->id) && !empty($data->status)) {
            $query = "UPDATE orders SET status = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([$data->status, $data->id])) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Order status updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to update order status"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID and status required"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>