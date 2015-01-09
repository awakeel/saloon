<?php
class Branches
{ 

    // method declaration
    function __construct($app){
	    	$app->get('/branches', function () {
	    		$this->getAllByFranchise(1);
	    	});
    		$app->post('/branches', function () {
    			$request = Slim::getInstance()->request();
    			$this->saveBranches($request);
    		});
    			

 
        $app->post('/weeks', function () {

        	$request = Slim::getInstance()->request();
        	$this->saveTiming($request);
		
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
    function getAllByFranchise($franchiseid) { 
          
        $sql = "SELECT b.*,l.title,c.name as country,cu.`name` as currency FROM  branches b 
				INNER JOIN languages l ON l.id = b.`languageid`
				LEFT JOIN countries c ON  c.id = b.`countryid`
				LEFT JOIN currencies cu ON cu.id = b.`currencyid`
				   WHERE  franchiseid = 1  ";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("franchiseid", $franchiseid);
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
     
    function saveBranches($request){
    	 
    		$params = json_decode($request->getBody());
    		if(@$params->id){
    			if(@$params->timing){
    				$this->doLogic($params->timing,$params->id);
    				return;
    			}
    			$sql = "update branches set languageid=:l, currencyid=:c,countryid=:ct";
    			$sql .=" where id=:id";
    			try {
    				$db = getConnection();
    				$stmt = $db->prepare($sql);
    				$stmt->bindParam("l", $params->languageid);
    				$stmt->bindParam("c", $params->currencyid);
    				$stmt->bindParam("ct", $params->countryid);
    				$stmt->bindParam("id", $params->id);
    				$stmt->execute();
    				 
    				$db = null;
    				echo json_encode($params);
    			 } catch(PDOException $e) {
    				//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    				echo '{"error":{"text":'. $e->getMessage() .'}}';
    			}
    		}else{
		    		$sql = "INSERT INTO branches (name, notes,franchiseid,languageid,currencyid,countryid) ";
		    		$sql .="VALUES (:name, :notes , 1, :l, :c, :ct)";
		    		try {
		    			$db = getConnection();
		    			$stmt = $db->prepare($sql);
		    			$stmt->bindParam("name", $params->name);
		    			$stmt->bindParam("notes", $params->notes); 
		    			$stmt->bindParam("l", $params->languageid);
		    			$stmt->bindParam("c", $params->currencyid);
		    			$stmt->bindParam("ct", $params->countryid);
		    			$stmt->execute();
		    			$params->id = $db->lastInsertId();
		    			$db = null;
		    			$this->doLogic($params->timing,$params->id);
		    			echo json_encode($params);
		    		} catch(PDOException $e) {
		    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		    			echo '{"error":{"text":'. $e->getMessage() .'}}';
		    		}
    		}
    	 
    }
    function doLogic($timing,$branchid){ 
    	 $data = explode('||', $timing);
    	//$branchid = $params->branchid;
    	foreach($data as $d){
    		if($d) continue;
    		$split = explode("=",$d);
    		$days = $split[0];
    		$time = explode("##",@$split[1]);
    		$open = $time[0];
    		$close = @$time[1];
    		$this->dbSaveTiming($days,$open,$close,$branchid);
    	} 
    	 
    
    }
    function dbSaveTiming($day,$open,$close,$branchid){
    	$sql = "INSERT INTO timings (day, opened,closed,branchid) ";
    	$sql .="VALUES (:day, :opened,:closed,:branchid)";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("day", $day);
    		$stmt->bindParam("opened", $open);
    		$stmt->bindParam("closed", $close);
    		$stmt->bindParam("branchid", $branchid);
    		$stmt = $stmt->execute();
    		$db = null;
    		echo json_encode($stmt);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
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