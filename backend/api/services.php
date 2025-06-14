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
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch ($method) {
    case 'GET':
        // Get all services
        $query = "SELECT * FROM services ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $services = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['features'] = json_decode($row['features']);
            $services[] = $row;
        }
        
        http_response_code(200);
        echo json_encode(["success" => true, "data" => $services]);
        break;
        
    case 'POST':
        // Create new service
        if (!empty($data->name) && !empty($data->description) && !empty($data->price)) {
            $query = "INSERT INTO services (name, description, price, duration, image, features) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            
            $features_json = json_encode($data->features);
            
            if ($stmt->execute([
                $data->name,
                $data->description,
                $data->price,
                $data->duration,
                $data->image,
                $features_json
            ])) {
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Service created successfully",
                    "id" => $db->lastInsertId()
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to create service"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Required fields missing"]);
        }
        break;
        
    case 'PUT':
        // Update service
        if (!empty($data->id) && !empty($data->name)) {
            $query = "UPDATE services SET name = ?, description = ?, price = ?, duration = ?, image = ?, features = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            
            $features_json = json_encode($data->features);
            
            if ($stmt->execute([
                $data->name,
                $data->description,
                $data->price,
                $data->duration,
                $data->image,
                $features_json,
                $data->id
            ])) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Service updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to update service"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID and name required"]);
        }
        break;
        
    case 'DELETE':
        // Delete service
        if (!empty($data->id)) {
            $query = "DELETE FROM services WHERE id = ?";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([$data->id])) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Service deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to delete service"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID required"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>