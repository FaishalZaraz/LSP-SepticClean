<?php
// CORS preflight handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 3600");
    http_response_code(204);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($data->email) && !empty($data->password)) {
        $query = "SELECT id, email, password, name, role FROM users WHERE email = ? LIMIT 0,1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->email);
        $stmt->execute();
        
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($data->password, $row['password'])) {
                $token = base64_encode(json_encode([
                    'id' => $row['id'],
                    'email' => $row['email'],
                    'name' => $row['name'],
                    'role' => $row['role'],
                    'exp' => time() + (24 * 60 * 60) // 24 hours
                ]));
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "user" => [
                        "id" => $row['id'],
                        "email" => $row['email'],
                        "name" => $row['name'],
                        "role" => $row['role']
                    ],
                    "token" => $token
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Invalid credentials"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email and password required"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>