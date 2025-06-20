<?php
// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 3600");
    http_response_code(204);
    exit();
}

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Ambil JSON input
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// ========== REGISTRASI ==========
if (isset($data->register) && $data->register === true) {
    if (!empty($data->email) && !empty($data->password)) {
        // Cek duplikat email
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->bindParam(1, $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "Email sudah terdaftar"]);
            exit();
        }

        // Hash dan insert user
        $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
        $role = !empty($data->role) ? $data->role : 'customer';
        // Set name otomatis menjadi bagian sebelum @ dari email
        $name = explode('@', $data->email)[0];
        $insert = $db->prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)");
        if ($insert->execute([$data->email, $hashedPassword, $name, $role])) {
            $userId = $db->lastInsertId();
            $token = base64_encode(json_encode([
                'id' => $userId,
                'email' => $data->email,
                'name' => $name,
                'role' => $role,
                'exp' => time() + (86400) // 24 jam
            ]));

            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Registrasi berhasil",
                "user" => [
                    "id" => $userId,
                    "email" => $data->email,
                    "name" => $name,
                    "role" => $role
                ],
                "token" => $token
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Registrasi gagal"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email dan password wajib diisi untuk register"]);
    }
    exit();
}

// ========== LOGIN ==========
if (!empty($data->email) && !empty($data->password)) {
    $stmt = $db->prepare("SELECT id, email, password, name, role FROM users WHERE email = ? LIMIT 1");
    $stmt->bindParam(1, $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($data->password, $row['password'])) {
            $token = base64_encode(json_encode([
                'id' => $row['id'],
                'email' => $row['email'],
                'name' => $row['name'],
                'role' => $row['role'],
                'exp' => time() + (86400)
            ]));

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Login berhasil",
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
            echo json_encode(["success" => false, "message" => "Password salah"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email tidak ditemukan"]);
    }
    exit();
}

// ========== INVALID REQUEST ==========
http_response_code(400);
echo json_encode(["success" => false, "message" => "Email dan password wajib diisi"]);
exit();
