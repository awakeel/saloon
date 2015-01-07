<?php

class Authorize {

    public $offset = 0;
    public $errormsg;
    public $successmsg;
    private $_siteKey;

    // method declaration
    function __construct($app) {
        $app->get('/login', function () {
            $request = Slim::getInstance()->request();
            $this->login();
        });
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

    function randomString($length = 50) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $string = '';
        for ($p = 0; $p < $length; $p++) {
            $string .= $characters[mt_rand(0, strlen($characters))];
        }
        return $string;
    }

    function hashData($data) {
        return hash_hmac('sha512', $data, $this->_siteKey);
    }

    // User login
    function login($request) {
        include("lang.php");
        $params = json_decode($request->getBody());
        $sql = "select * from employees where email = :email AND password = :password";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("email", $params->email);
            $stmt->bindParam("password", $params->password);
            $stmt->execute();
            $stmt->store_result();
            $count = $stmt->num_rows;
            $employees = $stmt->fetch(PDO::FETCH_OBJ);
            $db = null;
            // Include support for JSONP requests
            /* if (!isset($_GET['callback'])) {
              echo json_encode($employees);
              } else {
              echo $_GET['callback'] . '(' . json_encode($employees) . ');';
              } */
            //Salt and hash password for checking
            $password = $employees['password'];
            //Check email and password hash match database row
            //Convert to boolean
            $is_active = (boolean) $employees['isactivated'];
            if ($count == 0) {
                // Username and / or password are incorrect
                $this->errormsg[] = $lang['en']['auth']['login_password_failed'];
                return false;
            } else {
                if ($is_active == true) {
                    //Email/Password combination exists, set sessions
                    //First, generate a random string.
                    $random = $this->randomString();
                    //Build the token
                    $token = $_SERVER['HTTP_USER_AGENT'] . $random;
                    $token = $this->hashData($token);
                    //Setup sessions vars
                    session_start();
                    $_SESSION['token'] = $token;
                    $_SESSION['user_id'] = $employees[0]['id'];
                    $this->successmsg[] = $lang['en']['auth']['login_success'];
                    return true;
                } else {
                    $this->errormsg[] = $lang['en']['auth']['login_account_inactive'];
                    return false;
                }
            }
        } catch (PDOException $e) {
            $error = array("error" => array("text" => $e->getMessage()));
            echo json_encode($error);
        }
    }

}

?>