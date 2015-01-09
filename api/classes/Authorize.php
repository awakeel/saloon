<?php

class Authorize {

    public $offset = 0;
    public $errormsg;
    public $successmsg;
    private $_siteKey;

    // method declaration
    function __construct($app) {
        $app->post('/login', function () {
            $request = Slim::getInstance()->request();
            $this->login();
        });
    }
    function login() {
        $count = 0;
        if (!empty($_POST['email']) && !empty($_POST['password'])) {
            // normally you would load credentials from a database. 
            // This is just an example and is certainly not secure
            $email = $_POST['email'];
            $password = $_POST['password'];
            $sql = "select * from users where mail = '$email' AND password = '$password'";
            /* $error = array("error"=> array("text"=>$sql, "count"=>$count));
              echo json_encode($error); */
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $stmt->execute();
                //$stmt->store_result();
                //$count = $stmt->fetchColumn();
                $user = $stmt->fetch(PDO::FETCH_OBJ);
                //echo json_encode($user);
                $db = null;
                if (empty($user)) {
                    // Username and / or password are incorrect
                    $error = array("error" => array("text" => "Username and Password are invalid."));
                    echo json_encode($error);
                } else {
                    $is_active = (boolean) $user->status;
                    if ($is_active == true) {
                        //Email/Password combination exists, set sessions
                        //First, generate a random string.
                        $random = $this->randomString();
                        //Build the token
                        $token = $_SERVER['HTTP_USER_AGENT'] . $random;
                        $token = $this->hashData($token);
                        //Setup sessions vars
                        $_SESSION['token'] = $token;
                        $_SESSION['user_id'] = $user->userid;
                        //$user = array("email"=>"admin", "firstName"=>"Clint", "lastName"=>"Berry", "role"=>"user");
                        $_SESSION['user'] = $user;
                        echo json_encode($_SESSION);
                    } else {
                        $error = array("error" => array("text" => "You account is not activited yet..."));
                        echo json_encode($error);
                    }
                }
            } catch (PDOException $e) {
                $error = array("error" => array("text" => $e->getMessage()));
                echo json_encode($error);
            }
        } else {
            $error = array("error" => array("text" => "Username and Password are required."));
            echo json_encode($error);
        }
    }
    function saveRole($rolename) {
        $params = json_decode($request->getBody());
        $sql = "INSERT INTO role (name) VALUES (:name)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("name", $rolename);
            $stmt->execute();
            $params->id = $db->lastInsertId();
            $db = null;
            echo json_encode($params);
        } catch (PDOException $e) {
            //error_log($e->getMessage(), 3, '/var/tmp/php.log');
            echo '{"error":{"text":' . $e->getMessage() . '}}';
        }
    }

    function saveUserRole($uid, $rid) {
        $sql = "INSERT INTO users_role (uid, rid) ";
        $sql .="VALUES (:uid, :rid)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("uid", $uid);
            $stmt->bindParam("rid", $rid);
            $stmt->execute();
            $params->id = $db->lastInsertId();
            $db = null;
            echo json_encode($params);
        } catch (PDOException $e) {
            //error_log($e->getMessage(), 3, '/var/tmp/php.log');
            echo '{"error":{"text":' . $e->getMessage() . '}}';
        }
    }

    function savePermissions($request) {
        $params = json_decode($request->getBody());
        $sql = "INSERT INTO role_permission (rid, permission, module) ";
        $sql .="VALUES (:rid, :permission, :module)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("rid", $params->rid);
            $stmt->bindParam("permission", $params->permission);
            $stmt->bindParam("module", $params->module);
            $stmt->execute();
            $params->id = $db->lastInsertId();
            $db = null;
            echo json_encode($params);
        } catch (PDOException $e) {
            //error_log($e->getMessage(), 3, '/var/tmp/php.log');
            echo '{"error":{"text":' . $e->getMessage() . '}}';
        }
    }

    function randomString($length = 12) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $string = '';
        for ($p = 0; $p < $length; $p++) {
            $string .= $characters[mt_rand(0, strlen($characters) - 1)];
        }
        return $string;
    }

    function hashData($data) {
        return hash_hmac('sha512', $data, $this->_siteKey);
    }
}
?>