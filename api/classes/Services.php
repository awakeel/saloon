<?php
class Services
{ 

    // method declaration
    function __construct($app){
    	$app->get('/services', function () {
    		$this->getAllByBranchId(1);
    	});
    }
    function getAll( ) {  
        $sql = "select * from branches";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $branches = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($branches);
            } else {
                echo $_GET['callback'] . '(' . json_encode($branches) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function getAllByBranchId($branchId) { 
          
        $sql = "select * from services where branchid = :  ";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("branchid", $branchId);
                    $stmt->execute();
                    $departments = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($departments);
            } else {
                echo $_GET['callback'] . '(' . json_encode($departments) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
     
    function saveLanguageTranslate($request){
    	 
    		$params = json_decode($request->getBody());
    		if(@$params->id){
    			$sql = "update branches ";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				 
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				echo json_encode($params);
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO branches (name, notes,franchiseid) ";
		    		$sql .="VALUES (:name, :notes , 1)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("name", $params->languageid);
		    			$stmt->bindParam("notes", $params->title);
		    			$stmt->bindParam("franchiseid", $params->languagetitle); 
		    	
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			$db = null;
		    			echo json_encode($params);
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
    function deleteLanguageTranslate($id){
    	 
    	$sql = "delete from branches where id=:id ";
    	 
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute(); 
    		$db = null;
    		echo json_encode($id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
}
?>